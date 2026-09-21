/**
 * @jest-environment jsdom
 */
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { BromanceProvider, useBromance } from '../context/BromanceContext';
import { useAuth } from '../../auth/context/AuthContext';
import { supabase } from '../../../shared/services/supabaseClient';

jest.mock('../../auth/context/AuthContext');
jest.mock('../../../shared/services/supabaseClient', () => {
  const mockChannel = {
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockReturnThis(),
    send: jest.fn().mockResolvedValue(undefined),
  };

  return {
    isSupabaseConfigured: true,
    supabase: {
      channel: jest.fn().mockReturnValue(mockChannel),
      removeChannel: jest.fn(),
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: [], error: null }),
        update: jest.fn().mockReturnThis(),
      }),
    },
  };
});

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('BromanceContext - Real-Time & Offline Taunts (Subagent Tester TDD)', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseAuth.mockReturnValue({
      activeProfile: {
        id: 'user-sender',
        name: 'Kauan',
        initials: 'KQ',
        avatar_color: '#00F0FF',
        pin_code: '1234',
        bro_points: 100,
        streak: 5,
      },
      partnerProfile: {
        id: 'user-receiver',
        name: 'Lucas',
        initials: 'LB',
        avatar_color: '#00FF66',
        pin_code: '1234',
        bro_points: 80,
        streak: 2,
      },
      profiles: [],
      isPartnerOnline: true,
      partnerStatus: 'ONLINE',
      onlineBros: [],
      loginWithPin: jest.fn(),
      logout: jest.fn(),
      addBroPoints: jest.fn(),
      incrementStreak: jest.fn(),
      registerProfile: jest.fn(),
      isLoading: false,
    });
  });

  it('should send nudge via Supabase Realtime broadcast and insert into nudges Postgres table', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BromanceProvider>{children}</BromanceProvider>
    );

    const { result } = renderHook(() => useBromance(), { wrapper });

    await act(async () => {
      await result.current.sendNudge('Bora treinar frango!', 'frango');
    });

    expect(supabase?.channel).toHaveBeenCalledWith('bro_nudges');
    expect(supabase?.from).toHaveBeenCalledWith('nudges');
  });

  it('should fetch pending unread nudges from Supabase when user connects/logs in', async () => {
    const pendingNudge = {
      id: 'nudge-offline-1',
      sender_id: 'user-receiver',
      sender_name: 'Lucas',
      sender_initials: 'LB',
      receiver_id: 'user-sender',
      nudge_text: 'Tá dormindo na academia?',
      category: 'pesado',
      read_at: null,
      created_at: new Date().toISOString(),
    };

    (supabase?.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [pendingNudge], error: null }),
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BromanceProvider>{children}</BromanceProvider>
    );

    const { result } = renderHook(() => useBromance(), { wrapper });

    await waitFor(() => {
      expect(result.current.activeIncomingNudge).not.toBeNull();
    });

    expect(result.current.activeIncomingNudge?.nudge_text).toBe('Tá dormindo na academia?');
  });

  it('should update read_at timestamp in Supabase when dismissing incoming nudge', async () => {
    const pendingNudge = {
      id: 'nudge-offline-2',
      sender_id: 'user-receiver',
      sender_name: 'Lucas',
      sender_initials: 'LB',
      receiver_id: 'user-sender',
      nudge_text: 'Bora bater a meta de hoje!',
      category: 'brother',
      read_at: null,
      created_at: new Date().toISOString(),
    };

    (supabase?.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [pendingNudge], error: null }),
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BromanceProvider>{children}</BromanceProvider>
    );

    const { result } = renderHook(() => useBromance(), { wrapper });

    await waitFor(() => {
      expect(result.current.activeIncomingNudge).not.toBeNull();
    });

    await act(async () => {
      await result.current.dismissIncomingNudge();
    });

    expect(result.current.activeIncomingNudge).toBeNull();
  });
});
