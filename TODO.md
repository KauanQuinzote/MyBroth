# GymBros - TODO & Backlog

## Prioridade Próxima

### 1. Rebranding & Nomenclaturas
- [ ] **Renomear Projeto & App**:
  - Atualizar o nome do projeto de **MyBroth** para **GymBros**.
  - Remover `app_temp` do `app.json` (`name`, `slug`) e do `package.json` (`name`), definindo o nome exibido no celular como **GymBros**.
- [ ] **Identidade Visual & Ícone do App**:
  - Criar e configurar o ícone oficial do **GymBros** seguindo o padrão Apple Minimalist / Neon Dark (1024x1024 px).
  - Configurar ícones adaptativos do Android (`android-icon-foreground.png`, `android-icon-background.png`, `monochromeImage`) e `splash-icon.png`.
- [ ] **Renomear Romance para Chilling**: Atualizar a feature/seção de romance para **Chilling**.

### 2. Sincronização Real-time Cross-Device (PC <-> Celular)
- [ ] **Servidor de Sync LAN (Dev)** ou **Configuração do Supabase Realtime**:
  - **Motivo**: Atualmente, a presença online local (`AsyncStorage` / `BroadcastChannel`) funciona apenas entre abas do mesmo dispositivo (PC <-> PC).
  - **Solução Planejada**:
    - **Opção A (LAN Server)**: Servidor Node/WebSocket na rede local para sincronizar eventos em tempo real.
    - **Opção B (Supabase Cloud)**: Conectar `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` com canais de `Presence` e `Broadcast`.

### 3. Comunidades & Privacidade de Bros
- [ ] **Sincronização Dinâmica de Perfis do Supabase**:
  - Garantir que o app carregue e liste todos os perfis cadastrados diretamente da tabela `profiles` do Supabase na inicialização (sem ficar restrito ao fallback local que só lista o usuário inicial).
  - Tratar mapeamento de campos (`name`, `avatar_emoji` / `avatar_color`, `pin_code`, `initials`) para que bros como o Fábio e novos usuários apareçam imediatamente na seleção de perfil.
- [ ] **Múltiplas Comunidades de Bros**: Possibilidade de criar várias comunidades/grupos de amigos.
  - Cada bro pode pertencer a 1..N comunidades.
  - Os treinos e atividades devem ser visíveis apenas para os membros das comunidades em que o bro participa (evitando que usuários desconhecidos vejam treinos).
- [ ] **Segurança de Banco & Políticas de RLS (Row Level Security)**:
  - Habilitar e configurar RLS em todas as tabelas no Supabase (`profiles`, `workouts`, `communities`, `presence_events`, etc.).
  - Definir policies restritivas de `SELECT`, `INSERT`, `UPDATE` e `DELETE` baseadas em `auth.uid()` e vínculo de membros de comunidade.

### 4. Treinos & Cardio
- [ ] **Tipos Avançados de Séries & Exercícios**:
  - Registrar exercícios e séries especiais: **Bi-set**, **Drop-set**, **Aquecimento** (Warm-up / Feeder sets).
  - Cada série/variação deve suportar suas próprias **cargas** e **repetições** personalizadas e independentes.
- [ ] **Diferentes Tipos de Cardio**: Adicionar suporte a múltiplos tipos e modalidades de cardio no treino (esteira, bike, escada, corrida externa, etc., com métricas apropriadas como tempo, distância, calorias, velocidade).
- [ ] **Aviso Sonoro de Fim de Descanso**: Tocar um som/efeito sonoro ou vibração automaticamente quando o timer de descanso entre séries/exercícios chegar a zero.
- [ ] **Status do Treino em Tempo Real**: Ao clicar no ícone do bro na Home (ativo no treino), visualizar exatamente em qual momento do treino ele está (qual exercício, série/rep, peso, cardio em andamento, tempo decorrido).
- [ ] **Dashboard de Evolução**: Painel completo para acompanhar o progresso e histórico de ganhos em exercícios (sobrecarga progressiva/1RM), peso corporal, cardio e frequência.

### 5. Social, Provocações & Mídia
- [ ] **Seleção de Destinatários em Provocações**: Ao enviar provocações, selecionar 1..N bros da sua comunidade (com destaque para quem estiver ativo/treinando naquele momento).
- [ ] **Efeito Sonoro do Taco Bell**: O som do Taco Bell deve tocar automaticamente no dispositivo de quem receber uma provocação (áudio de gatilho do sistema, não disponível como opção enviável na lista).
- [ ] **Fotos de Visualização Única**: Envio de fotos temporárias/one-view entre bros.
- [ ] **Frase Personalizada com Leitura Narrada (TTS)**: Enviar frases customizadas que são faladas por voz sintetizada/narração no app do bro.
- [ ] **Aba Chilling Reestruturada**: Separar a tela de Chilling em abas dedicadas:
  - Aba 1: Gravação e envio de áudios de voz.
  - Aba 2: Soundboard com botões de memes e efeitos sonoros.
- [ ] **Classificação dos Áudios por Categorias**:
  - Organizar e classificar o catálogo de áudios/memes em categorias (ex: Pesado/Hardcore, Frango/Zoeira, Brother/Motivação, etc.).
  - Adicionar navegação por abas/filtros/chips de categorias no Soundboard para busca e seleção rápida.
- [ ] **Adicionar Novos Áudios Salvos do MyInstants**:
  - Atualizar o objeto `MYINSTANTS_AUDIOS` e o catálogo do soundboard com os novos áudios/memes favoritados/salvos no MyInstants.
- [ ] **Refatoração da Arquitetura de Áudios & Soundboard**:
  - Melhorar a arquitetura e modularização dos dados de áudios (atualmente concentrados em um único arquivo monolítico `src/features/bromance/data/soundboardData.ts`).
  - Separar os arquivos por categoria/domínio, criar schemas estritos de metadata (tags, duração aproximada, nível de zoeira/intensidade, autoria) e carregar de forma modular/dinâmica.
- [ ] **Investigação & Fix de Áudio no Mobile vs. Web**:
  - Investigar por que os áudios do soundboard tocam normalmente na Web, mas não reproduzem no dispositivo físico / Expo Go Mobile.
  - Verificar compatibilidade de URLs externas/streaming de MP3, configuração do modo de áudio no iOS/Android (`setAudioModeAsync`, flags de silent mode / background audio) e possíveis bloqueios de rede/CORS no player nativo.

### 6. Gamificação, Desafios & Conquistas
- [ ] **Expansão de Conquistas (Achievements)**: Adicionar catálogo amplo de categorias e conquistas na gamificação (no mínimo 50 achievements divididos em categorias como Força, Constância, Social, Cardio, Desafios, etc.).
- [ ] **Sistema de Desafios ("Verdade ou Desafio" / Bro Challenges)**:
  - Desafios valendo Bro Points ou apostas/prêmios personalizados definidos pelo emissor.
  - Fluxo de validação: o bro que completa o desafio submete comprovação e o bro desafiante precisa validar/aprovar para liberar os pontos/prêmio.

### 7. DevOps, Qualidade & CI/CD
- [ ] **CLI & Automação de Checagem em PRs**:
  - Criar ferramenta CLI / script de validação de integridade (tipagem TypeScript, lint e suíte de testes unitários/integração).
  - Configurar GitHub Actions workflow para executar automaticamente essa CLI/validação toda vez que um Pull Request for aberto ou atualizado no GitHub (`pull_request`).

---

## Futuras Funcionalidades & IA
- [ ] **Agente de IA GymBros**: Integração com agente inteligente para:
  - Interação direta e motivação com o bro.
  - Acompanhamento da evolução física via análise de fotos.
  - Monitoramento e sugestões de evolução de treino, sobrecarga e dieta.
- [ ] **Notificações Push**: Alertas push quando o bro iniciar treino, mandar desafio ou enviar provocação.
