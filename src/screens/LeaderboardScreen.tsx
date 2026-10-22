import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { trainerApi } from "@/src/api/client";
import { Card, Choice, ErrorText, Heading, Notice, Screen } from "@/src/components/ui";
import { DIFFICULTIES, type Difficulty } from "@/src/domain";
import { useLoad } from "@/src/hooks/useLoad";
import { usePreferences } from "@/src/state/preferences";

export function LeaderboardScreen() {
  const { colors } = usePreferences();
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const personas = useLoad(useCallback(() => trainerApi.listPersonas(), []));
  const [personaId, setPersonaId] = useState("");
  const load = useCallback(
    () =>
      trainerApi.analytics({
        personaId: personaId || undefined,
        difficulty: difficulty || undefined,
      }),
    [personaId, difficulty],
  );
  const board = useLoad(load);

  return (
    <Screen>
      <Heading
        eyebrow="Leaderboard"
        title="Best finishes"
        subtitle="Ranked by best finished score, then average. There is no account."
      />
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Choice label="All levels" selected={difficulty === ""} onPress={() => setDifficulty("")} />
          {DIFFICULTIES.map((option) => (
            <Choice key={option} label={option} selected={difficulty === option} onPress={() => setDifficulty(option)} />
          ))}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Choice label="All counters" selected={personaId === ""} onPress={() => setPersonaId("")} />
          {personas.data?.map((persona) => (
            <Choice
              key={persona.id}
              label={persona.name}
              selected={personaId === persona.id}
              onPress={() => setPersonaId(persona.id)}
            />
          ))}
        </View>
        {board.loading ? <Notice message="Loading the board…" /> : null}
        {board.error ? <ErrorText message={board.error} /> : null}
        {board.data?.leaderboard.length === 0 ? (
          <Notice message="No finished sittings yet. Scores land here after a session ends." />
        ) : null}
        {board.data?.leaderboard.map((row) => (
          <Card key={row.userName}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>
              {row.rank}. {row.userName}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 14 }}>
              Best {row.best} · average {row.average} · {row.sessions} sittings · {row.wins} wins
            </Text>
            <Text style={{ color: colors.muted, fontSize: 13 }}>Strongest counter: {row.strongestPersona}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
