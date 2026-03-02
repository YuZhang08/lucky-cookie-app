import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { theme } from "../theme";

export const ScreenContainer = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.inner}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  inner: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12
  }
});
