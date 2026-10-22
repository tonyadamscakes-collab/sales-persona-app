import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { trainerApi } from "@/src/api/client";
import { Button, Card, ErrorText, Field, Heading, Notice, Screen } from "@/src/components/ui";
import { formatScore, formatWhen, outcomeLabel } from "@/src/format";
import { useLoad } from "@/src/hooks/useLoad";
import { usePreferences } from "@/src/state/preferences";

export function HistoryScreen() {
  const router = useRouter();
  const { name, setName, colors } = usePreferences();
  const [draft, setDraft] = useState(name);
  const [applied, setApplied] = useState(name);
  const load = useCallback(() => trainerApi.analytics({ userName: applied.trim() || undefined }), [applied]);
  const history = useLoad(load);

  return (
    <Screen>
      <Heading eyebrow="Session history" title="Sittings" />
      <View style={{ gap: 12 }}>
        <Field label="Filter by name" value={draft} onChangeText={setDraft} placeholder="Your name" />
        <Button
          label="Filter"
          onPress={() => {
            const next = draft.trim();
            setApplied(next);
            if (next) setName(next);
          }}
        />
        {history.loading ? <Notice message="Loading sittings…" /> : null}
        {history.error ? <ErrorText message={history.error} /> : null}
        {history.data?.recentSessions.length === 0 ? (
          <Notice message="No sittings yet. Pick a counter and run the first objection." />
        ) : null}
        {history.data?.recentSessions.map((item) => (
          <Pressable key={item.id} accessibilityRole="button" onPress={() => router.push(`/session/${item.id}`)}>
            <Card>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600" }}>{item.personaName}</Text>
              <Text style={{ color: colors.muted, fontSize: 14 }}>
                {item.userName} · {item.difficulty} · {outcomeLabel(item.outcome)} · {formatWhen(item.startedAt)}
              </Text>
              <Text style={{ color: colors.text, fontSize: 14 }}>
                {item.status === "active" ? "In progress" : formatScore(item.overallScore)}
              </Text>
            </Card>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
