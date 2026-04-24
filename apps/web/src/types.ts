import type { LucideIcon } from "lucide-react";

export type Category = "vegetarisch" | "fleisch" | "fisch";

export type Ingredient = {
  name: string;
  qty: number;
  unit: string;
  coop: string;
};

export type Recipe = {
  id: string;
  title: string;
  source: string;
  season: string[];
  mood: string[];
  time: number;
  category: Category;
  portions: number;
  coopMatch: "hoch" | "mittel";
  icon: LucideIcon;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
};

export type DayPlan = {
  selected: string;
};

export type WeekPlan = Record<string, DayPlan>;

export type Preferences = {
  season: string;
  mood: string;
  category: "alle" | Category;
  maxTime: number;
  preferCoop: boolean;
  familyFriendly: boolean;
  variety: boolean;
};

export type ShoppingDiffItem = {
  key: string;
  name: string;
  unit: string;
  coop: string;
  delta: number;
  type: "add" | "remove";
};
