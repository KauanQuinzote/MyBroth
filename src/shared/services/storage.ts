import AsyncStorage from '@react-native-async-storage/async-storage';
import { BroProfile, WorkoutRoutine, WorkoutSession, WorkoutSetLog } from '../types';

const PROFILES_KEY = '@mybroth_profiles';
const SESSIONS_KEY = '@mybroth_sessions';
const SETS_KEY = '@mybroth_sets';
const ROUTINES_KEY = '@mybroth_routines';
const ONLINE_KEY = '@mybroth_online_presence';

export const DEFAULT_PROFILES: BroProfile[] = [
  {
    id: 'kauan-profile-id',
    name: 'Kauan Domingues',
    initials: 'KD',
    avatar_color: '#0A84FF',
    pin_code: '1234',
    email: 'kauandominguesdesouza@gmail.com',
    bro_points: 0,
    streak: 0,
    last_workout_date: new Date().toISOString().split('T')[0],
  },
];

export const DEFAULT_ROUTINES: WorkoutRoutine[] = [];

export const LocalStorageService = {
  async getProfiles(): Promise<BroProfile[]> {
    try {
      const data = await AsyncStorage.getItem(PROFILES_KEY);
      if (!data) {
        await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(DEFAULT_PROFILES));
        return DEFAULT_PROFILES;
      }
      const parsed: BroProfile[] = JSON.parse(data);
      const cleaned = parsed.filter(
        (p) =>
          !p.name.toLowerCase().includes('alpha') &&
          !p.name.toLowerCase().includes('beta') &&
          !p.id.toLowerCase().includes('alpha') &&
          !p.id.toLowerCase().includes('beta')
      );
      if (cleaned.length !== parsed.length || cleaned.length === 0) {
        const finalProfiles = cleaned.length > 0 ? cleaned : DEFAULT_PROFILES;
        await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(finalProfiles));
        return finalProfiles;
      }
      return parsed;
    } catch {
      return DEFAULT_PROFILES;
    }
  },

  async saveProfiles(profiles: BroProfile[]): Promise<void> {
    await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  },

  async getRoutines(profileId?: string): Promise<WorkoutRoutine[]> {
    try {
      const data = await AsyncStorage.getItem(ROUTINES_KEY);
      if (!data) {
        await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(DEFAULT_ROUTINES));
        return DEFAULT_ROUTINES;
      }
      const allRoutines: WorkoutRoutine[] = JSON.parse(data);
      if (profileId) {
        return allRoutines.filter((r) => !r.created_by || r.created_by === profileId);
      }
      return allRoutines;
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

  async getLastExerciseLog(exerciseName: string): Promise<WorkoutSetLog | null> {
    try {
      const sessions = await this.getSessions();
      for (const session of sessions) {
        const logs = await this.getSetLogs(session.id);
        const matchingLogs = logs.filter((l) => l.exercise_name === exerciseName);
        if (matchingLogs.length > 0) {
          return matchingLogs[matchingLogs.length - 1];
        }
      }
      return null;
    } catch {
      return null;
    }
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
