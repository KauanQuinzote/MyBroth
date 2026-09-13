import AsyncStorage from '@react-native-async-storage/async-storage';
import { BroProfile, WorkoutRoutine, WorkoutSession, WorkoutSetLog } from '../types';

const PROFILES_KEY = '@mybroth_profiles';
const SESSIONS_KEY = '@mybroth_sessions';
const SETS_KEY = '@mybroth_sets';
const ROUTINES_KEY = '@mybroth_routines';
const ONLINE_KEY = '@mybroth_online_presence';

export const DEFAULT_PROFILES: BroProfile[] = [
  {
    id: 'bro-1-id',
    name: 'Bro Alpha',
    initials: 'BA',
    avatar_color: '#0A84FF',
    pin_code: '1234',
    bro_points: 250,
    streak: 4,
    last_workout_date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'bro-2-id',
    name: 'Bro Beta',
    initials: 'BB',
    avatar_color: '#30D158',
    pin_code: '4321',
    bro_points: 190,
    streak: 2,
    last_workout_date: new Date().toISOString().split('T')[0],
  },
];

export const DEFAULT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'routine-chest-triceps',
    title: 'Peito & Tríceps Monstro',
    target_muscle: 'Peito e Tríceps',
    exercises: [
      { id: 'ex-1', name: 'Supino Reto com Barra', defaultSets: 4, defaultReps: 10, targetMuscle: 'Peito' },
      { id: 'ex-2', name: 'Supino Inclinado com Halteres', defaultSets: 3, defaultReps: 12, targetMuscle: 'Peito' },
      { id: 'ex-3', name: 'Crossover na Polia', defaultSets: 3, defaultReps: 15, targetMuscle: 'Peito' },
      { id: 'ex-4', name: 'Tríceps Testa', defaultSets: 4, defaultReps: 10, targetMuscle: 'Tríceps' },
      { id: 'ex-5', name: 'Tríceps Corda', defaultSets: 3, defaultReps: 12, targetMuscle: 'Tríceps' },
    ],
  },
  {
    id: 'routine-back-biceps',
    title: 'Costas & Bíceps de Aço',
    target_muscle: 'Costas e Bíceps',
    exercises: [
      { id: 'ex-6', name: 'Puxada Frontal', defaultSets: 4, defaultReps: 10, targetMuscle: 'Costas' },
      { id: 'ex-7', name: 'Remada Curvada com Barra', defaultSets: 4, defaultReps: 8, targetMuscle: 'Costas' },
      { id: 'ex-8', name: 'Remada Baixa', defaultSets: 3, defaultReps: 12, targetMuscle: 'Costas' },
      { id: 'ex-9', name: 'Rosca Direta', defaultSets: 4, defaultReps: 10, targetMuscle: 'Bíceps' },
      { id: 'ex-10', name: 'Rosca Martelo', defaultSets: 3, defaultReps: 12, targetMuscle: 'Bíceps' },
    ],
  },
  {
    id: 'routine-legs-shoulders',
    title: 'Perna & Ombro Insano',
    target_muscle: 'Pernas e Ombros',
    exercises: [
      { id: 'ex-11', name: 'Agachamento Livre', defaultSets: 4, defaultReps: 8, targetMuscle: 'Pernas' },
      { id: 'ex-12', name: 'Leg Press 45', defaultSets: 4, defaultReps: 10, targetMuscle: 'Pernas' },
      { id: 'ex-13', name: 'Cadeira Extensora', defaultSets: 3, defaultReps: 15, targetMuscle: 'Pernas' },
      { id: 'ex-14', name: 'Desenvolvimento com Halteres', defaultSets: 4, defaultReps: 10, targetMuscle: 'Ombros' },
      { id: 'ex-15', name: 'Elevação Lateral', defaultSets: 4, defaultReps: 12, targetMuscle: 'Ombros' },
    ],
  },
];

export const LocalStorageService = {
  async getProfiles(): Promise<BroProfile[]> {
    try {
      const data = await AsyncStorage.getItem(PROFILES_KEY);
      if (!data) {
        await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(DEFAULT_PROFILES));
        return DEFAULT_PROFILES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PROFILES;
    }
  },

  async saveProfiles(profiles: BroProfile[]): Promise<void> {
    await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  },

  async getRoutines(): Promise<WorkoutRoutine[]> {
    try {
      const data = await AsyncStorage.getItem(ROUTINES_KEY);
      if (!data) {
        await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(DEFAULT_ROUTINES));
        return DEFAULT_ROUTINES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ROUTINES;
    }
  },

  async saveRoutines(routines: WorkoutRoutine[]): Promise<void> {
    await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
  },

  async addRoutine(routine: WorkoutRoutine): Promise<void> {
    const routines = await this.getRoutines();
    routines.push(routine);
    await this.saveRoutines(routines);
  },

  async updateRoutine(routine: WorkoutRoutine): Promise<void> {
    const routines = await this.getRoutines();
    const idx = routines.findIndex((r) => r.id === routine.id);
    if (idx >= 0) {
      routines[idx] = routine;
      await this.saveRoutines(routines);
    }
  },

  async getSessions(): Promise<WorkoutSession[]> {
    try {
      const data = await AsyncStorage.getItem(SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveSession(session: WorkoutSession): Promise<void> {
    const sessions = await this.getSessions();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  },

  async getSetLogs(sessionId: string): Promise<WorkoutSetLog[]> {
    try {
      const data = await AsyncStorage.getItem(`${SETS_KEY}_${sessionId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveSetLog(sessionId: string, log: WorkoutSetLog): Promise<void> {
    const logs = await this.getSetLogs(sessionId);
    logs.push(log);
    await AsyncStorage.setItem(`${SETS_KEY}_${sessionId}`, JSON.stringify(logs));
  },

  // --- Presença em Tempo Real ---
  async getOnlinePresenceMap(): Promise<Record<string, number>> {
    try {
      const data = await AsyncStorage.getItem(ONLINE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  async setProfileOnlineState(profileId: string, isOnline: boolean): Promise<void> {
    const map = await this.getOnlinePresenceMap();
    if (isOnline) {
      map[profileId] = Date.now();
    } else {
      delete map[profileId];
    }
    await AsyncStorage.setItem(ONLINE_KEY, JSON.stringify(map));
  },
};
