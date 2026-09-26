# Ticket 01: Tipos, Schema Supabase e Catálogo de Memes

- **Spec Relacionada**: [soundboard-memes-spec.md](file:///home/kauan/Documentos/MyBroth/documentation/soundboard-memes-spec.md)
- **Status**: Open
- **Bloqueado por**: Nenhum

## Descrição
Adicionar `audio_url?: string | null` na interface `BromanceNudgeLog`, criar a migração Postgres no Supabase e expor o catálogo `MEME_SOUNDBOARD` de sons pré-definidos.

## Critérios de Aceitação
- [ ] Tipo `BromanceNudgeLog` atualizado com `audio_url`.
- [ ] Catálogo `MEME_SOUNDBOARD` exportado em `src/features/bromance/data/soundboardData.ts`.
- [ ] Migração SQL criada em `supabase/migrations/`.
