type Params = { params: Promise<{ key: string }> };

/**
 * Runtime prompt fetch for the SDK.
 * Wired to Prisma once DATABASE_URL is configured and migrations have run.
 */
export async function GET(request: Request, { params }: Params) {
  const { key } = await params;
  const env = new URL(request.url).searchParams.get("env") ?? "production";

  // Scaffold response until the registry is connected to Postgres.
  return Response.json(
    {
      key,
      env,
      content: `<!-- folio scaffold: configure DATABASE_URL and create prompt "${key}" -->`,
      version: 0,
      scaffold: true,
    },
    { status: 200 },
  );
}
