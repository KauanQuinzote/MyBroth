# 03: Integração TDD do Supabase Realtime Presence & Badge Dinâmico

**What to build:**
Desenvolver via TDD a integração com `supabase.channel('bro_presence')` no `AuthContext.tsx` com suporte a status dinâmico (`'ONLINE'` vs `'TRAINING'`) e timeout de 30s. Atualizar o `LivePartnerBadge` para refletir visualmente quando o parceiro estiver **ONLINE NO APP** ou **TREINANDO AGORA**.

**Blocked by:** 01-presence-edge-function, 02-remove-local-storage-presence

**Status:** ready-for-agent

## Acceptance Criteria
- [ ] Criar arquivo de teste `src/features/auth/__tests__/AuthContext.presence.test.tsx` (Red).
- [ ] Implementar presença em tempo real e status dinâmico no `AuthContext.tsx` até os testes passarem (Green).
- [ ] Atualizar o `LivePartnerBadge` para tratar os estados `'ONLINE'` (Badge Azul) e `'TRAINING'` (Badge Verde/Treinando Agora).
- [ ] Garantir 100% de aprovação na suíte de testes (Refactor).
