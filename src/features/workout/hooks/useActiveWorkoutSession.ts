import React, { useState, useEffect } from 'react';
import { ExerciseDefinition, WorkoutSetLog } from '../../../shared/types';

export const useActiveWorkoutSession = (
  currentExercise: ExerciseDefinition | undefined,
  getLastExerciseLog: (name: string) => Promise<WorkoutSetLog | null>
) => {
  const [weightKg, setWeightKg] = useState('20');
  const [reps, setReps] = useState('10');
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [lastHistoryText, setLastHistoryText] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      if (!currentExercise) return;
      const lastLog = await getLastExerciseLog(currentExercise.name);
      if (!isMounted) return;

      if (lastLog) {
        setWeightKg(String(lastLog.weight_kg));
        setReps(String(lastLog.reps));
        setLastHistoryText(`Último treino: ${lastLog.weight_kg}kg x ${lastLog.reps} reps`);
      } else {
        setWeightKg('20');
        setReps(String(currentExercise.defaultReps || 10));
        setLastHistoryText(`Padrão da Ficha: ${currentExercise.defaultReps || 10} reps`);
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [activeExerciseIndex, currentExercise?.name]);

  return {
    weightKg,
    setWeightKg,
    reps,
    setReps,
    activeExerciseIndex,
    setActiveExerciseIndex,
    finishModalVisible,
    setFinishModalVisible,
    earnedPoints,
    setEarnedPoints,
    lastHistoryText,
  };
};
