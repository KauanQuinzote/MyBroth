# 01: Infraestrutura da Edge Function de Presença (`presence-logger`)

**What to build:**
Criar a Supabase Edge Function Deno em `supabase/functions/presence-logger/index.ts` que recebe requisições/webhooks de alteração de presença e emite logs server-side no formato `[PRESENCE EVENT]`.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

## Acceptance Criteria
- [ ] Criar `supabase/functions/presence-logger/index.ts`.
- [ ] Implementar manipulação do payload `{ user_id, user_name, status, timestamp }`.
- [ ] Logar no formato `[PRESENCE EVENT] {user_name} ({user_id}) -> STATUS: {status} at {timestamp}`.
- [ ] Criar teste validando a formatação do log.
