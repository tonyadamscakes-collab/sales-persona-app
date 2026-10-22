import { counterlineOffer } from "@/src/offer/counterline";
import type { TrainingOffer } from "@/src/offer/types";

/**
 * Screens read the offer from here.
 * A later catalogue product can be returned instead without changing the sitting flow.
 */
export function activeOffer(): TrainingOffer {
  return counterlineOffer;
}
