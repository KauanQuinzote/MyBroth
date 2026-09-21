# 02: Limpeza de Mecanismos Legados de Presença Local (`AsyncStorage` e `BroadcastChannel`)

**What to build:**
Remover todo o código legado de polling local em `AsyncStorage` (`@mybroth_online_presence`) e `BroadcastChannel` que causavam falsos positivos e gargalos ao tentar simular presencia entre dispositivos remotos.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

## Acceptance Criteria
- [ ] Remover `ONLINE_KEY`, `getOnlinePresenceMap` e `setProfileOnlineState` de `src/shared/services/storage.ts`.
- [ ] Remover chamadas de `setInterval` com `setProfileOnlineState` e escutas de `BroadcastChannel` em `src/features/auth/context/AuthContext.tsx`.
- [ ] Garantir compilação limpa sem erros TypeScript.
