# AGENTS.md - MyBroth

- **Expo Version**: Expo v57.0.0 (consulte a documentação em https://docs.expo.dev/versions/v57.0.0/).
- **Arquitetura**: Estritamente Feature-Based (`src/features/` + `src/shared/`).
- **Design System**: Apple Minimalist (Zero Emojis), consulte [docs/DESIGN.md](./docs/DESIGN.md).
- **Git Branch**: Criar obrigatoriamente uma nova branch a partir da `main` (`feature/<spec-slug>`) para cada especificação.
- **Regras do Projeto**: Siga o arquivo de regras [.rules](./.rules), [docs/RULES.md](./docs/RULES.md) e a esteira Spec-Driven Matt Pocock em `docs/skills/` (`grill-with-docs` -> `to-spec` -> `to-tickets` -> `implement` / `tdd` -> `code-review`).
- **Interatividade (`ask_question`)**: Utilize obrigatoriamente a ferramenta interativa `ask_question` para perguntas de múltipla escolha com opção de texto livre ("Outro").
