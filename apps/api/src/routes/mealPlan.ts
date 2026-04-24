import { Router } from "express";
import { z } from "zod";
import { generateMealPlan } from "../lib/openai.js";

const router = Router();

const MealPlanRequestSchema = z.object({
  prompt: z.string().min(1),
  mealCount: z.number().int().min(1).max(7),
  userId: z.string().optional(),
});

router.post("/meal-plan", async (req, res) => {
  const parsed = MealPlanRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid payload",
      details: parsed.error.flatten(),
    });
  }

  try {
    const result = await generateMealPlan(parsed.data);
    return res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      error: "Meal plan generation failed",
      message,
    });
  }
});

export { router as mealPlanRouter };
