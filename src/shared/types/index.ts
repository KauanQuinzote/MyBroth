export interface BroProfile {
  id: string;
  name: string;
  initials: string;
  avatar_color: string;
  pin_code: string;
  bro_points: number;
  streak: number;
  email?: string;
  supabase_user_id?: string;
  last_workout_date?: string;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  defaultSets: number;
  defaultReps: number;
  targetMuscle: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  target_muscle: string;
  exercises: ExerciseDefinition[];
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  routine_id?: string;
  routine_name: string;
  status: 'in_progress' | 'completed';
  current_exercise?: string;
  current_set?: number;
  current_weight_kg?: number;
  bro_points_earned: number;
  started_at: string;
  ended_at?: string;
}

export interface WorkoutSetLog {
  id: string;
  session_id: string;
  exercise_name: string;
  set_number: number;
  weight_kg: number;
  reps: number;
  is_pr?: boolean;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  pointsReward: number;
  unlockedAt?: string;
}
