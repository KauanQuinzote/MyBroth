/**
 * @jest-environment jsdom
 */
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { supabase } from '../../../shared/services/supabaseClient';

jest.mock('../../../shared/services/supabaseClient', () => {
  const mockChannel = {
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockImplementation((cb) => {
      if (cb) cb('SUBSCRIBED');
      return mockChannel;
    }),
    track: jest.fn().mockResolvedValue(undefined),
    untrack: jest.fn().mockResolvedValue(undefined),
    presenceState: jest.fn().mockReturnValue({}),
  };

  return {
    isSupabaseConfigured: true,
    supabase: {
      channel: jest.fn().mockReturnValue(mockChannel),
      removeChannel: jest.fn(),
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: [], error: null }),
      }),
      functions: {
        invoke: jest.fn().mockResolvedValue({ data: { success: true }, error: null }),
      },
    },
  };
});

describe('AuthContext - Real-Time Presence & Edge Function Logging (TDD)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default offline partner state', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isPartnerOnline).toBe(false);
    expect(result.current.partnerStatus).toBe('OFFLINE');
    expect(result.current.activeProfile).toBeNull();
  });

  it('should set user ONLINE, subscribe to bro_presence, track status, and invoke edge function on login', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const success = result.current.loginWithPin('kauan-profile-id', '1234');
      expect(success).toBe(true);
    });

    expect(result.current.activeProfile?.id).toBe('kauan-profile-id');
    expect(supabase?.channel).toHaveBeenCalledWith('bro_presence');

    await waitFor(() => {
      expect(supabase?.functions.invoke).toHaveBeenCalledWith('presence-logger', {
        body: expect.objectContaining({
          user_id: 'kauan-profile-id',
          status: 'ONLINE',
        }),
      });
    });
  });

  it('should set user OFFLINE, untrack presence, remove channel, and invoke edge function on logout', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      result.current.loginWithPin('kauan-profile-id', '1234');
    });

    expect(result.current.activeProfile).not.toBeNull();

    await act(async () => {
      result.current.logout();
    });

    expect(result.current.activeProfile).toBeNull();
    expect(result.current.isPartnerOnline).toBe(false);
    expect(result.current.partnerStatus).toBe('OFFLINE');

    await waitFor(() => {
      expect(supabase?.functions.invoke).toHaveBeenCalledWith('presence-logger', {
        body: expect.objectContaining({
          user_id: 'kauan-profile-id',
          status: 'OFFLINE',
        }),
      });
    });
  });
});
