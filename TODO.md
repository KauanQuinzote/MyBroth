# MyBroth - TODO & Backlog 📋

## 🟢 Prioridade Próxima

### 1. Sincronização Real-time Cross-Device (PC <-> Celular)
- [ ] **Servidor de Sync LAN (Dev)** ou **Configuração do Supabase Realtime**:
  - **Motivo**: Atualmente, a presença online local (`AsyncStorage` / `BroadcastChannel`) funciona apenas entre abas do mesmo dispositivo (PC <-> PC). O celular e o PC são dispositivos físicos separados em redes locais diferentes e não compartilham a mesma memória/storage local.
  - **Solução Planejada**:
    - **Opção A (LAN Server)**: Criar um servidor Node/WebSocket minimalista rodando no IP da rede local (ex: `http://192.168.x.x:4000`) integrado ao script de dev para transmitir eventos de presença e treinos ao vivo entre o PC e o Celular na mesma rede Wi-Fi.
    - **Opção B (Supabase Cloud)**: Conectar as chaves `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` no `.env` para usar canais de `Presence` e `Broadcast` via Supabase Realtime em nuvem.

---

## 📌 Futuras Funcionalidades
- [ ] Gráficos de evolução de carga por exercício.
- [ ] Histórico de treinos concluídos com estatísticas de Bro Points por semana.
- [ ] Notificações push quando o Bro iniciar um treino ao vivo.
