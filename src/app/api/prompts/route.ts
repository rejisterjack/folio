import { requireActor } from "@/lib/actors";
import { handle, isRecord, json, readJson } from "@/lib/http";
import { createPrompt, listPrompts } from "@/lib/prompts";
import { parseDescription, parseName, parsePromptKey } from "@/lib/validate";

export async function GET(request: Request) {
  return handle(async () => {
    await requireActor(request);
    return json({ prompts: await listPrompts() });
  });
}

export async function POST(request: Request) {
  return handle(async () => {
    const actor = await requireActor(request);
    const body = await readJson(request);
    if (!isRecord(body)) return json({ error: "Invalid JSON" }, 400);
    const prompt = await createPrompt(actor, {
      key: parsePromptKey(body.key),
      name: parseName(body.name),
      description: parseDescription(body.description),
    });
    return json({ prompt }, 201);
  });
}
