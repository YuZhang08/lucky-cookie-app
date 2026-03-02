import { Language } from "./types";

type Dict = Record<Language, string>;

type I18nKey =
  | "appName"
  | "tabLucky"
  | "tabFavorites"
  | "tabStats"
  | "subtitle"
  | "saved"
  | "saveFortune"
  | "openAnother"
  | "dailyFortune"
  | "favoritesTitle"
  | "favoritesSubtitle"
  | "noFavorites"
  | "noFavoritesHint"
  | "statsTitle"
  | "statsSubtitle"
  | "totalOpened"
  | "currentStreak"
  | "totalFavorites"
  | "day"
  | "days"
  | "streakRule"
  | "streakRuleText";

const texts: Record<I18nKey, Dict> = {
  appName: { en: "Lucky Cookie", zh: "幸运饼干" },
  tabLucky: { en: "Lucky", zh: "幸运" },
  tabFavorites: { en: "Favorites", zh: "收藏" },
  tabStats: { en: "Stats", zh: "统计" },
  subtitle: { en: "Tap or shake to crack it open", zh: "点击或摇一摇来打开饼干" },
  saved: { en: "Saved", zh: "已收藏" },
  saveFortune: { en: "Save Fortune", zh: "收藏词条" },
  openAnother: { en: "Open another cookie", zh: "再开一个饼干" },
  dailyFortune: { en: "Daily Fortune", zh: "今日词条" },
  favoritesTitle: { en: "Favorites", zh: "收藏" },
  favoritesSubtitle: { en: "Saved fortunes you want to keep", zh: "你保存下来的幸运词条" },
  noFavorites: { en: "No favorites yet", zh: "还没有收藏" },
  noFavoritesHint: { en: "Crack a cookie and tap the heart icon.", zh: "先开一个饼干，再点心形图标。" },
  statsTitle: { en: "Your Stats", zh: "你的数据" },
  statsSubtitle: { en: "Simple progress from your cookie ritual", zh: "你的饼干习惯进度" },
  totalOpened: { en: "Total Cookies Opened", zh: "累计开启次数" },
  currentStreak: { en: "Current Streak", zh: "当前连续天数" },
  totalFavorites: { en: "Total Favorites", zh: "收藏总数" },
  day: { en: "day", zh: "天" },
  days: { en: "days", zh: "天" },
  streakRule: { en: "Streak Rule", zh: "连续规则" },
  streakRuleText: {
    en: "Open at least one cookie each day to keep your streak. Missing a day resets the streak to 1 on your next opening.",
    zh: "每天至少开启一次饼干可保持连续记录。中断一天后，下次开启会从 1 重新计算。"
  }
};

export const t = (language: Language, key: I18nKey): string => texts[key][language];
