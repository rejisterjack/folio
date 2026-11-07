const snippet = `import { Folio } from "@rejisterjack/folio";

const folio = new Folio({
  baseUrl: process.env.FOLIO_URL!,
  apiKey: process.env.FOLIO_API_KEY!,
});

const prompt = await folio.get("my-prompt", { env: "production" });`;

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16">
      <header className="flex items-center justify-between">
        <p className="text-sm font-semibold tracking-[0.18em]">FOLIO</p>
        <a
          className="text-sm font-medium"
          href="https://github.com/rejisterjack/folio"
        >
          GitHub
        </a>
      </header>
      <main className="mt-20 flex flex-col gap-8">
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight">
          Git for your prompts. Deploy them like code. Roll back in one click.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-muted">
          A self-hostable prompt registry with version history, environment
          deployments, and a TypeScript SDK — on Vercel and Neon in minutes.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-ink"
            href="https://vercel.com/new/clone?repository-url=https://github.com/rejisterjack/folio&env=DATABASE_URL,DIRECT_URL,AUTH_SECRET&project-name=folio&repository-name=folio"
          >
            Deploy to Vercel
          </a>
          <a
            href="/login"
            className="inline-flex h-11 items-center rounded-md border border-line px-4 text-sm font-medium"
          >
            Open dashboard
          </a>
          <a
            href="/api/health"
            className="inline-flex h-11 items-center rounded-md border border-line px-4 text-sm font-medium"
          >
            Health check
          </a>
        </div>
        <pre className="overflow-x-auto rounded-md border border-line bg-card p-4 text-sm leading-6">
          <code>{snippet}</code>
        </pre>
      </main>
    </div>
  );
}
