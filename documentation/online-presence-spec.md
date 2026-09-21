# Specification: Real-Time Online & Training Presence System

- **Feature**: Real-Time Online Presence
- **Branch**: `feature/online-presence-system`
- **Status**: Concluída (100% Implementada)

---

## 1. Overview & Business Value

O sistema de presença em tempo real do **MyBroth** permite que parceiros de treino visualizem o status atual do seu "Bro" instantaneamente. O sistema suporta dois estados de atividade remota:
1. **`ONLINE NO APP`**: O parceiro está navegando no aplicativo com conexão ativa via WebSocket.
2. **`TREINANDO AGORA`**: O parceiro possui uma sessão de treino ativa em andamento no aplicativo.
3. **`OFFLINE`**: O parceiro está desconectado ou inativo há mais de 30 segundos.

---

## 2. Architecture & Event Stream

```
[ Cliente A (App Expo) ] 
       │ 1. Presence Track { user_id, status: 'ONLINE' | 'TRAINING' }
       ▼
[ Supabase Realtime WebSocket Channel: 'bro_presence' ]
       │                                     │
       │ 2. Broadcast State Sync             │ 3. Log Event Webhook
       ▼                                     ▼
[ Cliente B (App Expo) ]              [ Supabase Edge Function ]
(Atualiza LivePartnerBadge)           (presence-logger -> Server Console)
```

---

## 3. Specifications (Core Requirements)

### SPEC-PRESENCE-01: WebSocket Presence Channel Tracking
- **Descrição**: O aplicativo deve conectar ao canal `bro_presence` no Supabase assim que houver um `activeProfile`.
- **Payload do Presence Track**:
  ```typescript
  interface PresencePayload {
    user_id: string;
    user_name: string;
    status: 'ONLINE' | 'TRAINING';
    workout_session_id?: string;
    updated_at: string; // ISO-8601
  }
  ```
- **Timeout**: Timeout automático de desconexão configurado para 30 segundos caso haja perda abrupta de sinal de rede.

### SPEC-PRESENCE-02: Status Dinâmico (Online vs Treinando Agora)
- **Descrição**: O payload de presença deve mudar dinamicamente de `'ONLINE'` para `'TRAINING'` quando o parceiro iniciar um treino via `WorkoutContext`.
- **Badge UI**:
  - `status === 'TRAINING'` -> Badge verde/destacada com texto **`TREINANDO AGORA`**.
  - `status === 'ONLINE'` -> Badge azul com texto **`ONLINE NO APP`**.
  - `isPartnerOnline === false` -> Oculta indicador online.

### SPEC-PRESENCE-03: Server-Side Debugging & Logging (`presence-logger`)
- **Descrição**: Uma Edge Function Supabase (`supabase/functions/presence-logger/index.ts`) captura o evento e realiza o log estruturado server-side.
- **Formato dos Logs**:
  `[PRESENCE EVENT] {user_name} ({user_id}) -> STATUS: {status} at {timestamp}`

### SPEC-PRESENCE-04: Remoção Total de Falantes Locais Legados
- **Descrição**: Limpeza de `ONLINE_KEY`, `AsyncStorage` polling (`setInterval`) e `BroadcastChannel` para evitar interferência nos dados em tempo real da nuvem.

---

## 4. Test-Driven Development (TDD) Plan

### Unit & Integration Test Suite (`Jest` + `React Native Testing Library`):

#### **`src/features/auth/__tests__/AuthContext.presence.test.tsx`**
- **Test 1 (Red/Green)**: Deve conectar ao Supabase Realtime `bro_presence` ao logar um perfil ativo.
- **Test 2 (Red/Green)**: Deve atualizar `isPartnerOnline` e `partnerStatus` quando o evento `presenceState` for recebido.
- **Test 3 (Red/Green)**: Deve alterar a presença para `'TRAINING'` ao detectar uma sessão de treino ativa.
- **Test 4 (Red/Green)**: Deve disparar `.untrack()` e desconectar o canal no `logout()`.

#### **`supabase/functions/presence-logger/__tests__/presence-logger.test.ts`**
- **Test 1 (Red/Green)**: Deve formatar e registrar o log server-side corretamente ao receber a notificação de mudança de presença.

---

## 5. Tickets Breakdown (Tracer-Bullet Slices)

1. **`01-presence-edge-function`**: Criação da Edge Function `presence-logger` e suíte de testes.
2. **`02-remove-local-storage-presence`**: Limpeza completa das chaves e métodos locais de presença em `storage.ts` e `AuthContext.tsx`.
3. **`03-supabase-presence-client-tdd`**: Implementação TDD da conexão Supabase Realtime Presence no `AuthContext` e integração dinâmica com o `WorkoutContext` no `LivePartnerBadge`.
