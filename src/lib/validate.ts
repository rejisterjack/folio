import { HttpError } from "@/lib/http";

const PROMPT_KEY = /^[a-z][a-z0-9-]{0,63}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENVS = new Set(["development", "staging", "production"]);

export type Environment = "development" | "staging" | "production";

export function parseEmail(value: unknown): string {
  if (typeof value !== "string") throw new HttpError(400, "Email is required");
  const email = value.trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 254) throw new HttpError(400, "Enter a valid email");
  return email;
}

export function parsePassword(value: unknown): string {
  if (typeof value !== "string" || value.length < 8 || value.length > 200) {
    throw new HttpError(400, "Password must be 8 to 200 characters");
  }
  return value;
}

export function parseName(value: unknown): string {
  if (typeof value !== "string") throw new HttpError(400, "Name is required");
  const name = value.trim();
  if (name.length < 1 || name.length > 80) throw new HttpError(400, "Name must be 1 to 80 characters");
  return name;
}

export function parsePromptKey(value: unknown): string {
  if (typeof value !== "string" || !PROMPT_KEY.test(value)) {
    throw new HttpError(
      400,
      "Prompt key must start with a letter and use lowercase letters, numbers, and hyphens",
    );
  }
  return value;
}

export function parseDescription(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string" || value.length > 2000) {
    throw new HttpError(400, "Description must be 2000 characters or fewer");
  }
  return value;
}

export function parseContent(value: unknown): string {
  if (typeof value !== "string") throw new HttpError(400, "Content is required");
  if (value.length < 1 || value.length > 200_000) {
    throw new HttpError(400, "Content must be 1 to 200000 characters");
  }
  return value;
}

export function parseMessage(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string" || value.length > 500) {
    throw new HttpError(400, "Message must be 500 characters or fewer");
  }
  return value;
}

export function parseEnvironment(value: unknown): Environment {
  if (typeof value !== "string" || !ENVS.has(value)) {
    throw new HttpError(400, "Environment must be development, staging, or production");
  }
  return value as Environment;
}

export function parseVersionNumber(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    throw new HttpError(400, "Version must be a positive integer");
  }
  return value;
}

export function parseOptionalVersionNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return parseVersionNumber(value);
}

export function parseRole(value: unknown): "admin" | "member" {
  if (value === undefined || value === "member") return "member";
  if (value === "admin") return "admin";
  throw new HttpError(400, "Role must be admin or member");
}
