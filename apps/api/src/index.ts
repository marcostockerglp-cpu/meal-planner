import express from "express";
import cors from "cors";
import { env } from "./lib/env.js";
import { mealPlanRouter } from "./routes/mealPlan.js";

const app = express();

const allowedOrigins = env.allowedOrigin.split(",").map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server requests (no origin) and listed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed`));
      }
    },
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
