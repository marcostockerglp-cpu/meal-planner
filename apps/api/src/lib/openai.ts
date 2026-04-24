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

function extractText(response: any): string {
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const content = response.output?.flatMap((item: any) => item.content ?? []) ?? [];
  const texts = content
    .filter((c: any) => c.type === "output_text" || c.type === "text")
    .map((c: any) => c.text ?? c.value ?? "")
    .join("")
    .trim();

  return texts;
}

function stripCodeFence(value: string): string {
  return value.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
}

export async function generateMealPlan(input: { prompt: string; mealCount: number; userId?: string }): Promise<MealPlanResponse> {
  if (!env.openaiApiKey) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  const client = new OpenAI({ apiKey: env.openaiApiKey });

  const response = await client.responses.create({
    model: env.openaiModel,
    input: buildMealPlanPrompt({ prompt: input.prompt, mealCount: input.mealCount }),
    temperature: 0.7,
    max_output_tokens: 4000,
  });

  const rawText = stripCodeFence(extractText(response));
  const parsed = JSON.parse(rawText);
  return MealPlanSchema.parse(parsed);
}
