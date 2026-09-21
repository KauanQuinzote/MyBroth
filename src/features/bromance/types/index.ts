export type NudgeCategory = 'pesado' | 'frango' | 'brother';

export interface BromanceNudgeItem {
  id: string;
  category: NudgeCategory;
  text: string;
  intensity: 'heavy' | 'medium' | 'hyped';
}

export interface BromanceNudgeLog {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_initials: string;
  receiver_id: string;
  nudge_text: string;
  category: NudgeCategory;
  read_at?: string | null;
  created_at: string;
}
