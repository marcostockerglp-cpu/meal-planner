export type GeneratedIngredient = {
  name: string;
  qty: number;
  unit: string;
  coop: string;
};

export type GeneratedRecipe = {
  id: string;
  title: string;
  source: string;
  season: string[];
  mood: string[];
  time: number;
  category: "vegetarisch" | "fleisch" | "fisch";
  portions: number;
  coopMatch: "hoch" | "mittel";
  description: string;
  ingredients: GeneratedIngredient[];
  steps: string[];
};

export type MealPlanResponse = {
  recipes: GeneratedRecipe[];
};
