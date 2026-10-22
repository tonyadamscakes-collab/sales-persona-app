import type { TrainingOffer } from "@/src/offer/types";

/**
 * Later phase: sell the team's own apps, websites, pages, and services.
 * Map a product through productToOffer and return it from activeOffer().
 */
export type ProductKind = "app" | "website" | "page" | "service";

export type CatalogueProduct = {
  id: string;
  kind: ProductKind;
  name: string;
  summary: string;
};

export const catalogue: readonly CatalogueProduct[] = [];

export function productToOffer(product: CatalogueProduct): TrainingOffer {
  return {
    id: product.id,
    name: product.name,
    summary: product.summary,
    trial: "to be set",
    price: "to be priced",
    source: "catalogue",
  };
}
