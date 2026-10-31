import { requireActor } from "@/lib/actors";
import { handle, isRecord, json, readJson } from "@/lib/http";
import { rollback } from "@/lib/prompts";
import {
  parseEnvironment,
  parseOptionalVersionNumber,
  parsePromptKey,
} from "@/lib/validate";

type Params = { params: Promise<{ key: string }> };

export async function POST(request: Request, { params }: Params) {
  return handle(async () => {
    const actor = await requireActor(request);
    const { key } = await params;
    const body = await readJson(request);
    if (!isRecord(body)) return json({ error: "Invalid JSON" }, 400);
    const deployment = await rollback(
      actor,
      parsePromptKey(key),
      parseEnvironment(body.env),
      parseOptionalVersionNumber(body.version),
    );
    return json({ deployment });
  });
}
