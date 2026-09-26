-- Migração: Adicionar coluna audio_url na tabela nudges
ALTER TABLE public.nudges ADD COLUMN IF NOT EXISTS audio_url TEXT;
