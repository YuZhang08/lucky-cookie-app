export type Language = "en" | "zh";

export type AppStats = {
  totalOpened: number;
  currentStreak: number;
  lastOpenedDate: string | null;
};

export type FavoriteFortune = {
  id: string;
  text: string;
  createdAt: string;
};

export type DailyFortuneEntry = {
  date: string | null;
  text: string | null;
};

export type AppState = {
  language: Language;
  stats: AppStats;
  favorites: FavoriteFortune[];
  dailyFortunes: Record<Language, DailyFortuneEntry>;
  lastFortuneAt: string | null;
  lastFortuneByLanguage: Record<Language, string | null>;
  ambienceMuted: boolean;
};
