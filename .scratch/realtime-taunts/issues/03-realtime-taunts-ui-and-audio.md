# Ticket 03: Integração de Áudio e Modal de Provocação (NudgeModal)

- **Spec Relacionada**: [realtime-taunts-spec.md](file:///home/kauan/Documentos/MyBroth/documentation/realtime-taunts-spec.md)
- **Status**: Open
- **Bloqueado por**: Ticket 02

## Descrição
Conexão do `NudgeModal.tsx` com `SpeechService.speak()` e disparo do `UPDATE nudges SET read_at = now()` ao desativar o modal.

## Critérios de Aceitação
- [ ] Fase **GREEN**: Todos os testes criados no Ticket 02 passam sem erros.
- [ ] Reprodução de áudio automática ao receber provocação (ao vivo ou ao voltar online).
- [ ] Marcação de provocação como lida no banco Supabase após descarte.
