import { requireActor } from "@/lib/actors";
import { handle, isRecord, json, readJson } from "@/lib/http";
import { deploy, getDeployments } from "@/lib/prompts";
import { parseEnvironment, parsePromptKey, parseVersionNumber } from "@/lib/validate";

type Params = { params: Promise<{ key: string }> };

export async function GET(request: Request, { params }: Params) {
  return handle(async () => {
    await requireActor(request);
    const { key } = await params;
    return json({ deployments: await getDeployments(parsePromptKey(key)) });
  });
}

export async function POST(request: Request, { params }: Params) {
  return handle(async () => {
    const actor = await requireActor(request);
    const { key } = await params;
    const body = await readJson(request);
    if (!isRecord(body)) return json({ error: "Invalid JSON" }, 400);
    const deployment = await deploy(
      actor,
      parsePromptKey(key),
      parseEnvironment(body.env),
      parseVersionNumber(body.version),
    );
    return json({ deployment }, 201);
  });
}
