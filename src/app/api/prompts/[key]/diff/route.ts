import { requireActor } from "@/lib/actors";
import { diffLines } from "@/lib/diff";
import { handle, json } from "@/lib/http";
import { getVersion } from "@/lib/prompts";
import { parsePromptKey, parseVersionNumber } from "@/lib/validate";

type Params = { params: Promise<{ key: string }> };

export async function GET(request: Request, { params }: Params) {
  return handle(async () => {
    await requireActor(request);
    const { key: rawKey } = await params;
    const key = parsePromptKey(rawKey);
    const url = new URL(request.url);
    const from = parseVersionNumber(Number(url.searchParams.get("from")));
    const to = parseVersionNumber(Number(url.searchParams.get("to")));
    const left = await getVersion(key, from);
    const right = await getVersion(key, to);
    return json({
      from: left.version,
      to: right.version,
      lines: diffLines(left.content, right.content),
    });
  });
}
