import { createAudioPlayer, AudioPlayer, setAudioModeAsync } from 'expo-audio';
import { SpeechService } from './speechService';

let currentPlayer: AudioPlayer | null = null;

export const AudioService = {
  /**
   * Reproduz um arquivo de áudio remoto (MP3/WAV) via expo-audio.
   * Se a URL falhar ou estiver ausente, executa o SpeechService (TTS) como fallback.
   */
  async playUrl(url?: string | null, fallbackText?: string): Promise<boolean> {
    await this.stop();

    if (!url) {
      if (fallbackText) SpeechService.speak(fallbackText);
      return false;
    }

    try {
      if (setAudioModeAsync) {
        await setAudioModeAsync({
          playsInSilentMode: true,
          interruptionMode: 'duckOthers',
        }).catch(() => {});
      }

      const player = createAudioPlayer({ uri: url });
      currentPlayer = player;

      player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          player.remove();
          if (currentPlayer === player) currentPlayer = null;
        }
      });

      player.play();
      return true;
    } catch (error) {
      console.warn('Failed to load audio via expo-audio, falling back to TTS:', error);
      if (fallbackText) SpeechService.speak(fallbackText);
      return false;
    }
  },

  /**
   * Interrompe qualquer áudio ou fala em andamento e libera os recursos.
   */
  async stop(): Promise<void> {
    SpeechService.stop();
    if (currentPlayer) {
      try {
        currentPlayer.pause();
        currentPlayer.remove();
      } catch (err) {
        // Ignora erros de descarte
      }
      currentPlayer = null;
    }
  },
};
