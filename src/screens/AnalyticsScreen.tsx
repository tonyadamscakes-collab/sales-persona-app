import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { trainerApi } from "@/src/api/client";
import { Button, Card, ErrorText, Field, Heading, Notice, Screen } from "@/src/components/ui";
import { categoryLabel, formatScore } from "@/src/format";
import { useLoad } from "@/src/hooks/useLoad";
import { usePreferences } from "@/src/state/preferences";

export function AnalyticsScreen() {
  const { name, setName, colors } = usePreferences();
  const [draft, setDraft] = useState(name);
  const [applied, setApplied] = useState(name);
  const load = useCallback(() => trainerApi.analytics({ userName: applied.trim() || undefined }), [applied]);
  const report = useLoad(load);
  const data = report.data;
  const overview = data?.overview;

  return (
    <Screen>
      <Heading eyebrow="Analytics" title="The floor, in numbers" />
      <View style={{ gap: 12 }}>
        <Field label="Your name" value={draft} onChangeText={setDraft} placeholder="Your name" />
        <Button
          label="Show stats"
          onPress={() => {
            const next = draft.trim();
            setApplied(next);
            if (next) setName(next);
          }}
        />
        {report.loading ? <Notice message="Loading analytics…" /> : null}
        {report.error ? <ErrorText message={report.error} /> : null}
        {data && overview ? (
          <>
            <Card>
              <Text style={{ color: colors.text, fontSize: 15 }}>Sittings {overview.sessions} ({overview.completed} finished)</Text>
              <Text style={{ color: colors.text, fontSize: 15 }}>Average {formatScore(overview.avgScore)}</Text>
              <Text style={{ color: colors.text, fontSize: 15 }}>Win rate {overview.winRate === null ? "—" : `${overview.winRate}%`}</Text>
              <Text style={{ color: colors.text, fontSize: 15 }}>Best {formatScore(overview.bestScore)}</Text>
            </Card>
            {data.userStats ? (
              <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 20 }}>
                {data.userStats.userName} · {data.userStats.wins} wins, {data.userStats.losses} losses, {data.userStats.partials} partial · favourite counter {data.userStats.favouritePersona ?? "not yet"} · {data.userStats.achievementsUnlocked}/{data.userStats.achievementsTotal} badges
              </Text>
            ) : (
              <Notice message="Enter your name to see which badges you have unlocked." />
            )}
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600" }}>Hardest objections</Text>
            {data.hardestObjections.length === 0 ? <Notice message="Once replies are scored, the lowest categories show up here." /> : null}
            {data.hardestObjections.map((item) => (
              <Card key={`${item.personaId}-${item.category}`}>
                <Text style={{ color: colors.text, fontSize: 15 }}>{categoryLabel(item.category)} · {item.avgScore}</Text>
                <Text style={{ color: colors.muted, fontSize: 13 }}>{item.personaName} · {item.attempts} tries</Text>
              </Card>
            ))}
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600" }}>Badges</Text>
            {data.achievements.map((item) => (
              <Card key={item.id}>
                <Text style={{ color: colors.text, fontSize: 15 }}>{item.name}</Text>
                <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 20 }}>{item.description}</Text>
                <Text style={{ color: item.unlocked ? colors.good : colors.muted, fontSize: 12 }}>
                  {item.unlocked ? "Unlocked" : "Still locked"}
                </Text>
              </Card>
            ))}
          </>
        ) : null}
      </View>
    </Screen>
  );
}
