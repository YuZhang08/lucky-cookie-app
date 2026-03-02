import { useEffect } from "react";
import { Audio } from "expo-av";

const CRUNCH_AUDIO = require("../../assets/audio/crunch.aiff");

export const useCookieAudio = (muted: boolean): { playCrunch: () => Promise<void> } => {
  useEffect(() => {
    void Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      staysActiveInBackground: false
    });
  }, []);

  const playCrunch = async (): Promise<void> => {
    if (muted) {
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(CRUNCH_AUDIO, { shouldPlay: true, volume: 1.0 });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          void sound.unloadAsync();
        }
      });
    } catch {
      // Audio is optional; ignore failures.
    }
  };

  return { playCrunch };
};
