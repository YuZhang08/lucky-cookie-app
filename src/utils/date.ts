export const toDayKey = (date: Date = new Date()): string => {
  const yyyy = date.getFullYear();
  const mm = `${date.getMonth() + 1}`.padStart(2, "0");
  const dd = `${date.getDate()}`.padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const isYesterday = (previousDayKey: string, now: Date = new Date()): boolean => {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return previousDayKey === toDayKey(yesterday);
};

export const getDateLabel = (dayKey: string, language: "en" | "zh" = "en"): string => {
  const [year, month, day] = dayKey.split("-").map(Number);
  const locale = language === "zh" ? "zh-CN" : "en-US";
  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};
