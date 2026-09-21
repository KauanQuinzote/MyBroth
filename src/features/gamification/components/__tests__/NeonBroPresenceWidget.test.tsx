/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { NeonBroPresenceWidget } from '../NeonBroPresenceWidget';
import { useAuth, BroPresenceState } from '../../../auth/context/AuthContext';
import { useWorkout } from '../../../workout/context/WorkoutContext';

jest.mock('../../../auth/context/AuthContext');
jest.mock('../../../workout/context/WorkoutContext');
jest.mock('lucide-react-native', () => ({
  Activity: () => null,
  Dumbbell: () => null,
  UserCheck: () => null,
  Zap: () => null,
  Wifi: () => null,
  Users: () => null,
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedUseWorkout = useWorkout as jest.MockedFunction<typeof useWorkout>;

describe('NeonBroPresenceWidget (Subagent Tester TDD)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseWorkout.mockReturnValue({
      activeSession: null,
      partnerActiveSession: null,
      routines: [],
      startWorkout: jest.fn(),
      finishWorkout: jest.fn(),
      cancelWorkout: jest.fn(),
      logExerciseSet: jest.fn(),
    } as any);
  });

  it('should render empty state message when onlineBros is empty (0 Bros online)', () => {
    mockedUseAuth.mockReturnValue({
      activeProfile: { id: 'user-1', name: 'Kauan', initials: 'KQ', avatar_color: '#00F0FF', pin_code: '1234', bro_points: 100, streak: 3 },
      partnerProfile: null,
      profiles: [],
      isPartnerOnline: false,
      partnerStatus: 'OFFLINE',
      onlineBros: [],
      loginWithPin: jest.fn(),
      logout: jest.fn(),
      addBroPoints: jest.fn(),
      incrementStreak: jest.fn(),
      registerProfile: jest.fn(),
      isLoading: false,
    });

    render(<NeonBroPresenceWidget />);

    expect(screen.getByText(/Nenhum bro ativo no momento/i)).toBeTruthy();
  });

  it('should render Neon Cyan ONLINE NO APP badge when a bro is active in the app', () => {
    const mockOnlineBro: BroPresenceState = {
      user_id: 'bro-2',
      user_name: 'Lucas Bro',
      initials: 'LB',
      avatar_color: '#00F0FF',
      status: 'ONLINE',
      updated_at: new Date().toISOString(),
    };

    mockedUseAuth.mockReturnValue({
      activeProfile: { id: 'user-1', name: 'Kauan', initials: 'KQ', avatar_color: '#00F0FF', pin_code: '1234', bro_points: 100, streak: 3 },
      partnerProfile: null,
      profiles: [],
      isPartnerOnline: true,
      partnerStatus: 'ONLINE',
      onlineBros: [mockOnlineBro],
      loginWithPin: jest.fn(),
      logout: jest.fn(),
      addBroPoints: jest.fn(),
      incrementStreak: jest.fn(),
      registerProfile: jest.fn(),
      isLoading: false,
    });

    render(<NeonBroPresenceWidget />);

    expect(screen.getByText('Lucas Bro')).toBeTruthy();
    expect(screen.getByText('ONLINE NO APP')).toBeTruthy();
  });

  it('should render Neon Emerald TREINANDO AGORA badge with workout telemetry when a bro is training', () => {
    const mockTrainingBro: BroPresenceState = {
      user_id: 'bro-3',
      user_name: 'Matheus Fit',
      initials: 'MF',
      avatar_color: '#00FF66',
      status: 'TRAINING',
      routine_name: 'Leg Day Monstro',
      current_exercise: 'Agachamento Livre',
      current_weight_kg: 140,
      current_set: 3,
      updated_at: new Date().toISOString(),
    };

    mockedUseAuth.mockReturnValue({
      activeProfile: { id: 'user-1', name: 'Kauan', initials: 'KQ', avatar_color: '#00F0FF', pin_code: '1234', bro_points: 100, streak: 3 },
      partnerProfile: null,
      profiles: [],
      isPartnerOnline: true,
      partnerStatus: 'TRAINING',
      onlineBros: [mockTrainingBro],
      loginWithPin: jest.fn(),
      logout: jest.fn(),
      addBroPoints: jest.fn(),
      incrementStreak: jest.fn(),
      registerProfile: jest.fn(),
      isLoading: false,
    });

    render(<NeonBroPresenceWidget />);

    expect(screen.getByText('Matheus Fit')).toBeTruthy();
    expect(screen.getByText('TREINANDO AGORA')).toBeTruthy();
    expect(screen.getByText(/Leg Day Monstro/i)).toBeTruthy();
    expect(screen.getByText(/Agachamento Livre/i)).toBeTruthy();
    expect(screen.getByText(/140 kg/i)).toBeTruthy();
  });
});
