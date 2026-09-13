import * as Speech from 'expo-speech';

let activeAudioElement: any = null;

export const SpeechService = {
  speak(text: string, options?: { pitch?: number; rate?: number }) {
    this.stop();

    // 1. Em ambiente Nativo Mobile (Android / iOS), usa o expo-speech oficial
    try {
      Speech.speak(text, {
        language: 'pt-BR',
        pitch: options?.pitch ?? 1.0,
        rate: options?.rate ?? 0.95,
      });
    } catch (e) {
      console.warn('Expo Speech error:', e);
    }

    // 2. Em ambiente Web (Dev / Browser), usa a Web Speech Synthesis nativa do navegador
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.pitch = options?.pitch ?? 1.0;
        utterance.rate = options?.rate ?? 0.95;

        // Tenta selecionar uma voz em português se disponível
        const voices = window.speechSynthesis.getVoices();
        const ptVoice = voices.find((v) => v.lang.startsWith('pt'));
        if (ptVoice) {
          utterance.voice = ptVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Web SpeechSynthesis error:', e);
      }
    }
  },

  stop() {
    try {
      Speech.stop();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
  },
};

