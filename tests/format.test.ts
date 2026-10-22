import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { categoryLabel, formatScore, formatWhen, outcomeLabel } from "../src/format";

describe("format", () => {
  it("formats scores and empty dates", () => {
    assert.equal(formatScore(12), "12");
    assert.equal(formatScore(null), "—");
    assert.equal(formatWhen(null), "");
    assert.equal(formatWhen("not-a-date"), "");
  });

  it("uses British labels", () => {
    assert.equal(outcomeLabel("in_progress"), "In progress");
    assert.equal(outcomeLabel("partial"), "Partial");
    assert.equal(categoryLabel("status_quo"), "Status quo");
    assert.match(formatWhen(new Date("2026-10-22T15:04:00.000Z")), /2026/);
  });
});
