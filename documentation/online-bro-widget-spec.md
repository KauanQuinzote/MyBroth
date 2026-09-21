# Specification: Neon Bro Presence & Training Widget

- **Feature**: Widget Neon de Presença de Bros (0 a N Online / Treinando)
- **Branch**: `feature/online-bro-widget-redesign`
- **Status**: Draft (Refatorado via `/grill-with-docs`)

---

## 1. Visão Geral & Valor de Negócio

O novo **Neon Bro Presence Widget** substitui o indicador legado de presença por uma interface de alto impacto visual no estilo **Apple Minimalist + Neon Dark**. Ele exibe em tempo real o status de **0 a N Bros/Parceiros** conectados ao ecossistema do MyBroth, permitindo identificar instantaneamente quem está apenas navegando no app e quem está realizando um treino ao vivo.

### Status Suportados:
1. **`TREINANDO AGORA`** (Neon Emerald `#00FF66`): O Bro possui um treino ativo em andamento no `WorkoutContext`. Exibe detalhes em tempo real: **Rotina**, **Exercício Atual**, **Carga (kg)** e **Série Atual**, acompanhado de um indicador com animação de pulso neon.
2. **`ONLINE NO APP`** (Neon Cyan `#00F0FF`): O Bro está navegando e ativo no app via Supabase Realtime WebSocket.
3. **`OFFLINE`**: O Bro está inativo. Exibido em modo fosco/muted com opacidade reduzida para destacar os bros ativos.

---

## 2. Arquitetura & Fluxo de Dados (0 a N Bros)

```
[ App Cliente (Expo/React Native) ]
              │
              ├─► Inscrição no Supabase Realtime Channel: 'bro_presence'
              │
              ▼
[ AuthContext / Presence State ]
              │
              ├─► `onlineBros`: Array<BroPresenceState> (Suporta 0 a N Bros)
              │
              ▼
[ NeonBroPresenceWidget ]
              │
              ├─► Header: "BROS ATIVOS (X ONLINE)"
              ├─► Sub-componente: `BroPresenceCard` (Renderiza cada Bro)
              └─► Micro-animação: Pulsar Neon (para Bros em treino)
```

---

## 3. Especificações Técnicas (Core Requirements)

### SPEC-NEON-01: Suporte a Múltiplos Bros (Array 0 a N)
- **Descrição**: O widget não deve ser limitado a 1 parceiro fixo. O hook de presença deve retornar a lista `onlineBros: BroPresenceState[]`.
- **Estado Vazio (0 Bros Online)**: Quando nenhum bro estiver online ou treinando, exibe o card neutro Apple Minimalist com a mensagem: *"Nenhum bro ativo no momento. Inicie um treino para notificar seu grupo!"*

### SPEC-NEON-02: Design System Neon Apple Minimalist
- **Estilização**:
  - **Fundo**: Dark Slate `#0A0D14` / `#0D111A` com bordas sutis neon translúcidas (`rgba(0, 240, 255, 0.3)` para Online e `rgba(0, 255, 102, 0.4)` para Treino).
  - **Efeito Glow**: `shadow-cyan-400/40` e `shadow-emerald-500/50`.
  - **Avatares**: Anel de avatar com glow neon no status ativo e iniciais em tipografia em negrito.
  - **Zero Emojis**: Ícones vetoriais `lucide-react-native` (`Dumbbell`, `Activity`, `Zap`, `Wifi`).

### SPEC-NEON-03: Indicador em Tempo Real de Treino Viva
- **Descrição**: Quando `status === 'TRAINING'`, o card do bro expande uma seção de telemetry do treino contendo:
  - Nome da Rotina (ex: "Leg Day Pesado")
  - Exercício Atual (ex: "Agachamento Livre")
  - Carga & Série Atual (ex: "120 kg • Série 3/4")

---

## 4. Test-Driven Development (TDD) Plan

### Suíte de Testes Requerida (Jest + React Native Testing Library):

#### **`src/features/gamification/components/__tests__/NeonBroPresenceWidget.test.tsx`**
- **Teste 1 (Red/Green)**: Deve renderizar o estado vazio quando a lista `onlineBros` for vazia (0 Bros online).
- **Teste 2 (Red/Green)**: Deve renderizar os badges e detalhes de N Bros quando houver múltiplos parceiros online.
- **Teste 3 (Red/Green)**: Deve exibir o badge Neon Cyan (`ONLINE NO APP`) para bros navegando.
- **Teste 4 (Red/Green)**: Deve exibir o badge Neon Emerald (`TREINANDO AGORA`) com dados da rotina e exercício para bros em treino.

---

## 5. Tickets Breakdown (Tracer-Bullet Slices)

1. **`01-neon-widget-types-and-context`**: Ajuste dos tipos de dados de presença em `AuthContext` e suporte à lista `onlineBros` (0 a N).
2. **`02-neon-bro-presence-widget-tdd`**: Invocação do Subagente Tester TDD para criação dos testes em `NeonBroPresenceWidget.test.tsx` (Fase Red).
3. **`03-neon-bro-presence-widget-ui`**: Implementação do componente visual `NeonBroPresenceWidget` e `BroPresenceCard` (Fase Green/Refactor).
