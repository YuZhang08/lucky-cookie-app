# Lucky Cookie Mobile App

A polished Expo React Native app for iOS and Android featuring a satisfying fortune-cookie cracking experience.

## Features implemented

- Tap cookie to crack
- Shake phone to crack (`expo-sensors` accelerometer)
- Bilingual UI and fortunes (English default, switch to Chinese)
- Crunch sound on crack with graceful fallback if audio fails
- Optional looping ambience with mute/unmute toggle
- Paper strip reveal + animated fortune text
- Local fortune bank (single style, stored in app code)
- Daily Fortune (same special fortune for the same day)
- Streak counter (consecutive days opened)
- Favorites (save/remove fortunes)
- Stats screen:
  - Total cookies opened
  - Total favorites
  - Current streak

## Tech stack

- Expo + React Native + TypeScript
- React Navigation (bottom tabs)
- AsyncStorage persistence
- Expo AV, Haptics, Sensors

## Run locally

```bash
npm install
npm run dev
```

Then press:

- `i` for iOS simulator
- `a` for Android emulator
- Scan QR with Expo Go for physical device testing (recommended for shake)

## Project structure

```text
src/
  components/
  data/
  hooks/
  screens/
  store/
  utils/
```

## Notes

- Audio files are currently loaded via remote URLs in `src/hooks/useCookieAudio.ts`.
- For production/offline reliability, replace those URLs with local audio assets and load via `require(...)`.
- Large fortune text bundles are available in:
  - `fortunes_10000.txt` (Chinese)
  - `fortunes_en_10000.txt` (English)

## Suggested phase 2 (optional AI fortune)

- Add an `AI Fortune` card with input fields (name, mood, zodiac sign)
- Call a small backend endpoint that proxies OpenAI API requests
- Cache generated fortunes locally and allow favoriting
