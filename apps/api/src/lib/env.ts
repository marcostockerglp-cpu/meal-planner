import dotenv from "dotenv";
dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? "8790"),
  allowedOrigin: process.env.ALLOWED_ORIGIN ?? "http://localhost:5173",
  openaiApiKey: required("OPENAI_API_KEY"),
  openaiModel: required("OPENAI_MODEL", "gpt-4.1-mini"),
};
