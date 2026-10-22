import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { planBuildTheatre } from "../src/future/build-theatre";
import { productToOffer } from "../src/future/catalogue";
import { draftQuote, quoteTotal } from "../src/future/pricing";

describe("later phases", () => {
  it("maps a catalogue product onto an offer", () => {
    const offer = productToOffer({ id: "site", kind: "website", name: "House site", summary: "A small site." });
    assert.equal(offer.source, "catalogue");
    assert.equal(offer.name, "House site");
  });

  it("plans an empty build and an empty quote", () => {
    assert.deepEqual(planBuildTheatre("sitting-1"), { sessionId: "sitting-1", tools: [] });
    assert.equal(quoteTotal([{ label: "Site", amountPence: 150000 }]), 150000);
    assert.equal(draftQuote([]).totalPence, 0);
  });
});
