import OpenAI from "openai";
import { z } from "zod";
import { env } from "./env.js";
import { buildMealPlanPrompt } from "./prompt.js";
import type { MealPlanResponse } from "../types.js";

const MealPlanSchema = z.object({
  recipes: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      source: z.string(),
      season: z.array(z.string()),
      mood: z.array(z.string()),
      time: z.number(),
      category: z.enum(["vegetarisch", "fleisch", "fisch"]),
      portions: z.number(),
      coopMatch: z.enum(["hoch", "mittel"]),
      description: z.string(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          qty: z.number(),
          unit: z.string(),
          coop: z.string(),
        })
      ),
      steps: z.array(z.string()).min(2),
    })
  ),
});

function stripCodeFence(value: string): string {
  return value.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
}

export async function generateMealPlan(input: { prompt: string; mealCount: number; userId?: string }): Promise<MealPlanResponse> {
  if (!env.openaiApiKey) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  const client = new OpenAI({ apiKey: env.openaiApiKey });

  const response = await client.chat.completions.create({
    model: env.openaiModel,
    messages: [
      { role: "user", content: buildMealPlanPrompt({ prompt: input.prompt, mealCount: input.mealCount }) },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const rawText = stripCodeFence(response.choices[0]?.message?.content ?? "");
  const parsed = JSON.parse(rawText);
  return MealPlanSchema.parse(parsed);
}
