export const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export type ThemeMode = "light" | "dark";

export const DIMENSIONS = [
  "acknowledgement",
  "empathy",
  "reframe",
  "evidence",
  "question",
  "close",
  "relevance",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

export type DimensionScores = Record<Dimension, number>;

export const DIMENSION_LABELS: Record<Dimension, string> = {
  acknowledgement: "Acknowledgement",
  empathy: "Empathy",
  reframe: "Reframe",
  evidence: "Evidence",
  question: "Question",
  close: "Close",
  relevance: "Relevance",
};

export function isDifficulty(value: string): value is Difficulty {
  return value === "easy" || value === "medium" || value === "hard";
}
