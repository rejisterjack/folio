import { requireActor } from "@/lib/actors";
import { listAudit } from "@/lib/audit";
import { handle, json } from "@/lib/http";

export async function GET(request: Request) {
  return handle(async () => {
    await requireActor(request);
    const prompt = new URL(request.url).searchParams.get("prompt")?.trim() || undefined;
    return json({ events: await listAudit(prompt) });
  });
}
