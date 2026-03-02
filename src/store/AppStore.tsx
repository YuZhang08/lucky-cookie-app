import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fortunesByLanguage } from "../data/fortunes";
import { toDayKey, isYesterday } from "../utils/date";
import { AppState, Language } from "../types";

type AppStoreValue = {
  state: AppState;
  loading: boolean;
  crackCookie: () => string;
  getDailyFortune: () => string;
  toggleFavorite: (text: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (text: string) => boolean;
  toggleAmbienceMuted: () => void;
  setLanguage: (language: Language) => void;
};

const STORAGE_KEY = "lucky-cookie-state-v2";

const initialState: AppState = {
  language: "en",
  stats: {
    totalOpened: 0,
    currentStreak: 0,
    lastOpenedDate: null
  },
  favorites: [],
  dailyFortunes: {
    en: { date: null, text: null },
    zh: { date: null, text: null }
  },
  lastFortuneAt: null,
  lastFortuneByLanguage: {
    en: null,
    zh: null
  },
  ambienceMuted: true
};

const AppStoreContext = createContext<AppStoreValue | null>(null);
const FORTUNE_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const hashString = (input: string): number => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const randomFortune = (language: Language): string => {
  const list = fortunesByLanguage[language];
  return list[Math.floor(Math.random() * list.length)];
};

const computeDailyFortune = (dayKey: string, language: Language): string => {
  const list = fortunesByLanguage[language];
  const index = hashString(`${language}-${dayKey}`) % list.length;
  return list[index];
};

export const AppStoreProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const [state, setState] = useState<AppState>(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setLoading(false);
          return;
        }
        const parsed = JSON.parse(raw) as Partial<AppState>;
        setState({
          ...initialState,
          ...parsed,
          stats: {
            ...initialState.stats,
            ...parsed.stats
          },
          dailyFortunes: {
            ...initialState.dailyFortunes,
            ...(parsed.dailyFortunes ?? {})
          }
        });
      } catch {
        setState(initialState);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loading]);

  const crackCookie = useCallback((): string => {
    const now = new Date();
    const nowMs = now.getTime();
    const today = toDayKey(now);
    const currentFortune = state.lastFortuneByLanguage[state.language];
    const lastAt = state.lastFortuneAt ? new Date(state.lastFortuneAt).getTime() : null;
    const isCoolingDown = Boolean(lastAt && nowMs - lastAt < FORTUNE_COOLDOWN_MS && currentFortune);

    if (isCoolingDown && currentFortune) {
      return currentFortune;
    }

    const fortune = randomFortune(state.language);

    setState((prev) => {
      let streak = prev.stats.currentStreak;
      if (prev.stats.lastOpenedDate !== today) {
        if (!prev.stats.lastOpenedDate) {
          streak = 1;
        } else if (isYesterday(prev.stats.lastOpenedDate, now)) {
          streak = prev.stats.currentStreak + 1;
        } else {
          streak = 1;
        }
      }

      return {
        ...prev,
        lastFortuneAt: now.toISOString(),
        lastFortuneByLanguage: {
          ...prev.lastFortuneByLanguage,
          [prev.language]: fortune
        },
        stats: {
          totalOpened: prev.stats.totalOpened + 1,
          currentStreak: streak,
          lastOpenedDate: today
        }
      };
    });

    return fortune;
  }, [state.language, state.lastFortuneAt, state.lastFortuneByLanguage]);

  const getDailyFortune = useCallback((): string => {
    const today = toDayKey();
    const entry = state.dailyFortunes[state.language];

    if (entry.date === today && entry.text) {
      return entry.text;
    }

    const text = computeDailyFortune(today, state.language);
    setState((prev) => ({
      ...prev,
      dailyFortunes: {
        ...prev.dailyFortunes,
        [state.language]: {
          date: today,
          text
        }
      }
    }));
    return text;
  }, [state.dailyFortunes, state.language]);

  const toggleFavorite = (text: string): void => {
    setState((prev) => {
      const existing = prev.favorites.find((item) => item.text === text);
      if (existing) {
        return {
          ...prev,
          favorites: prev.favorites.filter((item) => item.id !== existing.id)
        };
      }

      const newItem = {
        id: `${Date.now()}-${text.slice(0, 12)}`,
        text,
        createdAt: new Date().toISOString()
      };
      return {
        ...prev,
        favorites: [newItem, ...prev.favorites]
      };
    });
  };

  const removeFavorite = (id: string): void => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.filter((item) => item.id !== id)
    }));
  };

  const isFavorite = (text: string): boolean => state.favorites.some((item) => item.text === text);

  const toggleAmbienceMuted = (): void => {
    setState((prev) => ({ ...prev, ambienceMuted: !prev.ambienceMuted }));
  };

  const setLanguage = (language: Language): void => {
    setState((prev) => ({ ...prev, language }));
  };

  const value = useMemo<AppStoreValue>(
    () => ({
      state,
      loading,
      crackCookie,
      getDailyFortune,
      toggleFavorite,
      removeFavorite,
      isFavorite,
      toggleAmbienceMuted,
      setLanguage
    }),
    [state, loading, crackCookie, getDailyFortune]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};

export const useAppStore = (): AppStoreValue => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }
  return context;
};
