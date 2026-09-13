import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useWorkout } from '../context/WorkoutContext';
import { useActiveWorkoutSession } from '../hooks/useActiveWorkoutSession';
import { RestTimerBar } from '../components/RestTimerBar';
import { ActiveWorkoutTop } from '../components/ActiveWorkoutTop';
import { ExerciseTabList } from '../components/ExerciseTabList';
import { ActiveExerciseTable } from '../components/ActiveExerciseTable';
import { SetRegisterForm } from '../components/SetRegisterForm';
import { WorkoutFinishModal } from '../components/WorkoutFinishModal';

interface ActiveWorkoutScreenProps {
  onFinish: () => void;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({ onFinish }) => {
  const {
    activeSession,
    currentSetLogs,
    logSet,
    finishWorkout,
    cancelWorkout,
    routines,
    getLastExerciseLog,
  } = useWorkout();

  if (!activeSession) return null;

  const currentRoutine = routines.find((r) => r.id === activeSession.routine_id) || routines.find((r) => r.title === activeSession.routine_name);
  const exercises = currentRoutine ? currentRoutine.exercises : [
    { id: 'ex-def-1', name: activeSession.current_exercise || 'Exercício Inicial', defaultSets: 4, defaultReps: 10, targetMuscle: 'Geral' },
  ];

  const {
    weightKg, setWeightKg, reps, setReps,
    activeExerciseIndex, setActiveExerciseIndex,
    finishModalVisible, setFinishModalVisible,
    earnedPoints, setEarnedPoints, lastHistoryText,
  } = useActiveWorkoutSession(exercises[0], getLastExerciseLog);

  const currentExercise = exercises[activeExerciseIndex] || exercises[0];
  const logsForCurrentExercise = currentSetLogs.filter((l) => l.exercise_name === currentExercise.name);

  const handleAddSet = async () => {
    const w = parseFloat(weightKg) || 0;
    const r = parseInt(reps) || 0;
    if (w <= 0 || r <= 0) {
      Alert.alert('Atenção', 'Insira uma carga e repetições válidas!');
      return;
    }
    await logSet(currentExercise.name, w, r);
  };

  const handleCompleteWorkout = async () => {
    const result = await finishWorkout();
    setEarnedPoints(result.broPointsEarned);
    setFinishModalVisible(true);
  };

  return (
    <View className="flex-1 bg-[#0A0D14]">
      <ActiveWorkoutTop routineName={activeSession.routine_name} broPointsEarned={activeSession.bro_points_earned} onCancel={cancelWorkout} onComplete={handleCompleteWorkout} />
      <RestTimerBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <ExerciseTabList exercises={exercises} activeExerciseIndex={activeExerciseIndex} currentSetLogs={currentSetLogs} onSelectExercise={setActiveExerciseIndex} />
        <View className="bg-[#161B26] mx-5 rounded-3xl p-5 border border-[#262F42]">
          <ActiveExerciseTable currentExercise={currentExercise} logsForCurrentExercise={logsForCurrentExercise} lastHistoryText={lastHistoryText} />
          <SetRegisterForm currentExercise={currentExercise} currentSetsCount={logsForCurrentExercise.length} weightKg={weightKg} reps={reps} onChangeWeight={setWeightKg} onChangeReps={setReps} onAddSet={handleAddSet} onNextExercise={() => setActiveExerciseIndex(activeExerciseIndex + 1)} hasNextExercise={activeExerciseIndex < exercises.length - 1} />
        </View>
      </ScrollView>
      <WorkoutFinishModal visible={finishModalVisible} earnedPoints={earnedPoints} onConfirm={() => { setFinishModalVisible(false); onFinish(); }} />
    </View>
  );
};
