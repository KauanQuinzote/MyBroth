# Ticket 01: Tipos e Suporte a Lista de Presença (0 a N Bros)

- **Spec Relacionada**: [online-bro-widget-spec.md](file:///home/kauan/Documentos/MyBroth/documentation/online-bro-widget-spec.md)
- **Status**: Open
- **Bloqueado por**: Nenhum

## Descrição
Garantir que os tipos e o contexto `AuthContext` exportem `onlineBros: BroPresenceState[]` para suportar de 0 a N parceiros conectados simultaneamente.

## Critérios de Aceitação
- [ ] Tipo `BroPresenceState` exportado em `AuthContext`.
- [ ] Estado `onlineBros` mantido como array sincronizado pelo Supabase Realtime.
