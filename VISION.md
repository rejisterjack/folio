# Folio: Self-Hostable Prompt Version Control

Private doc for me, Rupam. Not for public. Product name: Folio. Home: folio.rejisterjack.com. SDK published as @rejisterjack/folio on npm.

## The one-line idea

A self-hostable prompt registry that gives teams version control, environment-based deployments, and one-click rollback for every prompt their agents use — deployed to Vercel and Neon in five minutes.

## The problem it solves

Prompts are the most critical part of an agent system and the least managed part. Teams store them as hardcoded strings, paste them into config files, or commit them to Git with no structure. Nobody knows which version is running in production. When something breaks, rolling back means hunting through Slack and Google Docs. When multiple people edit the same prompt, changes overwrite each other silently.

Every existing solution for this — PromptHub, Portkey, Agenta, LangSmith — is hosted SaaS. There is no self-hostable, free, and simple version. Folio is that version: a prompt registry where every change is tracked, every version is deployable, and every production incident has a one-click rollback.

## What it does

- Create named prompts and write new versions with a message describing what changed, exactly like a git commit
- Deploy any version to dev, staging, or production independently — a version in staging does not affect production until you promote it
- Roll back to any previous version in one click
- Diff any two versions side by side to see exactly what changed
- Full audit log of every change: who made it, when, and why
- TypeScript SDK with one function call: `folio.get('my-prompt', { env: 'production' })` — returns the current production prompt at runtime instead of reading a hardcoded string
- REST API so any language can fetch prompts, not just TypeScript

## Who it is for

- Teams building AI agents who have more than a handful of prompts and no systematic way to manage them
- Solo developers who want to iterate on prompts without redeploying their application every time
- AI engineers who need to know exactly which prompt version caused a production regression

## How it is used

1. Click the Deploy to Vercel button and connect a Neon database — the service is live in five minutes
2. Open the dashboard, create a prompt, and write the first version
3. Install the SDK: `npm install @rejisterjack/folio`
4. Replace the hardcoded prompt string in your agent with `folio.get('prompt-name')`
5. Iterate on the prompt from the dashboard with no code changes or redeployments — promote a version to production when it is ready

## How I portray it

- One-line pitch: "Git for your prompts. Deploy them like code. Roll back in one click."
- Lead with the demo: show a prompt change going wrong in production, then a one-click rollback fixing it in seconds
- Show the diff view because it is the most visually compelling feature
- Position it as the missing piece between writing prompts and managing them at scale

## How it runs

- Deployed on Vercel as a Next.js full-stack app, free on the Hobby plan
- Postgres on Neon, free tier, serverless
- SDK installed into the developer's own agent via npm
- SDK calls the deployed Folio API at runtime to fetch the current prompt — no prompts hardcoded anywhere
- No separate backend process; Next.js API routes handle everything

## Tech stack

- Next.js App Router for the dashboard and API
- Neon for Postgres
- Prisma as the ORM
- TypeScript SDK published as @rejisterjack/folio on npm
- Tailwind CSS for the dashboard, with a clean diff view as the centrepiece

## What done looks like

- Working Deploy to Vercel button that lands in a running registry in under five minutes
- Create a prompt, write two versions, deploy v1 to production, deploy v2 to staging — all working end to end
- SDK fetching the correct version per environment at runtime
- Diff view showing exactly what changed between two versions
- Audit log showing every change with author, timestamp, and message
- One-click rollback working in the dashboard
- Clean README with the deploy button and a one-line SDK example front and centre
- Repo at github.com/rejisterjack/folio

## Honest notes

- This is a crowded space in the hosted SaaS world; the self-hosted angle is the entire differentiator
- Prompt fetching adds a network call on every agent run; document how to cache the response locally to avoid latency
- Neon sleeps on the free tier, so the first fetch after idle time is slow; mitigate with a simple in-memory cache in the SDK
- The diff view is the most important UI feature; invest time in making it genuinely readable

## Deployment

- Vercel for the Next.js app and API, free on Hobby plan
- Neon for Postgres, free tier
- npm for the TypeScript SDK (@rejisterjack/folio)
- No Railway needed
