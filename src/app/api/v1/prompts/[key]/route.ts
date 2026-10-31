import { requireApiKey } from "@/lib/actors";
import { handle, json } from "@/lib/http";
import { getDeployedContent } from "@/lib/prompts";
import { parseEnvironment, parsePromptKey } from "@/lib/validate";

type Params = { params: Promise<{ key: string }> };

export async function GET(request: Request, { params }: Params) {
  return handle(async () => {
    await requireApiKey(request);
    const { key } = await params;
    const envParam = new URL(request.url).searchParams.get("env") ?? "production";
    const payload = await getDeployedContent(parsePromptKey(key), parseEnvironment(envParam));
    return json(payload);
  });
}
