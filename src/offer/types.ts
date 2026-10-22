export type TrainingOffer = {
  id: string;
  name: string;
  summary: string;
  trial: string;
  price: string;
  source: "counterline" | "catalogue";
};
