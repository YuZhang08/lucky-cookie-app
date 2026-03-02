import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "../components/ScreenContainer";
import { useAppStore } from "../store/AppStore";
import { theme } from "../theme";
import { t } from "../i18n";

const StatCard = ({ label, value }: { label: string; value: string | number }): React.JSX.Element => (
  <View style={styles.card}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

export const StatsScreen = (): React.JSX.Element => {
  const { state } = useAppStore();
  const lang = state.language;

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t(lang, "statsTitle")}</Text>
      <Text style={styles.subtitle}>{t(lang, "statsSubtitle")}</Text>

      <View style={styles.grid}>
        <StatCard label={t(lang, "totalOpened")} value={state.stats.totalOpened} />
        <StatCard
          label={t(lang, "currentStreak")}
          value={`${state.stats.currentStreak} ${state.stats.currentStreak === 1 ? t(lang, "day") : t(lang, "days")}`}
        />
        <StatCard label={t(lang, "totalFavorites")} value={state.favorites.length} />
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>{t(lang, "streakRule")}</Text>
        <Text style={styles.tipText}>{t(lang, "streakRuleText")}</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 29,
    fontWeight: "800",
    color: theme.colors.accentDark
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 14,
    color: theme.colors.muted
  },
  grid: {
    gap: 10
  },
  card: {
    padding: 16,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "#ecd8b2"
  },
  value: {
    color: theme.colors.accentDark,
    fontWeight: "800",
    fontSize: 30
  },
  label: {
    marginTop: 4,
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600"
  },
  tipCard: {
    marginTop: 14,
    borderRadius: theme.radius.md,
    backgroundColor: "#fff8ea",
    borderWidth: 1,
    borderColor: "#ecd8b2",
    padding: 14
  },
  tipTitle: {
    color: theme.colors.accentDark,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6
  },
  tipText: {
    color: theme.colors.text,
    lineHeight: 22
  }
});
