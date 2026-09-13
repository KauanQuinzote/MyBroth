# MyBroth - Apple Minimalist Design System 🍎

Este documento define a linguagem visual e as diretrizes de UI/UX do aplicativo **MyBroth**, inspirada no ecossistema **Apple (iOS / Apple Health)**.

---

## 🚫 1. Política Zero Emojis (Zero-Emoji Policy)
- É **estritamente proibido** utilizar emojis na interface gráfica do aplicativo (em títulos, botões, avatares ou cartões).
- **Substitutos Obrigatórios**:
  - Toda a iconografia deve utilizar componentes vetoriais limpos da biblioteca `lucide-react-native`.
  - Avatares de usuário devem utilizar **badges circulares minimalistas com iniciais em caixa alta** (ex: "BA" para Bro Alpha, "BB" para Bro Beta) em fundo gradiente de acrílico.

---

## 🎨 2. Paleta de Cores (Apple Dark Mode)

| Elemento | Hex / HSL | Uso |
| :--- | :--- | :--- |
| **Background Principal** | `#0A0D14` | Fundo geral da tela estilo iOS Dark Deep |
| **Card / Surface** | `#161B26` | Cartões e containers elevados |
| **Bordas Sutis** | `#262F42` | Divisores e bordas finas com raio de curvatura `16px - 24px` |
| **Texto Principal** | `#F8FAFC` | Títulos e números em alta legibilidade |
| **Texto Secundário** | `#94A3B8` | Subtítulos e rótulos auxiliares |
| **Destaque Azul Apple** | `#0A84FF` | Botões primários, links e abas ativas |
| **Verde Status / Live** | `#30D158` | Treino em andamento e botões de conclusão |
| **Laranja Streak / Fire** | `#FF9F0A` | Sequência diária e alertas de carga |
| **Amarelo Points / PR** | `#FFD60A` | Bro Points e conquistas da maromba |

---

## 🔤 3. Tipografia & Layout
- **Fontes**: Tipografia limpa sans-serif com peso `700` (Bold) para títulos e números, e `500` (Medium) para descrições.
- **Números Tabulares**: Utilizar `fontVariant: ['tabular-nums']` em timers e valores numéricos para evitar sobressaltos visuais durante contagens.
- **Cartões**: Cantos bem arredondados (`borderRadius: 20` ou `24`), padding interno generoso (`18px` a `24px`), sem sombras chamativas ou neon agressivo.

---

## 🏆 4. Conquistas & Gamificação Minimalista
- Conquistas e medalhas são representadas por cartões foscos com ícones vetoriais em círculos coloridos sutis em vez de figuras de troféus 3D ou emojis de arcade.
