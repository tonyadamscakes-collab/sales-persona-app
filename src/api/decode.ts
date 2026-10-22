import { deserialize } from "superjson";

export class TrainerApiError extends Error {
  readonly code: string | undefined;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "TrainerApiError";
    this.code = code;
  }
}

type ErrorBody = {
  message?: string;
  data?: { code?: string };
};

type Envelope = {
  result?: { data?: { json?: unknown; meta?: unknown } };
  error?: { json?: ErrorBody; message?: string };
};

export function decodeTrpc<T>(payload: unknown): T {
  if (!payload || typeof payload !== "object") {
    throw new TrainerApiError("The trainer returned an empty response.");
  }

  const body = payload as Envelope;
  if (body.error) {
    const details = body.error.json;
    throw new TrainerApiError(
      details?.message ?? body.error.message ?? "The trainer could not complete that.",
      details?.data?.code,
    );
  }

  const data = body.result?.data;
  if (!data || !("json" in data)) {
    throw new TrainerApiError("The trainer returned a response we could not read.");
  }

  return deserialize({
    json: data.json,
    meta: data.meta,
  } as Parameters<typeof deserialize>[0]) as T;
}
