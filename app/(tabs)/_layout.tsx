import { Tabs } from "expo-router";
import { usePreferences } from "@/src/state/preferences";

export default function TabLayout() {
  const { colors } = usePreferences();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Train" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="analytics" options={{ title: "Analytics" }} />
      <Tabs.Screen name="leaderboard" options={{ title: "Board" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
