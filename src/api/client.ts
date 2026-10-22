import { serialize } from "superjson";
import { decodeTrpc, TrainerApiError } from "@/src/api/decode";
import type { AnalyticsInput, AnalyticsReport, Persona, PresentedSession } from "@/src/api/types";
import type { Difficulty } from "@/src/domain";

const DEFAULT_BASE_URL = "https://sales-persona.vercel.app";

export function apiBaseUrl(envValue = readBaseUrl()): string {
  const raw = envValue.trim() || DEFAULT_BASE_URL;
  return raw.replace(/\/+$/, "");
}

export function procedureUrl(base: string, procedure: string, input?: unknown): string {
  const url = new URL(`${base}/api/trpc/${procedure}`);
  if (input !== undefined) {
    url.searchParams.set("input", JSON.stringify(serialize(input)));
  }
  return url.toString();
}

export function mutationBody(input: unknown): string {
  return JSON.stringify(serialize(input));
}

async function call<T>(procedure: string, method: "GET" | "POST", input?: unknown): Promise<T> {
  const base = apiBaseUrl();
  let response: Response;
  try {
    response = await fetch(procedureUrl(base, procedure, method === "GET" ? input : undefined), {
      method,
      headers: {
        accept: "application/json",
        ...(method === "POST" ? { "content-type": "application/json" } : {}),
      },
      body: method === "POST" ? mutationBody(input) : undefined,
    });
  } catch {
    throw new TrainerApiError("Could not reach the trainer. Check the connection and try again.");
  }

  const text = await response.text();
  let payload: unknown;
  try {
    payload = JSON.parse(text) as unknown;
  } catch {
    throw new TrainerApiError("The trainer returned a response we could not read.");
  }
  return decodeTrpc<T>(payload);
}

export const trainerApi = {
  listPersonas: () => call<Persona[]>("listPersonas", "GET"),
  createSession: (input: { personaId: string; userName: string; difficulty: Difficulty }) =>
    call<PresentedSession>("createSession", "POST", input),
  fetchSession: (id: string) => call<PresentedSession>("fetchSession", "GET", { id }),
  sendMessage: (input: { sessionId: string; content: string }) =>
    call<PresentedSession>("sendMessage", "POST", input),
  resetSession: (id: string) => call<PresentedSession>("resetSession", "POST", { id }),
  analytics: (input: AnalyticsInput = {}) => call<AnalyticsReport>("analytics", "GET", input),
};

function readBaseUrl(): string {
  const env = process.env as { EXPO_PUBLIC_API_BASE_URL?: string };
  return env.EXPO_PUBLIC_API_BASE_URL ?? "";
}
