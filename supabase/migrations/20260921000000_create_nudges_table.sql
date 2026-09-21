-- Migração: Criação da tabela nudges e habilitação do Supabase Realtime

CREATE TABLE IF NOT EXISTS public.nudges (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_initials TEXT,
  receiver_id TEXT NOT NULL,
  nudge_text TEXT NOT NULL,
  category TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.nudges;
