import { revokeApiKey } from "@/lib/api-keys";
import { requireAdmin } from "@/lib/actors";
import { handle, json } from "@/lib/http";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, { params }: Params) {
  return handle(async () => {
    const actor = await requireAdmin(request);
    const { id } = await params;
    await revokeApiKey(actor, id);
    return json({ ok: true });
  });
}
