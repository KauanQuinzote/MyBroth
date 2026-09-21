export interface SoundboardMemeItem {
  id: string;
  title: string;
  category: 'pesado' | 'frango' | 'brother';
  audio_url: string;
  nudge_text: string;
  icon_name?: string;
}

export const MEME_SOUNDBOARD: SoundboardMemeItem[] = [
  {
    id: 'social-credit-siren',
    title: 'Sirene Social Credit',
    category: 'pesado',
    audio_url: 'https://www.myinstants.com/media/sounds/999-social-credit-siren.mp3',
    nudge_text: 'ALERTA MAXIMO DE PREGUIÇA NO TREINO!',
    icon_name: 'Siren',
  },
  {
    id: 'airhorn-meme',
    title: 'Airhorn MLG',
    category: 'brother',
    audio_url: 'https://www.myinstants.com/media/sounds/mlg-airhorn.mp3',
    nudge_text: 'BORA QUE HOJE É DIA DE RECORD PESADO!',
    icon_name: 'Volume2',
  },
  {
    id: 'bruh-sound',
    title: 'Bruh',
    category: 'frango',
    audio_url: 'https://www.myinstants.com/media/sounds/bruh-sound-effect-1.mp3',
    nudge_text: 'Sério mesmo que você colocou essa carga?',
    icon_name: 'Frown',
  },
  {
    id: 'fausto-errou',
    title: 'Faustão Errou',
    category: 'frango',
    audio_url: 'https://www.myinstants.com/media/sounds/errou_1.mp3',
    nudge_text: 'ERROU! Pula treino não bro!',
    icon_name: 'Flame',
  },
  {
    id: 'sad-violin',
    title: 'Sad Violin',
    category: 'frango',
    audio_url: 'https://www.myinstants.com/media/sounds/sad-violin.mp3',
    nudge_text: 'Chora não, próxima série você aguenta!',
    icon_name: 'Music',
  },
];
