# CLAUDE.md - MyBroth

## Commands
- `npm start` - Iniciar servidor de dev Expo
- `npx tsc --noEmit` - Validar tipos TypeScript

## Architecture Rules (.rules)
- Siga a arquitetura **Feature-Based** em `src/features/` com exportações públicas via `index.ts`.
- Recursos compartilhados em `src/shared/`.
- Siga sempre as especificações em `docs/skills/`.
