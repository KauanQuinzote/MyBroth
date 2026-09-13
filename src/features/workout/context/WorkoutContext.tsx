import React, { createContext, useContext, useEffect, useState } from 'react';
import { WorkoutRoutine, WorkoutSession, WorkoutSetLog, ExerciseDefinition } from '../../../shared/types';
import { LocalStorageService } from '../../../shared/services/storage';
import { supabase, isSupabaseConfigured } from '../../../shared/services/supabaseClient';
import { useAuth } from '../../auth';

interface WorkoutContextType {
  activeSession: WorkoutSession | null;
  partnerActiveSession: WorkoutSession | null;
  currentSetLogs: WorkoutSetLog[];
  partnerSetLogs: WorkoutSetLog[];
  routines: WorkoutRoutine[];
  startWorkout: (routine: WorkoutRoutine) => Promise<void>;
  logSet: (exerciseName: string, weightKg: number, reps: number) => Promise<void>;
  finishWorkout: () => Promise<{ broPointsEarned: number }>;
  cancelWorkout: () => void;
  restTimerSeconds: number;
  isTimerRunning: boolean;
  startRestTimer: (duration?: number) => void;
  addRoutine: (title: string, targetMuscle: string) => Promise<WorkoutRoutine>;
  addExerciseToRoutine: (routineId: string, name: string, sets: number, reps: number, muscle: string) => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType>({} as WorkoutContextType);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeProfile, partnerProfile, addBroPoints, incrementStreak } = useAuth();
  
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [partnerActiveSession, setPartnerActiveSession] = useState<WorkoutSession | null>(null);
  const [currentSetLogs, setCurrentSetLogs] = useState<WorkoutSetLog[]>([]);
  const [partnerSetLogs, setPartnerSetLogs] = useState<WorkoutSetLog[]>([]);

  const [restTimerSeconds, setRestTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    LocalStorageService.getRoutines().then(setRoutines);
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && restTimerSeconds > 0) {
      interval = setInterval(() => {
        setRestTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (restTimerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, restTimerSeconds]);

  const startRestTimer = (duration: number = 60) => {
    setRestTimerSeconds(duration);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const subscription = supabase
      .channel('public:workout_sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'workout_sessions' },
        (payload) => {
          const updated = payload.new as WorkoutSession;
          if (partnerProfile && updated.user_id === partnerProfile.id) {
            if (updated.status === 'in_progress') {
              setPartnerActiveSession(updated);
            } else {
              setPartnerActiveSession(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(subscription);
      }
    };
  }, [partnerProfile]);

  const addRoutine = async (title: string, targetMuscle: string): Promise<WorkoutRoutine> => {
    const newRoutine: WorkoutRoutine = {
      id: `routine_${Date.now()}`,
      title,
      target_muscle: targetMuscle,
      exercises: [],
    };

    const updated = [...routines, newRoutine];
    setRoutines(updated);
    await LocalStorageService.addRoutine(newRoutine);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('routines').insert({
        id: newRoutine.id,
        title: newRoutine.title,
        target_muscle: newRoutine.target_muscle,
        created_by: activeProfile?.id,
        exercises: [],
      });
    }

    return newRoutine;
  };

  const addExerciseToRoutine = async (
    routineId: string,
    name: string,
    sets: number,
    reps: number,
    muscle: string
  ): Promise<void> => {
    const targetRoutine = routines.find((r) => r.id === routineId);
    if (!targetRoutine) return;

    const newExercise: ExerciseDefinition = {
      id: `ex_${Date.now()}`,
      name,
      defaultSets: sets,
      defaultReps: reps,
      targetMuscle: muscle || targetRoutine.target_muscle,
    };

    const updatedRoutine: WorkoutRoutine = {
      ...targetRoutine,
      exercises: [...targetRoutine.exercises, newExercise],
    };

    const updatedRoutines = routines.map((r) => (r.id === routineId ? updatedRoutine : r));
    setRoutines(updatedRoutines);
    await LocalStorageService.updateRoutine(updatedRoutine);

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('routines')
        .update({ exercises: updatedRoutine.exercises })
        .eq('id', routineId);
    }
  };

  const startWorkout = async (routine: WorkoutRoutine) => {
    if (!activeProfile) return;

    const newSession: WorkoutSession = {
      id: `session_${Date.now()}`,
      user_id: activeProfile.id,
      routine_name: routine.title,
      status: 'in_progress',
      current_exercise: routine.exercises[0]?.name || 'Exercício Inicial',
      current_set: 1,
      current_weight_kg: 0,
      bro_points_earned: 50,
      started_at: new Date().toISOString(),
    };

    setActiveSession(newSession);
    setCurrentSetLogs([]);
    await LocalStorageService.saveSession(newSession);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('workout_sessions').insert(newSession);
    }
  };

  const logSet = async (exerciseName: string, weightKg: number, reps: number) => {
    if (!activeSession) return;

    const setNumber = currentSetLogs.filter((s) => s.exercise_name === exerciseName).length + 1;
    const isPR = weightKg >= 100 || (setNumber === 1 && weightKg > 50);

    const newLog: WorkoutSetLog = {
      id: `log_${Date.now()}`,
      session_id: activeSession.id,
      exercise_name: exerciseName,
      set_number: setNumber,
      weight_kg: weightKg,
      reps: reps,
      is_pr: isPR,
      created_at: new Date().toISOString(),
    };

    const updatedLogs = [...currentSetLogs, newLog];
    setCurrentSetLogs(updatedLogs);

    const pointsGained = 10 + (isPR ? 25 : 0);
    const updatedSession: WorkoutSession = {
      ...activeSession,
      current_exercise: exerciseName,
      current_set: setNumber + 1,
      current_weight_kg: weightKg,
      bro_points_earned: activeSession.bro_points_earned + pointsGained,
    };

    setActiveSession(updatedSession);
    await LocalStorageService.saveSession(updatedSession);
    await LocalStorageService.saveSetLog(activeSession.id, newLog);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('workout_sessions').update(updatedSession).eq('id', activeSession.id);
      await supabase.from('workout_logs').insert(newLog);
    }

    startRestTimer(60);
  };

  const finishWorkout = async (): Promise<{ broPointsEarned: number }> => {
    if (!activeSession) return { broPointsEarned: 0 };

    const totalEarned = activeSession.bro_points_earned + 100;
    const completedSession: WorkoutSession = {
      ...activeSession,
      status: 'completed',
      ended_at: new Date().toISOString(),
      bro_points_earned: totalEarned,
    };

    await LocalStorageService.saveSession(completedSession);
    await addBroPoints(totalEarned);
    await incrementStreak();

    if (isSupabaseConfigured && supabase) {
      await supabase.from('workout_sessions').update(completedSession).eq('id', activeSession.id);
    }

    setActiveSession(null);
    setCurrentSetLogs([]);
    return { broPointsEarned: totalEarned };
  };

  const cancelWorkout = () => {
    setActiveSession(null);
    setCurrentSetLogs([]);
  };

  return (
    <WorkoutContext.Provider
      value={{
        activeSession,
        partnerActiveSession,
        currentSetLogs,
        partnerSetLogs,
        routines,
        startWorkout,
        logSet,
        finishWorkout,
        cancelWorkout,
        restTimerSeconds,
        isTimerRunning,
        startRestTimer,
        addRoutine,
        addExerciseToRoutine,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => useContext(WorkoutContext);
