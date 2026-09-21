import { AudioService } from '../services/audioService';
import { SpeechService } from '../services/speechService';
import { Audio } from 'expo-av';

jest.mock('expo-av', () => {
  const mockSound = {
    playAsync: jest.fn().mockResolvedValue(undefined),
    unloadAsync: jest.fn().mockResolvedValue(undefined),
    setOnPlaybackStatusUpdate: jest.fn(),
  };

  return {
    Audio: {
      Sound: {
        createAsync: jest.fn().mockResolvedValue({ sound: mockSound }),
      },
      setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
    },
  };
});

jest.mock('../services/speechService', () => ({
  SpeechService: {
    speak: jest.fn(),
    stop: jest.fn(),
  },
}));

describe('AudioService - expo-av Sound Player & TTS Fallback (Subagent Tester TDD)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should play remote audio URL using expo-av Audio.Sound.createAsync', async () => {
    const testUrl = 'https://www.myinstants.com/media/sounds/999-social-credit-siren.mp3';

    const result = await AudioService.playUrl(testUrl);

    expect(result).toBe(true);
    expect(Audio.Sound.createAsync).toHaveBeenCalledWith(
      { uri: testUrl },
      { shouldPlay: true }
    );
  });

  it('should fallback to SpeechService.speak if audio_url is invalid or fails to load', async () => {
    (Audio.Sound.createAsync as jest.Mock).mockRejectedValueOnce(
      new Error('Network error loading audio')
    );

    const fallbackText = 'Provocação de emergência';
    const result = await AudioService.playUrl('https://invalid-url.com/broken.mp3', fallbackText);

    expect(result).toBe(false);
    expect(SpeechService.speak).toHaveBeenCalledWith(fallbackText);
  });

  it('should stop and unload active audio playback cleanly', async () => {
    await AudioService.playUrl('https://www.myinstants.com/media/sounds/mlg-airhorn.mp3');
    await AudioService.stop();

    expect(SpeechService.stop).toHaveBeenCalled();
  });
});
