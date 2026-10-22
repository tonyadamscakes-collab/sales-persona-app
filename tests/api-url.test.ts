import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { apiBaseUrl, mutationBody, procedureUrl } from "../src/api/client";

describe("api urls", () => {
  it("defaults to the live trainer and strips a trailing slash", () => {
    assert.equal(apiBaseUrl(""), "https://sales-persona.vercel.app");
    assert.equal(apiBaseUrl("https://example.test/"), "https://example.test");
  });

  it("omits input on a bare query and serialises mutations", () => {
    assert.equal(
      procedureUrl("https://sales-persona.vercel.app", "listPersonas"),
      "https://sales-persona.vercel.app/api/trpc/listPersonas",
    );
    assert.equal(
      mutationBody({ personaId: "pub", userName: "Ada", difficulty: "easy" }),
      JSON.stringify({ json: { personaId: "pub", userName: "Ada", difficulty: "easy" } }),
    );
  });
});
