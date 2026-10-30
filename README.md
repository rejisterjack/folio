# Folio

Self-hostable prompt version control.

> Git for your prompts. Deploy them like code. Roll back in one click.

**Home:** [folio.rejisterjack.com](https://folio.rejisterjack.com) · **SDK:** `@rejisterjack/folio`

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rejisterjack/folio&env=DATABASE_URL,DIRECT_URL,AUTH_SECRET&project-name=folio&repository-name=folio)

Connect a Neon database and set `DATABASE_URL`, `DIRECT_URL`, and `AUTH_SECRET`.

## SDK

```bash
npm install @rejisterjack/folio
```

```ts
import { Folio } from "@rejisterjack/folio";

const folio = new Folio({
  baseUrl: process.env.FOLIO_URL!,
  apiKey: process.env.FOLIO_API_KEY!,
});

const prompt = await folio.get("my-prompt", { env: "production" });
```

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

## Stack

- Next.js App Router (dashboard + API)
- Prisma 8 + Neon Postgres
- TypeScript SDK in `packages/sdk`
- Tailwind CSS

## Status

Scaffold with landing page, health + prompt API stubs, Prisma contract for prompts/versions/deployments, and the npm SDK package layout.
