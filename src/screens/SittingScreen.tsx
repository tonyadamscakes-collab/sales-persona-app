import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { trainerApi } from "@/src/api/client";
import type { PresentedSession, SessionMessage, StoredScore } from "@/src/api/types";
import { Button, Card, ErrorText, Notice } from "@/src/components/ui";
import { DIMENSION_LABELS, DIMENSIONS } from "@/src/domain";
import { categoryLabel, formatScore, outcomeLabel, phaseLabel } from "@/src/format";
import { useLoad } from "@/src/hooks/useLoad";
import { usePreferences } from "@/src/state/preferences";
import { space } from "@/src/theme/tokens";

export function SittingScreen({ id }: { id: string }) {
  const router = useRouter();
  const { colors } = usePreferences();
  const load = useCallback(() => trainerApi.fetchSession(id), [id]);
  const sitting = useLoad(load);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [fresh, setFresh] = useState<string[]>([]);

  async function apply(next: Promise<PresentedSession>, mode: "send" | "reset") {
    if (mode === "send") setSending(true);
    else setResetting(true);
    setActionError(null);
    try {
      const result = await next;
      if (mode === "send") {
        setDraft("");
        setFresh(result.newlyUnlocked);
      } else {
        setFresh([]);
        setDraft("");
      }
      sitting.replace(result);
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : "Could not update the sitting.");
    } finally {
      setSending(false);
      setResetting(false);
    }
  }

  const data = sitting.data;
  const closed = data?.session.status === "completed";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ padding: space.screen, gap: 12 }} keyboardShouldPersistTaps="handled">
          <Pressable accessibilityRole="button" onPress={() => router.back()}>
            <Text style={{ color: colors.accent, fontSize: 15 }}>Back</Text>
          </Pressable>
          {sitting.loading ? <Notice message="Loading the sitting…" /> : null}
          {sitting.error && !data ? <ErrorText message={sitting.error} /> : null}
          {sitting.error && !data ? <Button label="Try again" onPress={sitting.reload} /> : null}
          {data ? (
            <>
              <View style={{ gap: 4 }}>
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  {data.session.userName} · {data.session.difficulty} · {phaseLabel(data.session.phase)}
                </Text>
                <Text style={{ color: colors.text, fontSize: 28, fontWeight: "600" }}>{data.persona.name}</Text>
              </View>
              <Card>
                <Text style={{ color: colors.muted, fontSize: 12 }}>Score {formatScore(data.score.overall)}</Text>
                <Text style={{ color: colors.text, fontSize: 15 }}>
                  {outcomeLabel(data.session.outcome)} · {data.score.objectionsHandled} handled · {data.score.turnsScored} scored
                </Text>
              </Card>
              {closed ? (
                <Text style={{ color: colors.text, fontSize: 15 }}>
                  Sitting closed · {outcomeLabel(data.session.outcome)}. The last buyer line is their decision.
                </Text>
              ) : null}
              {fresh.length > 0 ? (
                <Text style={{ color: colors.good, fontSize: 14 }}>
                  New badge{fresh.length === 1 ? "" : "s"}: {data.achievements.filter((item) => fresh.includes(item.id)).map((item) => item.name).join(", ")}
                </Text>
              ) : null}
              <ObjectionCard session={data} />
              {data.messages.map((message) => (
                <MessageBlock key={message.id} message={message} messages={data.messages} />
              ))}
            </>
          ) : null}
        </ScrollView>
        {data ? (
          <View style={{ borderTopWidth: 1, borderTopColor: colors.border, padding: space.screen, gap: 8 }}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              editable={!closed && !sending}
              multiline
              maxLength={2000}
              placeholder={closed ? "This sitting is over. Reset to run it again." : "Your reply"}
              placeholderTextColor={colors.muted}
              style={{
                minHeight: 72,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: space.radius,
                padding: 12,
                color: colors.text,
                backgroundColor: colors.card,
                textAlignVertical: "top",
              }}
            />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Button
                  label={sending ? "Scoring…" : "Send reply"}
                  disabled={closed || sending || draft.trim().length === 0}
                  onPress={() => void apply(trainerApi.sendMessage({ sessionId: id, content: draft }), "send")}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  label={resetting ? "Resetting…" : "Reset"}
                  disabled={resetting || sending}
                  onPress={() => void apply(trainerApi.resetSession(id), "reset")}
                />
              </View>
            </View>
            {actionError ? <ErrorText message={actionError} /> : null}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ObjectionCard({ session }: { session: PresentedSession }) {
  const { colors } = usePreferences();
  const objection = session.session.state.objection;
  const pain = session.persona.painPoints.find((item) => item.id === objection.painPointId) ?? session.persona.painPoints[0];
  const lever = session.persona.buyingTriggers[0];
  const note = session.persona.difficultyScaling[session.session.difficulty]?.coachingNote;

  return (
    <Card>
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>
        {categoryLabel(objection.category)} · {objection.intensity}/3
      </Text>
      <Text style={{ color: colors.text, fontSize: 15, lineHeight: 22 }}>{objection.text}</Text>
      {pain ? (
        <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 20 }}>
          Buyer pressure: {pain.label}. {pain.detail}
        </Text>
      ) : null}
      <Text style={{ color: colors.text, fontSize: 14, lineHeight: 20 }}>What lands: {session.persona.conversationStyle.respects.join("; ")}</Text>
      <Text style={{ color: colors.text, fontSize: 14, lineHeight: 20 }}>What irritates: {session.persona.conversationStyle.irritants.join("; ")}</Text>
      {lever ? (
        <Text style={{ color: colors.text, fontSize: 14, lineHeight: 20 }}>
          Lever: {lever.label}. {lever.detail}
        </Text>
      ) : null}
      {note ? <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 18 }}>{note}</Text> : null}
    </Card>
  );
}

function MessageBlock({ message, messages }: { message: SessionMessage; messages: SessionMessage[] }) {
  const { colors } = usePreferences();
  const previous = messages.find((item) => item.seq === message.seq - 1);
  const score = message.role === "feedback" ? previous?.score ?? null : message.score;
  const buyer = message.role === "persona";
  const label = message.role === "feedback" ? "Coaching" : buyer ? "Buyer" : "You";

  return (
    <View style={{ alignItems: buyer || message.role === "feedback" ? "flex-start" : "flex-end" }}>
      <View
        style={{
          maxWidth: "100%",
          backgroundColor: message.role === "feedback" ? colors.bg : buyer ? colors.card : colors.accent,
          borderWidth: message.role === "user" ? 0 : 1,
          borderColor: colors.border,
          borderRadius: space.radius,
          padding: 12,
          gap: 6,
        }}
      >
        <Text style={{ color: message.role === "user" ? colors.onAccent : colors.muted, fontSize: 12 }}>{label}</Text>
        <Text style={{ color: message.role === "user" ? colors.onAccent : colors.text, fontSize: 15, lineHeight: 22 }}>{message.content}</Text>
        {message.role === "feedback" && score ? <ScoreLines score={score} /> : null}
      </View>
    </View>
  );
}

function ScoreLines({ score }: { score: StoredScore }) {
  const { colors } = usePreferences();
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ color: colors.text, fontSize: 13 }}>Score {score.overall}</Text>
      {DIMENSIONS.map((dimension) => (
        <Text key={dimension} style={{ color: colors.muted, fontSize: 12 }}>
          {DIMENSION_LABELS[dimension]} {score.dimensions[dimension]}
        </Text>
      ))}
    </View>
  );
}
