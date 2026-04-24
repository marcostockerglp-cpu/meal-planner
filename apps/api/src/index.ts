import express from "express";
import cors from "cors";
import { env } from "./lib/env.js";
import { mealPlanRouter } from "./routes/mealPlan.js";

const app = express();

app.use(
  cors({
    origin: env.allowedOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "meal-planner-api" });
});

app.use("/api", mealPlanRouter);

app.listen(env.port, () => {
  console.log(`Meal Planner API listening on http://localhost:${env.port}`);
});
