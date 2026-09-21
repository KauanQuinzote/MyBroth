# Ticket 01: Persistência Supabase e Canal Realtime para Provocações

- **Spec Relacionada**: [realtime-taunts-spec.md](file:///home/kauan/Documentos/MyBroth/documentation/realtime-taunts-spec.md)
- **Status**: Open
- **Bloqueado por**: Nenhum

## Descrição
Substituição do `BroadcastChannel` local no `BromanceContext.tsx` pela integração com Supabase Realtime (`bro_nudges`) e tabela Postgres `nudges`.

## Critérios de Aceitação
- [ ] Inscrição no canal `bro_nudges` ao selecionar perfil ativo.
- [ ] Inserção de provocações enviadas na tabela `nudges` (`read_at: null`).
- [ ] Busca automática de provocações pendentes não lidas ao reconectar/logar.
