import { AudioService } from '../services/audioService';
import { SpeechService } from '../services/speechService';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

const mockPlayerInstance = {
  play: jest.fn(),
  pause: jest.fn(),
  remove: jest.fn(),
  addListener: jest.fn(),
};

jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(() => mockPlayerInstance),
  setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../services/speechService', () => ({
  SpeechService: {
    speak: jest.fn(),
    stop: jest.fn(),
  },
}));

describe('AudioService - expo-audio Player & TTS Fallback (Subagent Tester TDD)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should play remote audio URL using expo-audio createAudioPlayer', async () => {
    const testUrl = 'https://www.myinstants.com/media/sounds/999-social-credit-siren.mp3';

    const result = await AudioService.playUrl(testUrl);

    expect(result).toBe(true);
    expect(createAudioPlayer).toHaveBeenCalledWith({ uri: testUrl });
    expect(mockPlayerInstance.play).toHaveBeenCalled();
  });

  it('should fallback to SpeechService.speak if audio_url is invalid or fails to load', async () => {
    (createAudioPlayer as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Network error loading audio');
    });

    const fallbackText = 'Provocação de emergência';
    const result = await AudioService.playUrl('https://invalid-url.com/broken.mp3', fallbackText);

    expect(result).toBe(false);
    expect(SpeechService.speak).toHaveBeenCalledWith(fallbackText);
  });

  it('should stop and remove active audio playback cleanly', async () => {
    await AudioService.playUrl('https://www.myinstants.com/media/sounds/mlg-airhorn.mp3');
    await AudioService.stop();

    expect(mockPlayerInstance.pause).toHaveBeenCalled();
    expect(mockPlayerInstance.remove).toHaveBeenCalled();
    expect(SpeechService.stop).toHaveBeenCalled();
  });
});
