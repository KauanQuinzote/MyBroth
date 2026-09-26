# Ticket 02: AudioService com expo-av e Testes TDD (Subagente Tester)

- **Spec Relacionada**: [soundboard-memes-spec.md](file:///home/kauan/Documentos/MyBroth/documentation/soundboard-memes-spec.md)
- **Status**: Open
- **Bloqueado por**: Ticket 01

## Descrição
Invocação do **Subagente Tester TDD** (Modo Caixa-Preta) para criação da suíte de testes em `src/features/bromance/__tests__/AudioService.test.ts` e `NudgeModal.audio.test.tsx`.

## Critérios de Aceitação
- [ ] Testes da fase **RED** criados exclusivamente pelo Subagente Tester.
- [ ] Cobertura de reprodução de MP3 via `expo-av` (`Audio.Sound`) e acionamento do fallback TTS.
