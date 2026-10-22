import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { decodeTrpc, TrainerApiError } from "../src/api/decode";

describe("decodeTrpc", () => {
  it("unwraps a superjson date", () => {
    const value = decodeTrpc<{ startedAt: Date }>({
      result: {
        data: {
          json: { startedAt: "2026-10-22T12:00:00.000Z" },
          meta: { values: { startedAt: ["Date"] }, v: 1 },
        },
      },
    });
    assert.ok(value.startedAt instanceof Date);
    assert.equal(value.startedAt.toISOString(), "2026-10-22T12:00:00.000Z");
  });

  it("raises the server message", () => {
    assert.throws(
      () =>
        decodeTrpc({
          error: { json: { message: "Enter the name you want on the board.", data: { code: "BAD_REQUEST" } } },
        }),
      (error: unknown) => {
        if (!(error instanceof TrainerApiError)) return false;
        assert.equal(error.message, "Enter the name you want on the board.");
        assert.equal(error.code, "BAD_REQUEST");
        return true;
      },
    );
  });
});
