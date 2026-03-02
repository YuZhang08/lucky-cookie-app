import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "./src/screens/HomeScreen";
import { FavoritesScreen } from "./src/screens/FavoritesScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { AppStoreProvider, useAppStore } from "./src/store/AppStore";
import { theme } from "./src/theme";
import { t } from "./src/i18n";

export type RootTabParamList = {
  Lucky: undefined;
  Favorites: undefined;
  Stats: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: "#f2d9a8"
  }
};

const AppTabs = (): React.JSX.Element => {
  const { state } = useAppStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: "#9e8c6d",
        tabBarShowIcon: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: "#ebd2a0",
          height: 64,
          paddingBottom: 8,
          paddingTop: 6
        }
      })}
    >
      <Tab.Screen name="Lucky" component={HomeScreen} options={{ tabBarLabel: t(state.language, "tabLucky") }} />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarLabel: t(state.language, "tabFavorites") }}
      />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ tabBarLabel: t(state.language, "tabStats") }} />
    </Tab.Navigator>
  );
};

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AppStoreProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <AppTabs />
        </NavigationContainer>
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}
