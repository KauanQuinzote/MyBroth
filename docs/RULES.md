# MyBroth - Regras Oficiais do Projeto (docs/RULES.md)

## 1. Arquitetura Feature-Based
- Todo o código de funcionalidade principal deve residir em `src/features/<feature_name>/`.
- Estrutura de módulos suportados: `auth`, `workout`, `gamification`, `routines`, `history`, `dashboard`.
- Toda feature deve expor sua API pública através de `src/features/<feature_name>/index.ts`.
- Módulos externos nunca devem acessar arquivos internos de uma feature diretamente.

## 2. Design System Apple (Zero Emojis)
- Consulte e siga rigorosamente as diretrizes contidas em `docs/DESIGN.md`.
- É expressamente proibido o uso de emojis no aplicativo. Toda a iconografia deve ser vetorial (`lucide-react-native`).

## 3. Componentização Máxima e Limite de LOC (Matt Pocock Architecture)
- **Componentes / Telas < 100 LOC**: Arquivos JSX/TSX de UI não devem ultrapassar 100 linhas de código.
- **Divisão em Sub-componentes Top, Mid e Bottom**:
  - Telas entre 100-150 LOC: Devem ser divididas em componentes `[Feature]Top` e `[Feature]Bottom`.
  - Telas > 150 LOC: Devem ser divididas em `[Feature]Top`, `[Feature]Mid` e `[Feature]Bottom` (e sub-componentes específicos como Modais/Cards isolados).
- **Responsabilidade Única**: O arquivo principal `Screen.tsx` de uma feature deve apenas orquestrar os sub-componentes e gerenciar estados globais.

## 4. Integração com Skills
- O desenvolvimento DEVE consultar e respeitar as especificações contidas no repositório `docs/skills/`.
