import { requireActor } from "@/lib/actors";
import { handle, isRecord, json, readJson } from "@/lib/http";
import { createVersion, listVersions } from "@/lib/prompts";
import { parseContent, parseMessage, parsePromptKey } from "@/lib/validate";

type Params = { params: Promise<{ key: string }> };

export async function GET(request: Request, { params }: Params) {
  return handle(async () => {
    await requireActor(request);
    const { key } = await params;
    return json({ versions: await listVersions(parsePromptKey(key)) });
  });
}

export async function POST(request: Request, { params }: Params) {
  return handle(async () => {
    const actor = await requireActor(request);
    const { key } = await params;
    const body = await readJson(request);
    if (!isRecord(body)) return json({ error: "Invalid JSON" }, 400);
    const version = await createVersion(actor, parsePromptKey(key), {
      content: parseContent(body.content),
      message: parseMessage(body.message),
    });
    return json({ version }, 201);
  });
}
