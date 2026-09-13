# MyBroth - Regras Oficiais do Projeto (docs/RULES.md)

## 1. Arquitetura Feature-Based
- Todo o código de funcionalidade principal deve residir em `src/features/<feature_name>/`.
- Estrutura de módulos suportados: `auth`, `workout`, `gamification`, `routines`, `history`, `dashboard`.
- Toda feature deve expor sua API pública através de `src/features/<feature_name>/index.ts`.
- Módulos externos nunca devem acessar arquivos internos de uma feature diretamente.

## 2. Design System Apple (Zero Emojis)
- Consulte e siga rigorosamente as diretrizes contidas em `docs/DESIGN.md`.
- É expressamente proibido o uso de emojis no aplicativo. Toda a iconografia deve ser vetorial (`lucide-react-native`).

## 3. Integração com Skills
- O desenvolvimento DEVE consultar e respeitar as especificações contidas no repositório `skills/`.
