import "react-native-reanimated";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PreferencesProvider, usePreferences } from "@/src/state/preferences";

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <RootNavigator />
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { ready, colors, mode } = usePreferences();
  if (!ready) return null;
  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="session/[id]" />
      </Stack>
    </>
  );
}
