import { Text, View } from "react-native";
import { apiBaseUrl } from "@/src/api/client";
import { Choice, Field, Heading, Screen } from "@/src/components/ui";
import { DIFFICULTIES } from "@/src/domain";
import { usePreferences } from "@/src/state/preferences";

export function SettingsScreen() {
  const { name, setName, difficulty, setDifficulty, mode, setMode, colors } = usePreferences();

  return (
    <Screen>
      <Heading
        eyebrow="Settings"
        title="This device"
        subtitle="Name, difficulty, and light or dark mode stay on the phone. There is no account."
      />
      <View style={{ gap: 16 }}>
        <Field label="Name on the board" value={name} onChangeText={setName} maxLength={32} placeholder="Your name" />
        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.text, fontSize: 14 }}>Difficulty</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {DIFFICULTIES.map((option) => (
              <Choice key={option} label={option} selected={difficulty === option} onPress={() => setDifficulty(option)} />
            ))}
          </View>
        </View>
        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.text, fontSize: 14 }}>Appearance</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Choice label="Light" selected={mode === "light"} onPress={() => setMode("light")} />
            <Choice label="Dark" selected={mode === "dark"} onPress={() => setMode("dark")} />
          </View>
        </View>
        <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 18 }}>API {apiBaseUrl()}</Text>
      </View>
    </Screen>
  );
}
