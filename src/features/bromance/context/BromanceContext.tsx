import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BromanceNudgeLog } from '../types';
import { useAuth } from '../../auth/context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../../shared/services/supabaseClient';

const NUDGES_STORAGE_KEY = '@mybroth_nudges_history';

interface BromanceContextType {
  nudgeHistory: BromanceNudgeLog[];
  activeIncomingNudge: BromanceNudgeLog | null;
  sendNudge: (text: string, category: any) => Promise<void>;
  dismissIncomingNudge: () => Promise<void>;
}

const BromanceContext = createContext<BromanceContextType>({} as BromanceContextType);

export const BromanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeProfile, partnerProfile } = useAuth();
  const [nudgeHistory, setNudgeHistory] = useState<BromanceNudgeLog[]>([]);
  const [activeIncomingNudge, setActiveIncomingNudge] = useState<BromanceNudgeLog | null>(null);

  useEffect(() => {
    loadNudgeHistory();
  }, []);

  const loadNudgeHistory = async () => {
    try {
      const data = await AsyncStorage.getItem(NUDGES_STORAGE_KEY);
      if (data) {
        setNudgeHistory(JSON.parse(data));
      }
    } catch (e) {
      console.warn('Error loading nudges:', e);
    }
  };

  // Buscar provocações pendentes (não lidas) enviadas enquanto esteve offline
  useEffect(() => {
    if (!activeProfile) return;

    const fetchPendingUnreadNudges = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('nudges')
            .select('*')
            .eq('receiver_id', activeProfile.id)
            .is('read_at', null)
            .order('created_at', { ascending: true });

          if (!error && data && data.length > 0) {
            const pendingNudge = data[0] as BromanceNudgeLog;
            setActiveIncomingNudge(pendingNudge);
          }
        } catch (err) {
          console.warn('Error fetching pending nudges from Supabase:', err);
        }
      }
    };

    fetchPendingUnreadNudges();
  }, [activeProfile]);

  // Listener de Tempo Real via Supabase Realtime WebSocket ('bro_nudges')
  useEffect(() => {
    if (!activeProfile) return;

    let nudgeChannel: any = null;

    if (isSupabaseConfigured && supabase) {
      nudgeChannel = supabase.channel('bro_nudges');

      nudgeChannel
        .on('broadcast', { event: 'nudge_event' }, (payload: any) => {
          const incoming = payload.payload as BromanceNudgeLog;
          if (incoming && incoming.receiver_id === activeProfile.id) {
            setActiveIncomingNudge(incoming);
            setNudgeHistory((prev) => [incoming, ...prev]);
            saveHistoryToStorage([incoming, ...nudgeHistory]);
          }
        })
        .subscribe();
    }

    return () => {
      if (nudgeChannel && supabase) {
        supabase.removeChannel(nudgeChannel);
      }
    };
  }, [activeProfile, nudgeHistory]);

  const saveHistoryToStorage = async (history: BromanceNudgeLog[]) => {
    try {
      await AsyncStorage.setItem(NUDGES_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Error saving nudges:', e);
    }
  };

  const sendNudge = async (text: string, category: any) => {
    if (!activeProfile || !partnerProfile) return;

    const newNudge: BromanceNudgeLog = {
      id: `nudge_${Date.now()}`,
      sender_id: activeProfile.id,
      sender_name: activeProfile.name,
      sender_initials: activeProfile.initials,
      receiver_id: partnerProfile.id,
      nudge_text: text,
      category,
      read_at: null,
      created_at: new Date().toISOString(),
    };

    const updatedHistory = [newNudge, ...nudgeHistory];
    setNudgeHistory(updatedHistory);
    await saveHistoryToStorage(updatedHistory);

    if (isSupabaseConfigured && supabase) {
      try {
        // 1. Transmitir via Realtime WebSocket para entrega instantânea se o parceiro estiver online
        const nudgeChannel = supabase.channel('bro_nudges');
        await nudgeChannel.send({
          type: 'broadcast',
          event: 'nudge_event',
          payload: newNudge,
        });

        // 2. Persistir no Postgres para entrega assíncrona caso o parceiro estivesse offline
        await supabase.from('nudges').insert([
          {
            id: newNudge.id,
            sender_id: newNudge.sender_id,
            sender_name: newNudge.sender_name,
            sender_initials: newNudge.sender_initials,
            receiver_id: newNudge.receiver_id,
            nudge_text: newNudge.nudge_text,
            category: newNudge.category,
            read_at: null,
            created_at: newNudge.created_at,
          },
        ]);
      } catch (err) {
        console.warn('Error sending realtime nudge to Supabase:', err);
      }
    }
  };

  const dismissIncomingNudge = async () => {
    if (activeIncomingNudge && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('nudges')
          .update({ read_at: new Date().toISOString() })
          .eq('id', activeIncomingNudge.id);
      } catch (err) {
        console.warn('Error updating nudge read_at status:', err);
      }
    }
    setActiveIncomingNudge(null);
  };

  return (
    <BromanceContext.Provider
      value={{
        nudgeHistory,
        activeIncomingNudge,
        sendNudge,
        dismissIncomingNudge,
      }}
    >
      {children}
    </BromanceContext.Provider>
  );
};

export const useBromance = () => useContext(BromanceContext);
