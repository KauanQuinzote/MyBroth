import React, { createContext, useContext, useEffect, useState } from 'react';
import { BroProfile } from '../../../shared/types';
import { LocalStorageService, DEFAULT_PROFILES } from '../../../shared/services/storage';
import { supabase, isSupabaseConfigured } from '../../../shared/services/supabaseClient';

export type PartnerPresenceStatus = 'ONLINE' | 'TRAINING' | 'OFFLINE';

interface AuthContextType {
  activeProfile: BroProfile | null;
  partnerProfile: BroProfile | null;
  profiles: BroProfile[];
  isPartnerOnline: boolean;
  partnerStatus: PartnerPresenceStatus;
  loginWithPin: (profileId: string, pin: string) => boolean;
  logout: () => void;
  addBroPoints: (amount: number) => Promise<void>;
  incrementStreak: () => Promise<void>;
  registerProfile: (data: Omit<BroProfile, 'id' | 'bro_points' | 'streak'>) => Promise<BroProfile>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<BroProfile[]>(DEFAULT_PROFILES);
  const [activeProfile, setActiveProfile] = useState<BroProfile | null>(null);
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState<PartnerPresenceStatus>('OFFLINE');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setIsLoading(true);
    let loadedProfiles: BroProfile[] = [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*');
        if (!error && data && data.length > 0) {
          loadedProfiles = data as BroProfile[];
          await LocalStorageService.saveProfiles(loadedProfiles);
        } else {
          loadedProfiles = await LocalStorageService.getProfiles();
        }
      } catch (err) {
        console.warn('Failed to load profiles from Supabase cloud, falling back to local storage:', err);
        loadedProfiles = await LocalStorageService.getProfiles();
      }
    } else {
      loadedProfiles = await LocalStorageService.getProfiles();
    }

    setProfiles(loadedProfiles);
    setIsLoading(false);
  };

  const partnerProfile = activeProfile
    ? profiles.find((p) => p.id !== activeProfile.id) || null
    : null;

  // Gerenciamento de Presença em Tempo Real via Supabase Presence (WebSockets)
  useEffect(() => {
    if (!activeProfile) {
      setIsPartnerOnline(false);
      setPartnerStatus('OFFLINE');
      return;
    }

    let presenceChannel: any = null;

    if (isSupabaseConfigured && supabase) {
      presenceChannel = supabase.channel('bro_presence');

      presenceChannel
        .on('presence', { event: 'sync' }, () => {
          const state = presenceChannel.presenceState();
          if (partnerProfile) {
            let foundStatus: PartnerPresenceStatus = 'OFFLINE';
            let isOnline = false;

            Object.values(state).forEach((presences: any) => {
              presences.forEach((p: any) => {
                if (p.user_id === partnerProfile.id) {
                  isOnline = true;
                  foundStatus = p.status || 'ONLINE';
                }
              });
            });

            setIsPartnerOnline(isOnline);
            setPartnerStatus(isOnline ? foundStatus : 'OFFLINE');
          }
        })
        .subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED') {
            const trackPayload = {
              user_id: activeProfile.id,
              user_name: activeProfile.name,
              status: 'ONLINE',
              updated_at: new Date().toISOString(),
            };

            await presenceChannel.track(trackPayload);

            // Log server-side via Edge Function
            try {
              if (supabase?.functions) {
                await supabase.functions.invoke('presence-logger', {
                  body: trackPayload,
                });
              }
            } catch (err) {
              console.warn('Presence logger invocation failed:', err);
            }
          }
        });
    }

    return () => {
      if (presenceChannel && supabase) {
        if (activeProfile && supabase.functions) {
          supabase.functions.invoke('presence-logger', {
            body: {
              user_id: activeProfile.id,
              user_name: activeProfile.name,
              status: 'OFFLINE',
              updated_at: new Date().toISOString(),
            },
          }).catch((err) => console.warn('Offline presence logger invocation failed:', err));
        }
        presenceChannel.untrack();
        supabase.removeChannel(presenceChannel);
      }
    };
  }, [activeProfile, partnerProfile]);

  const loginWithPin = (profileId: string, pin: string): boolean => {
    const target = profiles.find((p) => p.id === profileId);
    if (target && target.pin_code === pin) {
      setActiveProfile(target);
      return true;
    }
    return false;
  };

  const logout = () => {
    setActiveProfile(null);
    setIsPartnerOnline(false);
    setPartnerStatus('OFFLINE');
  };

  const addBroPoints = async (amount: number) => {
    if (!activeProfile) return;
    const updatedProfiles = profiles.map((p) => {
      if (p.id === activeProfile.id) {
        return { ...p, bro_points: p.bro_points + amount };
      }
      return p;
    });
    setProfiles(updatedProfiles);
    const currentActive = updatedProfiles.find((p) => p.id === activeProfile.id);
    if (currentActive) setActiveProfile(currentActive);
    await LocalStorageService.saveProfiles(updatedProfiles);
  };

  const incrementStreak = async () => {
    if (!activeProfile) return;
    const today = new Date().toISOString().split('T')[0];
    if (activeProfile.last_workout_date === today) return;

    const updatedProfiles = profiles.map((p) => {
      if (p.id === activeProfile.id) {
        return {
          ...p,
          streak: p.streak + 1,
          last_workout_date: today,
        };
      }
      return p;
    });
    setProfiles(updatedProfiles);
    const currentActive = updatedProfiles.find((p) => p.id === activeProfile.id);
    if (currentActive) setActiveProfile(currentActive);
    await LocalStorageService.saveProfiles(updatedProfiles);
  };

  const registerProfile = async (
    data: Omit<BroProfile, 'id' | 'bro_points' | 'streak'>
  ): Promise<BroProfile> => {
    const id = 'bro_' + Date.now();
    const created: BroProfile = {
      id,
      bro_points: 0,
      streak: 0,
      ...data,
    };
    const updated = [...profiles, created];
    setProfiles(updated);
    await LocalStorageService.saveProfiles(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('profiles').insert([
          {
            id: created.id,
            name: created.name,
            initials: created.initials,
            avatar_color: created.avatar_color,
            pin_code: created.pin_code,
            email: created.email,
            bro_points: 0,
            streak: 0,
          },
        ]);
      } catch (err) {
        console.warn('Failed to sync profile to cloud:', err);
      }
    }
    return created;
  };

  return (
    <AuthContext.Provider
      value={{
        activeProfile,
        partnerProfile,
        profiles,
        isPartnerOnline,
        partnerStatus,
        loginWithPin,
        logout,
        addBroPoints,
        incrementStreak,
        registerProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

