# Specification: Real-Time & Offline Taunts System (Provocações entre Bros)

- **Feature**: Transmissão em Tempo Real & Entrega Offline de Provocações (Taunts/Nudges)
- **Branch**: `feature/realtime-taunts-system`
- **Status**: Draft (Refatorado via `/grill-with-docs`)

---

## 1. Visão Geral & Valor de Negócio

O sistema de provocações (taunts/nudges) do **MyBroth** permite que parceiros enviem alertas sonoros e visuais em tempo real para motivar ou zoar seus Bros durante o dia ou durante o treino. 

Atualmente o sistema dependia do `BroadcastChannel` local (que funciona apenas entre abas no mesmo navegador/dispositivo). Esta especificação introduz a transmissão em tempo real via **Supabase Realtime Broadcast Channels** e persistência em tabela Postgres (`nudges`), garantindo que:
1. **Bro Online**: Recebe o alerta instantaneamente na tela via WebSocket (`NudgeModal`), que aciona a síntese de voz (TTS/Áudio) automaticamente.
2. **Bro Offline**: Quando o Bro estiver offline no momento do envio, a provocação é salva com estado `read_at: null`. Assim que ele fizer login ou retornar ao aplicativo, o app recupera as provocações pendentes e as reproduz com áudio na tela dele.

---

## 2. Arquitetura & Fluxo de Dados

```
[ Bro A (Remetente) ] 
       │ 1. Dispara Nudge ("Bora treinar frango!")
       ├─────────────────────────────────────────┐
       ▼                                         ▼
[ Supabase Table: `nudges` ]              [ Supabase Realtime Broadcast ]
(Insere registro com `read_at: null`)      (Canal: `bro_nudges`)
       │                                         │
       │ (Se Bro B estava OFFLINE)               │ (Se Bro B está ONLINE)
       │ 2. Ao Logar / Reconectar                │ 2. Evento WebSocket Instantâneo
       └────────────────────┬────────────────────┘
                            ▼
                  [ Bro B (Destinatário) ]
                            │
                            ├─► 1. Abre `NudgeModal`
                            ├─► 2. Reproduz Áudio via `SpeechService.speak()`
                            └─► 3. Marca registro como `read_at: now()` no Supabase
```

---

## 3. Especificações Técnicas (Core Requirements)

### SPEC-TAUNTS-01: Transmissão Realtime WebSocket (`bro_nudges`)
- **Descrição**: Ao enviar uma provocação (`sendNudge`), o app publica o payload no canal de broadcast `bro_nudges` do Supabase.
- **Payload**:
  ```typescript
  interface BromanceNudgeLog {
    id: string;
    sender_id: string;
    sender_name: string;
    sender_initials?: string;
    receiver_id: string;
    nudge_text: string;
    category: string;
    read_at?: string | null;
    created_at: string; // ISO-8601
  }
  ```

### SPEC-TAUNTS-02: Persistência Postgres & Entrega Offline
- **Tabela `nudges`**:
  - `id`: text / uuid (PK)
  - `sender_id`: text (FK -> profiles.id)
  - `sender_name`: text
  - `receiver_id`: text (FK -> profiles.id)
  - `nudge_text`: text
  - `category`: text
  - `read_at`: timestamp com fuso horário (null se não lido)
  - `created_at`: timestamp com fuso horário (default now())
- **Recuperação de Pendentes**: Ao ativar `activeProfile` no `BromanceContext`, o app executa:
  `SELECT * FROM nudges WHERE receiver_id = activeProfile.id AND read_at IS NULL ORDER BY created_at ASC`
- Se houver provocações não lidas, a mais recente (ou em fila) é definida como `activeIncomingNudge`, abrindo o modal e reproduzindo o áudio.

### SPEC-TAUNTS-03: Disparo de Áudio (Speech/TTS) & Confirmação de Leitura
- **Visual & Áudio**: O `NudgeModal` abre e executa `SpeechService.speak(activeIncomingNudge.nudge_text)` automaticamente.
- **Marcação como Lida**: Ao fechar o modal (`dismissIncomingNudge`), o app atualiza no Supabase `UPDATE nudges SET read_at = now() WHERE id = nudge.id`.

### SPEC-TAUNTS-04: Remoção do `BroadcastChannel` Legado
- **Descrição**: Remoção completa de `BroadcastChannel` local para evitar duplicidade de mensagens e garantir envio 100% via rede Supabase.

---

## 4. Test-Driven Development (TDD) Plan

### Suíte de Testes Requerida (Jest + React Native Testing Library):

#### **`src/features/bromance/__tests__/BromanceContext.taunts.test.tsx`**
- **Teste 1 (Red/Green)**: Deve enviar provocação via Supabase Realtime e persistir na tabela `nudges`.
- **Teste 2 (Red/Green)**: Deve escutar eventos em tempo real no canal `bro_nudges` e definir `activeIncomingNudge` quando o `receiver_id` corresponder ao perfil ativo.
- **Teste 3 (Red/Green)**: Deve buscar provocações pendentes (não lidas) do banco ao logar e exibi-las no `activeIncomingNudge`.
- **Teste 4 (Red/Green)**: Deve atualizar `read_at` no banco ao descartar/fechar o modal de provocação.

---

## 5. Tickets Breakdown (Tracer-Bullet Slices)

1. **`01-taunts-supabase-persistence-and-realtime`**: Implementação dos métodos de persistência e inscrição de canal Supabase em `BromanceContext.tsx`.
2. **`02-realtime-taunts-tdd-tests`**: Invocação do Subagente Tester TDD para criação dos testes em `BromanceContext.taunts.test.tsx` (Fase Red).
3. **`03-realtime-taunts-ui-and-audio`**: Conexão com `NudgeModal.tsx`, acionamento de `SpeechService` e encerramento com atualização de `read_at` (Fase Green/Refactor).
