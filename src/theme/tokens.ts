export type Palette = {
  bg: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  onAccent: string;
  good: string;
  bad: string;
  warn: string;
};

export const lightPalette: Palette = {
  bg: "#f4f3f0",
  card: "#ffffff",
  text: "#1c1b19",
  muted: "#6b6862",
  border: "#e3e0d8",
  accent: "#1f3d36",
  onAccent: "#f7f6f3",
  good: "#1f6b45",
  bad: "#8d2f2f",
  warn: "#8a5a12",
};

export const darkPalette: Palette = {
  bg: "#121311",
  card: "#1c1d1a",
  text: "#f3f1ec",
  muted: "#a39e94",
  border: "#2e2f2b",
  accent: "#d6c4a3",
  onAccent: "#1c1b19",
  good: "#8fbf9f",
  bad: "#e0a09a",
  warn: "#e0c48a",
};

export const space = {
  screen: 20,
  gap: 12,
  radius: 12,
} as const;
