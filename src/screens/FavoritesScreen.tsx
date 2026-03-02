import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "../components/ScreenContainer";
import { useAppStore } from "../store/AppStore";
import { theme } from "../theme";
import { getDateLabel } from "../utils/date";
import { t } from "../i18n";

export const FavoritesScreen = (): React.JSX.Element => {
  const { state, removeFavorite } = useAppStore();
  const lang = state.language;

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t(lang, "favoritesTitle")}</Text>
      <Text style={styles.subtitle}>{t(lang, "favoritesSubtitle")}</Text>

      {state.favorites.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>{t(lang, "noFavorites")}</Text>
          <Text style={styles.emptyText}>{t(lang, "noFavoritesHint")}</Text>
        </View>
      ) : (
        <FlatList
          data={state.favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.text}</Text>
              <View style={styles.itemFooter}>
                <Text style={styles.dateLabel}>{getDateLabel(item.createdAt.slice(0, 10), lang)}</Text>
                <Pressable onPress={() => removeFavorite(item.id)} style={styles.removeBtn}>
                  <Text style={styles.removeLabel}>Remove</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
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
    marginBottom: 12,
    color: theme.colors.muted
  },
  listContent: {
    paddingBottom: 18,
    gap: 10
  },
  item: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "#ecd8b2",
    padding: 14,
    gap: 10
  },
  itemText: {
    color: theme.colors.text,
    lineHeight: 23,
    fontSize: 16
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  dateLabel: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "600"
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffece7"
  },
  removeLabel: {
    color: "#c24a36",
    fontSize: 11,
    fontWeight: "700"
  },
  emptyWrap: {
    marginTop: 46,
    alignItems: "center",
    gap: 8
  },
  emptyTitle: {
    fontSize: 20,
    color: theme.colors.accentDark,
    fontWeight: "700"
  },
  emptyText: {
    color: theme.colors.muted
  }
});
