import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { trainerApi } from "@/src/api/client";
import { Button, Card, Choice, ErrorText, Field, Heading, Notice, Screen } from "@/src/components/ui";
import { DIFFICULTIES } from "@/src/domain";
import { useLoad } from "@/src/hooks/useLoad";
import { activeOffer } from "@/src/offer/active";
import { usePreferences } from "@/src/state/preferences";

export function TrainScreen() {
  const router = useRouter();
  const offer = activeOffer();
  const { name, setName, difficulty, setDifficulty, colors } = usePreferences();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadPersonas = useCallback(() => trainerApi.listPersonas(), []);
  const personas = useLoad(loadPersonas);
  const selected = personas.data?.find((persona) => persona.id === selectedId) ?? null;

  async function start() {
    const userName = name.trim();
    if (!selectedId) {
      setError("Choose a counter first.");
      return;
    }
    if (!userName) {
      setError("Enter the name you want on the board.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      setName(userName);
      const result = await trainerApi.createSession({ personaId: selectedId, userName, difficulty });
      router.push(`/session/${result.session.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not open the sitting.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Screen>
      <Heading
        eyebrow="Sales Persona Trainer"
        title="Train"
        subtitle={`You are selling ${offer.name}. ${offer.summary}`}
      />
      <View style={{ gap: 14 }}>
        <Field
          label="Name on the board"
          value={name}
          onChangeText={setName}
          maxLength={32}
          autoCapitalize="words"
          placeholder="Your name"
        />
        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.text, fontSize: 14 }}>Difficulty</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {DIFFICULTIES.map((option) => (
              <Choice
                key={option}
                label={option}
                selected={difficulty === option}
                onPress={() => setDifficulty(option)}
              />
            ))}
          </View>
          <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 20 }}>
            {selected
              ? selected.difficultyScaling[difficulty].coachingNote
              : "Choose a counter to see how this difficulty behaves."}
          </Text>
        </View>
        <Button label={pending ? "Opening the sitting…" : "Start sitting"} onPress={() => void start()} disabled={pending} />
        {error ? <ErrorText message={error} /> : null}
        {personas.loading ? <Notice message="Loading counters…" /> : null}
        {personas.error ? <ErrorText message={personas.error} /> : null}
        {personas.error ? <Button label="Try again" onPress={personas.reload} /> : null}
        <View style={{ gap: 10 }}>
          {personas.data?.map((persona) => {
            const selectedCard = persona.id === selectedId;
            return (
              <Pressable key={persona.id} accessibilityRole="button" accessibilityState={{ selected: selectedCard }} onPress={() => setSelectedId(persona.id)}>
                <Card>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>{persona.monogram} · {persona.businessType}</Text>
                  <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600" }}>{persona.name}</Text>
                  <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 20 }}>{persona.summary}</Text>
                  {selectedCard ? <Text style={{ color: colors.accent, fontSize: 13 }}>Selected</Text> : null}
                </Card>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}
