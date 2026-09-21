import { Audio } from 'expo-av';
import { SpeechService } from './speechService';

let currentSound: Audio.Sound | null = null;

export const AudioService = {
  /**
   * Reproduz um arquivo de áudio remoto (MP3/WAV) via expo-av.
   * Se a URL falhar ou estiver ausente, executa o SpeechService (TTS) como fallback.
   */
  async playUrl(url?: string | null, fallbackText?: string): Promise<boolean> {
    await this.stop();

    if (!url) {
      if (fallbackText) SpeechService.speak(fallbackText);
      return false;
    }

    try {
      if (Audio.setAudioModeAsync) {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );

      currentSound = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
          if (currentSound === sound) currentSound = null;
        }
      });

      return true;
    } catch (error) {
      console.warn('Failed to load MP3 audio via expo-av, falling back to TTS:', error);
      if (fallbackText) SpeechService.speak(fallbackText);
      return false;
    }
  },

  /**
   * Interrompe qualquer áudio ou fala em andamento e libera os recursos.
   */
  async stop(): Promise<void> {
    SpeechService.stop();
    if (currentSound) {
      try {
        await currentSound.unloadAsync();
      } catch (err) {
        // Ignora erros de descarte
      }
      currentSound = null;
    }
  },
};
