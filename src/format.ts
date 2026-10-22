const CATEGORY_LABELS: Record<string, string> = {
  price: "Price",
  time: "Time",
  trust: "Trust",
  competition: "Competition",
  status_quo: "Status quo",
  need: "Need",
  authority: "Authority",
  risk: "Risk",
};

const PHASE_LABELS: Record<string, string> = {
  opening: "Opening",
  probing: "Probing",
  escalated: "Escalated",
  softening: "Softening",
  closing: "Closing signal",
  closed: "Closed",
};

const OUTCOME_LABELS: Record<string, string> = {
  in_progress: "In progress",
  won: "Won",
  lost: "Lost",
  partial: "Partial",
};

export function formatWhen(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function formatScore(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return String(value);
}

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function phaseLabel(phase: string): string {
  return PHASE_LABELS[phase] ?? phase;
}

export function outcomeLabel(outcome: string): string {
  return OUTCOME_LABELS[outcome] ?? outcome.replaceAll("_", " ");
}
