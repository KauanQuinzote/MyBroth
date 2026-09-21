# Specification: Audio Meme Soundboard & Custom MP3 Taunts

- **Feature**: Soundboard de Memes & Provocações em Áudio (MyInstants / Custom MP3)
- **Branch**: `feature/soundboard-memes-taunts`
- **Status**: Draft (Refatorado via `/grill-with-docs`)

---

## 1. Visão Geral & Valor de Negócio

O novo recurso de **Soundboard de Memes & Provocações em Áudio** leva o sistema de provocação do **MyBroth** para o próximo nível de engajamento, permitindo que os Bros enviem não apenas frases de texto, mas também **efeitos sonoros virais de memes em áudio MP3** (ex: *Social Credit Siren*, *Bruh*, *Airhorn*, *Fausto Silva Errou*, *Fart Button*, etc.) e links diretos de áudios do **MyInstants**.

### Fluxo de Áudio:
1. **Envio**: O usuário escolhe um meme da grade do Soundboard ou cola uma URL de áudio MP3 do MyInstants.
2. **Transmissão**: O payload trafega via Supabase Realtime + Postgres contendo a propriedade `audio_url`.
3. **Reprodução**: O aplicativo do destinatário abre o `NudgeModal` e executa o áudio MP3 nativamente via **`expo-av`** (`Audio.Sound`). Se o download do MP3 falhar por falta de conexão, o app aciona o fallback automático para a síntese de voz (TTS).

---

## 2. Arquitetura & Componentes

```
[ Soundboard Picker ]
        │ (Seleciona Meme ou Cola URL MP3)
        ▼
[ BromanceContext.sendNudge ]
        │ (Payload com { nudge_text, category, audio_url })
        ▼
[ Supabase Realtime + Table `nudges` ]
        │
        ▼
[ Bro B (NudgeModal) ]
        │
        ├─► `AudioService.playUrl(audio_url)` (via `expo-av`)
        └─► (Se falhar) ──► `SpeechService.speak(nudge_text)` (Fallback TTS)
```

---

## 3. Especificações Técnicas (Core Requirements)

### SPEC-SOUNDBOARD-01: Catálogo de Memes & Tipagem
- **Extensão do Payload**:
  ```typescript
  export interface BromanceNudgeLog {
    id: string;
    sender_id: string;
    sender_name: string;
    sender_initials: string;
    receiver_id: string;
    nudge_text: string;
    category: NudgeCategory;
    audio_url?: string | null; // URL do MP3 (ex: MyInstants)
    read_at?: string | null;
    created_at: string;
  }
  ```
- **Catálogo Padrão `MEME_SOUNDBOARD`**:
  - `Social Credit Siren`: `https://www.myinstants.com/media/sounds/999-social-credit-siren.mp3`
  - `Airhorn Meme`: `https://www.myinstants.com/media/sounds/mlg-airhorn.mp3`
  - `Bruh Sound Effect`: `https://www.myinstants.com/media/sounds/bruh-sound-effect-1.mp3`
  - `Fausto Silva Errou`: `https://www.myinstants.com/media/sounds/errou_1.mp3`
  - `Sad Violin`: `https://www.myinstants.com/media/sounds/sad-violin.mp3`

### SPEC-SOUNDBOARD-02: `AudioService` com `expo-av`
- **Descrição**: Serviço em `src/features/bromance/services/audioService.ts` responsável por inicializar, carregar e reproduzir links remotos de áudio usando `expo-av` (`Audio.Sound`).
- **Comportamento**:
  - Configura o áudio para reproduzir mesmo em modo silencioso no iOS/Android.
  - Se a promessa de carregamento do som falhar, retorna `false` para ativar o fallback TTS.

### SPEC-SOUNDBOARD-03: Soundboard UI & Custom URL Input
- **Interface no `BromanceScreen`**:
  - Aba ou Seção "SOUNDBOARD DE MEMES" com grid de botões neon com efeito de pressão.
  - Campo de entrada de texto com botão "COPIAR DO MYINSTANTS / COLAR MP3" para permitir qualquer link customizado do usuário.

---

## 4. Test-Driven Development (TDD) Plan

### Suíte de Testes Requerida (Jest):

#### **`src/features/bromance/__tests__/AudioService.test.ts`**
- **Teste 1 (Red/Green)**: Deve carregar e tocar o arquivo de áudio remoto via `expo-av` (`Audio.Sound.createAsync`).
- **Teste 2 (Red/Green)**: Deve capturar erros de carregamento e liberar o player (`unloadAsync`).

#### **`src/features/bromance/__tests__/NudgeModal.audio.test.tsx`**
- **Teste 1 (Red/Green)**: Deve chamar `AudioService.playUrl` se `audio_url` estiver presente no `activeIncomingNudge`.
- **Teste 2 (Red/Green)**: Deve acionar o fallback para `SpeechService.speak` se `audio_url` estiver ausente ou falhar.

---

## 5. Tickets Breakdown (Tracer-Bullet Slices)

1. **`01-soundboard-data-and-types`**: Adicionar a coluna `audio_url` no schema Supabase, atualizar o tipo `BromanceNudgeLog` e criar o catálogo de memes.
2. **`02-audio-service-tdd`**: Invocação do Subagente Tester TDD para criação do `AudioService.ts` com `expo-av` e suíte de testes.
3. **`03-soundboard-picker-ui`**: Interface visual do Soundboard em `BromanceScreen.tsx` e integração no `NudgeModal.tsx`.
