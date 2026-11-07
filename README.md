# Folio

Self-hostable prompt version control.

> Git for your prompts. Deploy them like code. Roll back in one click.

**Home:** [folio.rejisterjack.com](https://folio.rejisterjack.com) · **SDK:** [`@rejisterjack/folio`](https://www.npmjs.com/package/@rejisterjack/folio)

The reference deployment is https://folio.rejisterjack.com. That instance is private: sign in with your own admin account, and do not put production API keys from other apps into a shared demo. Self-host with the Deploy button below.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rejisterjack/folio&env=DATABASE_URL,DIRECT_URL,AUTH_SECRET&project-name=folio&repository-name=folio)

Connect a Neon database and set `DATABASE_URL`, `DIRECT_URL`, and `AUTH_SECRET`. After deploy, open `/setup` to create the first admin.

## SDK

```bash
npm install @rejisterjack/folio
```

```ts
import { Folio } from "@rejisterjack/folio";

const folio = new Folio({
  baseUrl: process.env.FOLIO_URL!,
  apiKey: process.env.FOLIO_API_KEY!,
  // Reuse fetched prompts for 60s by default (set 0 to disable).
  // Helps absorb Neon cold starts and cuts per-request latency in agents.
  cacheTtlMs: 60_000,
});

const prompt = await folio.get("my-prompt", { env: "production" });
// string content for compat

const { content, version, env } = await folio.getPrompt("my-prompt", {
  env: "production",
});
```

`get()` returns the prompt string. `getPrompt()` returns `{ content, version, env }` when you need metadata.

Keep the API key on the server. Do not ship it to a browser.

### Caching

Every `get` is a network call. The client caches content in memory for `cacheTtlMs` (default 60 seconds). Raise the TTL for high-traffic agents, or set `0` when you need immediate promotion visibility.

### Any language (REST)

```bash
curl -sS -H "Authorization: Bearer $FOLIO_API_KEY" \
  "$FOLIO_URL/api/v1/prompts/my-prompt?env=production"
```

Returns `{ "key", "env", "content", "version" }`.

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

Open `/setup`, create an API key under Settings, create a prompt, write versions, and deploy to an environment before calling the SDK.

```bash
npm run sdk:build
```

## Stack

- Next.js App Router (dashboard + API)
- Prisma 8 + Neon Postgres
- TypeScript SDK in `packages/sdk`
- Tailwind CSS

## Status

Working prompt registry: versions, per-environment deploys, one-click rollback, side-by-side diff, audit log, admin/member team roles, Bearer-authenticated runtime fetch, and `@rejisterjack/folio` SDK with `get` / `getPrompt` and in-memory caching.
