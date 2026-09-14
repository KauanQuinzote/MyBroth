import React, { createContext, useContext, useEffect, useState } from 'react';
import { BroProfile } from '../../../shared/types';
import { LocalStorageService, DEFAULT_PROFILES } from '../../../shared/services/storage';
import { supabase, isSupabaseConfigured } from '../../../shared/services/supabaseClient';

interface AuthContextType {
  activeProfile: BroProfile | null;
  partnerProfile: BroProfile | null;
  profiles: BroProfile[];
  isPartnerOnline: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setIsLoading(true);
    const stored = await LocalStorageService.getProfiles();
    setProfiles(stored);
    setIsLoading(false);
  };

  const partnerProfile = activeProfile
    ? profiles.find((p) => p.id !== activeProfile.id) || null
    : null;

  // Transmissão e Escuta de Presença via Supabase Presence & Storage & BroadcastChannel
  useEffect(() => {
    if (!activeProfile) {
      setIsPartnerOnline(false);
      return;
    }

    const checkPartnerOnline = async () => {
      if (!partnerProfile) return;
      // Atualiza o heartbeat do perfil ativo continuamente
      await LocalStorageService.setProfileOnlineState(activeProfile.id, true);

      const presenceMap = await LocalStorageService.getOnlinePresenceMap();
      const lastSeen = presenceMap[partnerProfile.id];
      // Considera online se marcou presença nos últimos 60s
      const online = Boolean(lastSeen && Date.now() - lastSeen < 60000);
      setIsPartnerOnline(online);
    };

    checkPartnerOnline();
    const interval = setInterval(checkPartnerOnline, 3000);

    // Suporte a BroadcastChannel para sincronização instantânea em abas web no mesmo ambiente dev
    let bc: any = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new (window as any).BroadcastChannel('mybroth_presence_channel');
        bc.onmessage = (event: any) => {
          if (event.data && event.data.profileId === partnerProfile?.id) {
            if (event.data.type === 'ONLINE') {
              setIsPartnerOnline(true);
            } else if (event.data.type === 'OFFLINE') {
              setIsPartnerOnline(false);
            }
          }
        };
        bc.postMessage({ type: 'ONLINE', profileId: activeProfile.id });
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }

    // Se o Supabase estiver configurado, usa canais Supabase Presence
    let presenceChannel: any = null;
    if (isSupabaseConfigured && supabase) {
      presenceChannel = supabase.channel('bro_presence');

      presenceChannel
        .on('presence', { event: 'sync' }, () => {
          const state = presenceChannel.presenceState();
          if (partnerProfile) {
            const hasPartner = Object.values(state).some((presences: any) =>
              presences.some((p: any) => p.user_id === partnerProfile.id)
            );
            setIsPartnerOnline(hasPartner);
          }
        })
        .subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED') {
            await presenceChannel.track({
              user_id: activeProfile.id,
              online_at: new Date().toISOString(),
            });
          }
        });
    }

    return () => {
      clearInterval(interval);
      LocalStorageService.setProfileOnlineState(activeProfile.id, false);
      if (bc) {
        try {
          bc.postMessage({ type: 'OFFLINE', profileId: activeProfile.id });
          bc.close();
        } catch (e) {}
      }
      if (presenceChannel && supabase) {
        presenceChannel.untrack();
        supabase.removeChannel(presenceChannel);
      }
    };
  }, [activeProfile, partnerProfile]);

  const loginWithPin = (profileId: string, pin: string): boolean => {
    const target = profiles.find((p) => p.id === profileId);
    if (target && target.pin_code === pin) {
      setActiveProfile(target);
      LocalStorageService.setProfileOnlineState(target.id, true);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (activeProfile) {
      LocalStorageService.setProfileOnlineState(activeProfile.id, false);
    }
    setActiveProfile(null);
    setIsPartnerOnline(false);
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
