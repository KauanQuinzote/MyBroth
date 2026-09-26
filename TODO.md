# GymBros - TODO & Backlog

## Prioridade Próxima

### 1. Rebranding & Nomenclaturas
- [ ] **Renomear Projeto**: Atualizar o nome do projeto para **GymBros** (em substituição a MyBroth).
- [ ] **Renomear Romance para Chilling**: Atualizar a feature/seção de romance para **Chilling**.

### 2. Sincronização Real-time Cross-Device (PC <-> Celular)
- [ ] **Servidor de Sync LAN (Dev)** ou **Configuração do Supabase Realtime**:
  - **Motivo**: Atualmente, a presença online local (`AsyncStorage` / `BroadcastChannel`) funciona apenas entre abas do mesmo dispositivo (PC <-> PC).
  - **Solução Planejada**:
    - **Opção A (LAN Server)**: Servidor Node/WebSocket na rede local para sincronizar eventos em tempo real.
    - **Opção B (Supabase Cloud)**: Conectar `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` com canais de `Presence` e `Broadcast`.

### 3. Comunidades & Privacidade de Bros
- [ ] **Múltiplas Comunidades de Bros**: Possibilidade de criar várias comunidades/grupos de amigos.
  - Cada bro pode pertencer a 1..N comunidades.
  - Os treinos e atividades devem ser visíveis apenas para os membros das comunidades em que o bro participa (evitando que usuários desconhecidos vejam treinos).

### 4. Treinos & Cardio
- [ ] **Diferentes Tipos de Cardio**: Adicionar suporte a múltiplos tipos e modalidades de cardio no treino (esteira, bike, escada, corrida externa, etc., com métricas apropriadas como tempo, distância, calorias, velocidade).
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

### 6. Gamificação, Desafios & Conquistas
- [ ] **Expansão de Conquistas (Achievements)**: Adicionar catálogo amplo de categorias e conquistas na gamificação (no mínimo 50 achievements divididos em categorias como Força, Constância, Social, Cardio, Desafios, etc.).
- [ ] **Sistema de Desafios ("Verdade ou Desafio" / Bro Challenges)**:
  - Desafios valendo Bro Points ou apostas/prêmios personalizados definidos pelo emissor.
  - Fluxo de validação: o bro que completa o desafio submete comprovação e o bro desafiante precisa validar/aprovar para liberar os pontos/prêmio.

---

## Futuras Funcionalidades & IA
- [ ] **Agente de IA GymBros**: Integração com agente inteligente para:
  - Interação direta e motivação com o bro.
  - Acompanhamento da evolução física via análise de fotos.
  - Monitoramento e sugestões de evolução de treino, sobrecarga e dieta.
- [ ] **Notificações Push**: Alertas push quando o bro iniciar treino, mandar desafio ou enviar provocação.
