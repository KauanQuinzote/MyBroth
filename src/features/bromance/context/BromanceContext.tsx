import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BromanceNudgeLog } from '../types';
import { useAuth } from '../../auth/context/AuthContext';

const NUDGES_STORAGE_KEY = '@mybroth_nudges_history';

interface BromanceContextType {
  nudgeHistory: BromanceNudgeLog[];
  activeIncomingNudge: BromanceNudgeLog | null;
  sendNudge: (text: string, category: any) => Promise<void>;
  dismissIncomingNudge: () => void;
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

  // BroadcastChannel & Realtime Listener
  useEffect(() => {
    if (!activeProfile) return;

    let bc: any = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new (window as any).BroadcastChannel('mybroth_nudges_channel');
        bc.onmessage = (event: any) => {
          if (event.data && event.data.receiver_id === activeProfile.id) {
            const newNudge: BromanceNudgeLog = event.data;
            setActiveIncomingNudge(newNudge);
            setNudgeHistory((prev) => [newNudge, ...prev]);
            saveHistoryToStorage([newNudge, ...nudgeHistory]);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }

    return () => {
      if (bc) bc.close();
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
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [newNudge, ...nudgeHistory];
    setNudgeHistory(updatedHistory);
    await saveHistoryToStorage(updatedHistory);

    // Envia via BroadcastChannel local (Web/Dev)
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new (window as any).BroadcastChannel('mybroth_nudges_channel');
        bc.postMessage(newNudge);
        bc.close();
      } catch (e) {}
    }
  };

  const dismissIncomingNudge = () => {
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
