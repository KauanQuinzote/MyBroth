-- Script de criação das tabelas para o aplicativo MyBroth no Supabase

-- 1. Tabela de Usuários (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  initials VARCHAR(4) NOT NULL DEFAULT 'KD',
  avatar_color TEXT NOT NULL DEFAULT '#0A84FF',
  pin_code VARCHAR(4) NOT NULL DEFAULT '1234',
  bro_points INT NOT NULL DEFAULT 0,
  streak INT NOT NULL DEFAULT 0,
  last_workout_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir o perfil padrão de Kauan Domingues se a tabela estiver vazia
INSERT INTO public.profiles (id, name, email, initials, avatar_color, pin_code, bro_points, streak)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Kauan Domingues', 'kauandominguesdesouza@gmail.com', 'KD', '#0A84FF', '1234', 0, 0)
ON CONFLICT (id) DO NOTHING;

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

-- Habilitar Realtime para workout_sessions, workout_logs e profiles se ainda não estiverem na publicação
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'workout_sessions') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.workout_sessions;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'workout_logs') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.workout_logs;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'profiles') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;
END $$;

