import { DAYS } from "../data";
import type { Preferences, Recipe, ShoppingDiffItem, WeekPlan } from "../types";

export const EMPTY_PLAN: WeekPlan = DAYS.reduce((acc, day) => {
  acc[day] = { selected: "" };
  return acc;
}, {} as WeekPlan);

export function scaleQty(qty: number, fromPortions: number, toPortions: number): number {
  return Number(((qty / fromPortions) * toPortions).toFixed(2));
}

export function normalizeNumber(num: number): string {
  if (Number.isInteger(num)) return String(num);
  return String(num).replace(".", ",");
}

export function buildIngredientMap(
  recipe: Recipe | null | undefined,
  people: number,
  pantryItems: Record<string, boolean>
): Record<string, { name: string; unit: string; qty: number; coop: string }> {
  if (!recipe) return {};
  const map: Record<string, { name: string; unit: string; qty: number; coop: string }> = {};
  recipe.ingredients.forEach((item) => {
    if (pantryItems[item.name]) return;
    const scaledQty = scaleQty(item.qty, recipe.portions, people);
    const key = `${item.name}__${item.unit}`;
    map[key] = { name: item.name, unit: item.unit, qty: scaledQty, coop: item.coop };
  });
  return map;
}

export function buildShoppingDiff(
  currentRecipe: Recipe | null | undefined,
  nextRecipe: Recipe | null | undefined,
  people: number,
  pantryItems: Record<string, boolean>
): ShoppingDiffItem[] {
  const currentMap = buildIngredientMap(currentRecipe, people, pantryItems);
  const nextMap = buildIngredientMap(nextRecipe, people, pantryItems);
  const keys = [...new Set([...Object.keys(currentMap), ...Object.keys(nextMap)])];
  return keys
    .map((key) => {
      const currentQty = currentMap[key]?.qty || 0;
      const nextQty = nextMap[key]?.qty || 0;
      const delta = Number((nextQty - currentQty).toFixed(2));
      if (delta === 0) return null;
      const ref = nextMap[key] || currentMap[key];
      return { key, name: ref.name, unit: ref.unit, coop: ref.coop, delta, type: delta > 0 ? "add" : "remove" } satisfies ShoppingDiffItem;
    })
    .filter((item): item is ShoppingDiffItem => Boolean(item))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

export function recipeScore(recipe: Recipe, preferences: Preferences): number {
  let score = 0;
  if (!preferences.season || recipe.season.includes(preferences.season) || recipe.season.includes("Ganzjährig")) score += 3;
  if (!preferences.mood || recipe.mood.includes(preferences.mood)) score += 3;
  if (preferences.preferCoop && recipe.coopMatch === "hoch") score += 2;
  if (preferences.category === "alle" || recipe.category === preferences.category) score += 2;
  if (recipe.time <= preferences.maxTime) score += 2;
  if (preferences.familyFriendly && recipe.mood.includes("familienfreundlich")) score += 2;
  return score;
}

export function getRankedRecipeIds(recipes: Recipe[], preferences: Preferences): string[] {
  return [...recipes]
    .map((recipe) => ({ recipe, score: recipeScore(recipe, preferences) }))
    .sort((a, b) => b.score - a.score || a.recipe.time - b.recipe.time)
    .map(({ recipe }) => recipe.id);
}

export function buildPlan(recipes: Recipe[], preferences: Preferences, mealCount: number): WeekPlan {
  const rankedIds = getRankedRecipeIds(recipes, preferences);
  const result: WeekPlan = JSON.parse(JSON.stringify(EMPTY_PLAN));
  const used = new Set<string>();
  DAYS.slice(0, mealCount).forEach((day) => {
    const id = rankedIds.find((x) => !used.has(x));
    if (id) {
      used.add(id);
      result[day] = { selected: id };
    }
  });
  return result;
}

export function replaceRecipeForDay(
  plan: WeekPlan,
  day: string,
  recipes: Recipe[],
  preferences: Preferences,
  mealCount: number
): WeekPlan {
  const activeDays = DAYS.slice(0, mealCount);
  if (!activeDays.includes(day)) return plan;
  const currentId = plan[day]?.selected || "";
  const usedByOtherDays = new Set(activeDays.filter((d) => d !== day).map((d) => plan[d]?.selected).filter(Boolean));
  const rankedIds = getRankedRecipeIds(recipes, preferences);
  const nextId = rankedIds.find((id) => id !== currentId && !usedByOtherDays.has(id));
  if (!nextId) return plan;
  return { ...plan, [day]: { selected: nextId } };
}
