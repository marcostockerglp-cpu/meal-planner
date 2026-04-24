export type ApiGeneratedIngredient = {
  name: string;
  qty: number;
  unit: string;
  coop: string;
};

export type ApiGeneratedRecipe = {
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
  ingredients: ApiGeneratedIngredient[];
  steps: string[];
};

export type ApiMealPlanResponse = {
  recipes: ApiGeneratedRecipe[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787";

export async function requestMealPlan(input: {
  prompt: string;
  mealCount: number;
  userId?: string;
}): Promise<ApiMealPlanResponse> {
  const response = await fetch(`${API_BASE_URL}/api/meal-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Meal plan request failed");
  }

  return response.json() as Promise<ApiMealPlanResponse>;
}
