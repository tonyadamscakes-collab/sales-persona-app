import { type ReactNode } from "react";
import { Pressable, ScrollView, Text, TextInput, View, type TextInputProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePreferences } from "@/src/state/preferences";
import { space } from "@/src/theme/tokens";

export function Screen({ children }: { children: ReactNode }) {
  const { colors } = usePreferences();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: space.screen, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Heading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  const { colors } = usePreferences();
  return (
    <View style={{ marginBottom: 16, gap: 4 }}>
      <Text style={{ color: colors.muted, fontSize: 12, letterSpacing: 1 }}>{eyebrow}</Text>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: "600" }}>{title}</Text>
      {subtitle ? <Text style={{ color: colors.muted, fontSize: 15, lineHeight: 22 }}>{subtitle}</Text> : null}
    </View>
  );
}

export function Notice({ message }: { message: string }) {
  const { colors } = usePreferences();
  return <Text style={{ color: colors.muted, fontSize: 15, lineHeight: 22 }}>{message}</Text>;
}

export function ErrorText({ message }: { message: string }) {
  const { colors } = usePreferences();
  return (
    <Text accessibilityRole="alert" style={{ color: colors.bad, fontSize: 14, lineHeight: 20 }}>
      {message}
    </Text>
  );
}

export function Button({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { colors } = usePreferences();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={{
        backgroundColor: colors.accent,
        borderRadius: space.radius,
        opacity: disabled ? 0.45 : 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: "center",
      }}
    >
      <Text style={{ color: colors.onAccent, fontSize: 15, fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
}

export function Choice({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors } = usePreferences();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: selected ? colors.accent : colors.border,
        backgroundColor: selected ? colors.accent : colors.card,
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
      }}
    >
      <Text style={{ color: selected ? colors.onAccent : colors.text, fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}

export function Field({ label, ...input }: { label: string } & TextInputProps) {
  const { colors } = usePreferences();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors.text, fontSize: 14 }}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        {...input}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.card,
          color: colors.text,
          borderRadius: space.radius,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 16,
        }}
      />
    </View>
  );
}

export function Card({ children }: { children: ReactNode }) {
  const { colors } = usePreferences();
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: space.radius,
        padding: 14,
        gap: 6,
      }}
    >
      {children}
    </View>
  );
}
