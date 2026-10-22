import type { Difficulty, DimensionScores } from "@/src/domain";

export type Persona = {
  id: string;
  name: string;
  businessType: string;
  summary: string;
  monogram: string;
  toneProfile: {
    pace: string;
    skepticism: number;
    warmth: number;
    voiceSummary: string;
    samplePhrases: string[];
  };
  difficultyScaling: Record<Difficulty, { coachingNote: string }>;
  conversationStyle: {
    respects: string[];
    irritants: string[];
  };
  buyingTriggers: { id: string; label: string; detail: string }[];
  painPoints: { id: string; label: string; detail: string }[];
};

export type StoredScore = {
  overall: number;
  dimensions: DimensionScores;
  band: "weak" | "mixed" | "strong";
};

export type SessionMessage = {
  id: string;
  seq: number;
  role: "persona" | "user" | "feedback";
  content: string;
  objectionCategory: string | null;
  score: StoredScore | null;
  createdAt: Date | string;
};

export type ScoreCard = {
  overall: number;
  dimensions: DimensionScores;
  turnsScored: number;
  outcome: string;
  phase: string;
  objectionsHandled: number;
  status: "active" | "completed";
  difficulty: Difficulty;
  recoveredFromEscalation: boolean;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  badgeKey: string;
  unlocked: boolean;
};

export type PresentedSession = {
  session: {
    id: string;
    userName: string;
    difficulty: Difficulty;
    status: "active" | "completed";
    outcome: string;
    phase: string;
    startedAt: Date | string;
    endedAt: Date | string | null;
    state: {
      objection: {
        category: string;
        intensity: number;
        text: string;
        painPointId: string;
      };
    };
  };
  persona: Persona;
  messages: SessionMessage[];
  score: ScoreCard;
  achievements: Achievement[];
  newlyUnlocked: string[];
};

export type HistoryItem = {
  id: string;
  userName: string;
  personaName: string;
  difficulty: string;
  status: string;
  outcome: string;
  overallScore: number;
  startedAt: Date | string;
};

export type AnalyticsReport = {
  overview: {
    sessions: number;
    completed: number;
    avgScore: number;
    winRate: number | null;
    bestScore: number;
  };
  hardestObjections: {
    category: string;
    personaId: string;
    personaName: string;
    attempts: number;
    avgScore: number;
  }[];
  leaderboard: {
    rank: number;
    userName: string;
    sessions: number;
    wins: number;
    average: number;
    best: number;
    strongestPersona: string;
  }[];
  achievements: (Achievement & { holders: number })[];
  recentSessions: HistoryItem[];
  userStats: {
    userName: string;
    wins: number;
    losses: number;
    partials: number;
    favouritePersona: string | null;
    achievementsUnlocked: number;
    achievementsTotal: number;
  } | null;
};

export type AnalyticsInput = {
  userName?: string;
  personaId?: string;
  difficulty?: Difficulty;
};
