import type { TrainingOffer } from "@/src/offer/types";

/** The offer the live trainer scores against. Later products replace this. */
export const counterlineOffer: TrainingOffer = {
  id: "counterline",
  name: "Counterline",
  summary:
    "A lightweight operations service for independent venues. It tightens the busiest hour, cuts one measurable cost, and can be trialled for two weeks with no lock-in.",
  trial: "a two-week trial",
  price: "a weekly fee you can cancel any week",
  source: "counterline",
};
