# Specification: Real-Time Online Presence System

## 1. Overview
Esta especificação define o sistema de presença online em tempo real para parceiros do aplicativo **MyBroth**. O sistema garante notificação em tempo real de status `ONLINE` / `OFFLINE` através de WebSockets com Supabase Realtime Presence, além de auditoria e logging server-side via Supabase Edge Functions.

---

## 2. Architecture & Event Flow

```
[ App Cliente (Expo/React Native) ]
              |
              | 1. Connect & Track (WebSocket)
              v
  [ Supabase Realtime Presence ]
      |                      |
      | 2. Broadcast State   | 3. Webhook / Event Trigger
      v                      v
[ App do Parceiro ]    [ Supabase Edge Function: `on-presence-change` ]
(Badge ONLINE NO APP)         |
                              v
                       [ Server-Side Console Logs ]
```

---

## 3. Specifications

### SPEC-PRESENCE-01: WebSocket Connection & Tracking
- **Descrição**: O cliente se inscreve no canal `bro_presence` do Supabase Realtime assim que um perfil ativo faz login.
- **Payload do Presence Track**:
  ```json
  {
    "user_id": "profile_id_here",
    "user_name": "Nome do Usuário",
    "online_at": "ISO-8601 Timestamp"
  }
  ```
- **Comportamento no Logout/Desconexão**: Ao efetuar logout ou fechar a sessão, o cliente executa `.untrack()` e cancela a inscrição no canal.

### SPEC-PRESENCE-02: Server-Side Debugging & Logging (Edge Function)
- **Descrição**: Uma Edge Function em Deno (`supabase/functions/presence-logger/index.ts`) processa notificações de alteração de presença.
- **Comportamento do Log**:
  - Imprime em stdout (`console.log`) com estrutura formatada:
    `[PRESENCE EVENT] User {user_name} ({user_id}) IS NOW ONLINE at {timestamp}`
    `[PRESENCE EVENT] User {user_name} ({user_id}) IS NOW OFFLINE at {timestamp}`
  - Os logs ficam acessíveis em tempo real no painel do Supabase (**Edge Functions -> Logs**).

### SPEC-PRESENCE-03: State Consumption & UI Updates
- **Descrição**: O `AuthContext` mantém o estado `isPartnerOnline` sincronizado via listener de `presenceState()`.
- **Regras de Visualização**:
  - Quando `isPartnerOnline === true`, o [LivePartnerBadge](file:///home/kauan/Documentos/MyBroth/src/features/gamification/components/LivePartnerBadge.tsx) exibe o indicador visual azul e o texto "ONLINE NO APP".
  - Remove totalmente os mecanismos legados de fallback local (`AsyncStorage` / `BroadcastChannel`) que causavam falsos positivos/falsos negativos.

---

## 5. Test-Driven Development (TDD) Plan

Cada funcionalidade desta especificação será desenvolvida seguindo o ciclo **Red -> Green -> Refactor**:

1. **Red**: Escrever testes unitários/integração que falham antes de modificar o código da aplicação.
2. **Green**: Implementar o código mínimo necessário para fazer os testes passarem.
3. **Refactor**: Limpar e otimizar o código sem quebrar a suíte de testes.

### Suíte de Testes Requerida:
- **`src/features/auth/__tests__/AuthContext.presence.test.tsx`**:
  - Teste 1 (Red/Green): Deve inscrever no canal `bro_presence` do Supabase e disparar `.track()` ao ativar um perfil.
  - Teste 2 (Red/Green): Deve atualizar `isPartnerOnline` para `true` quando o evento `presenceState` contiver o parceiro.
  - Teste 3 (Red/Green): Deve desativar e chamar `.untrack()` ao efetuar logout.
- **`supabase/functions/presence-logger/__tests__/presence-logger.test.ts`**:
  - Teste 1 (Red/Green): Deve processar o payload de presença e gerar os logs formatados server-side no formato `[PRESENCE EVENT]`.

---

## 6. Tickets de Desenvolvimento (Breakdown to-tickets)

A implementação será quebrada em tickets de fatias verticais (*Tracer Bullets*):

### **TICKET-01: Infraestrutura da Edge Function de Presença (`presence-logger`)**
- **Bloqueado por**: Nenhum (Início imediato).
- **Entregável**: Função Deno em `supabase/functions/presence-logger/index.ts` com testes que logam eventos de conexão/desconexão server-side.
- **Critérios de Aceitação**:
  - [ ] Edge Function criada e testada.
  - [ ] Log no formato `[PRESENCE EVENT] User {user_name} ({user_id}) IS NOW ONLINE/OFFLINE`.

### **TICKET-02: Limpeza dos Falantes Locais (`AsyncStorage` / `BroadcastChannel`)**
- **Bloqueado por**: Nenhum.
- **Entregável**: Remoção de métodos legados em `storage.ts` e limpezas em `AuthContext.tsx`.
- **Critérios de Aceitação**:
  - [ ] `ONLINE_KEY` e funções locais de presença removidas de `storage.ts`.
  - [ ] `BroadcastChannel` e polling por `setInterval` removidos de `AuthContext.tsx`.

### **TICKET-03: Implementação TDD do Client Supabase Presence no AuthContext**
- **Bloqueado por**: TICKET-01 e TICKET-02.
- **Entregável**: Integração completa via TDD do Supabase Realtime Presence no `AuthContext.tsx`.
- **Critérios de Aceitação**:
  - [ ] Testes de integração em `AuthContext.presence.test.tsx` cobrindo conexão, reconexão e estado online do parceiro.
  - [ ] `isPartnerOnline` sincronizado exclusivamente via WebSocket Supabase Realtime.
  - [ ] Invocação automática da Edge Function de log ao mudar o estado de presença.
