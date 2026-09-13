-- Script de criação das tabelas para o aplicativo MyBroth no Supabase

-- 1. Tabela de Usuários (Bro A e Bro B)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_emoji TEXT NOT NULL DEFAULT '🏋️‍♂️',
  pin_code VARCHAR(4) NOT NULL DEFAULT '1234',
  bro_points INT NOT NULL DEFAULT 0,
  streak INT NOT NULL DEFAULT 0,
  last_workout_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir os 2 Bros padrão se a tabela estiver vazia
INSERT INTO public.profiles (name, avatar_emoji, pin_code, bro_points, streak)
VALUES 
  ('Bro 1', '💪', '1234', 150, 3),
  ('Bro 2', '🔥', '4321', 120, 2)
ON CONFLICT DO NOTHING;

-- 2. Tabela de Fichas de Treino
CREATE TABLE IF NOT EXISTS public.routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  target_muscle TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Sessões de Treino
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  routine_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed'
  current_exercise TEXT,
  current_set INT DEFAULT 1,
  current_weight_kg NUMERIC(5,2) DEFAULT 0,
  bro_points_earned INT DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- 4. Tabela de Logs de Séries Concluídas
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  set_number INT NOT NULL,
  weight_kg NUMERIC(5,2) NOT NULL,
  reps INT NOT NULL,
  is_pr BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Realtime para workout_sessions e workout_logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.workout_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workout_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
