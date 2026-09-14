import React from 'react';
import { View, ScrollView } from 'react-native';
import { useAuth } from '../../auth/context/AuthContext';
import { useWorkout } from '../../workout/context/WorkoutContext';
import { LivePartnerBadge } from '../../gamification';
import { HeaderBar } from '../../../shared/components/HeaderBar';
import { ActiveWorkoutBanner } from '../components/ActiveWorkoutBanner';
import { LeaderboardCard } from '../components/LeaderboardCard';
import { QuickRoutinesList } from '../components/QuickRoutinesList';

interface HomeScreenProps {
  onNavigateToWorkout: () => void;
  onNavigateToRoutines: () => void;
  onNavigateToHistory: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToWorkout,
  onNavigateToRoutines,
}) => {
  const { activeProfile, profiles } = useAuth();
  const { activeSession, routines, startWorkout } = useWorkout();

  if (!activeProfile) return null;

  return (
    <View className="flex-1 bg-[#0A0D14]">
      <HeaderBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <LivePartnerBadge />
        {activeSession && (
          <ActiveWorkoutBanner session={activeSession} onNavigate={onNavigateToWorkout} />
        )}
        <LeaderboardCard profiles={profiles} activeProfile={activeProfile} />
        <QuickRoutinesList
          routines={routines}
          onSeeAll={onNavigateToRoutines}
          onStartRoutine={async (routine) => {
            await startWorkout(routine);
            onNavigateToWorkout();
          }}
        />
      </ScrollView>
    </View>
  );
};
