import * as Speech from 'expo-speech';

export const playNudgeSoundEffect = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Toca uma sequência de 3 tons vibrantes (Efeito Sonoro de Provocação Maromba)
    const tones = [523.25, 659.25, 783.99]; // C5, E5, G5
    tones.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.1 + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.1);
      osc.stop(ctx.currentTime + index * 0.1 + 0.2);
    });
  } catch (e) {
    console.warn('AudioContext error:', e);
  }
};

let activeAudioElement: any = null;

export const SpeechService = {
  speak(text: string, options?: { pitch?: number; rate?: number }) {
    // 1. Toca o efeito sonoro maromba
    playNudgeSoundEffect();

    // Interrompe áudio anterior se houver
    this.stop();

    // 2. No ambiente Web ou quando falta voz no SO, usa o engine de áudio TTS
    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      try {
        const encodedText = encodeURIComponent(text);
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=pt-BR&client=tw-ob`;
        
        const audio = new Audio(ttsUrl);
        audio.volume = 1.0;
        activeAudioElement = audio;

        audio.play().catch((err) => {
          console.warn('HTML5 Audio play error, trying Expo Speech fallback:', err);
          this.fallbackExpoSpeech(text, options);
        });
        return;
      } catch (e) {
        console.warn('Audio TTS error:', e);
      }
    }

    // 3. Em dispositivos nativos (Android/iOS), usa o Expo Speech
    this.fallbackExpoSpeech(text, options);
  },

  fallbackExpoSpeech(text: string, options?: { pitch?: number; rate?: number }) {
    try {
      Speech.stop();
      Speech.speak(text, {
        language: 'pt-BR',
        pitch: options?.pitch ?? 0.95,
        rate: options?.rate ?? 1.0,
      });
    } catch (e) {
      console.warn('Expo Speech fallback error:', e);
    }
  },

  stop() {
    try {
      if (activeAudioElement) {
        activeAudioElement.pause();
        activeAudioElement.currentTime = 0;
        activeAudioElement = null;
      }
      Speech.stop();
    } catch (e) {}
  },
};
