import crypto from "node:crypto";

export function buildSafetyIdentifier(userId?: string): string | undefined {
  if (!userId) return undefined;
  return crypto.createHash("sha256").update(userId).digest("hex");
}
