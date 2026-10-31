import { Suspense } from "react";
import Link from "next/link";
import { io } from "next/cache";
import { listPrompts } from "@/lib/prompts";

export const metadata = { title: "Prompts" };

export default function PromptsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading prompts…</p>}>
      <PromptList />
    </Suspense>
  );
}

async function PromptList() {
  await io();
  const prompts = await listPrompts();
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Prompts</h1>
        <Link
          href="/prompts/new"
          className="h-10 rounded-md bg-accent px-4 text-sm font-medium leading-10 text-accent-ink"
        >
          New prompt
        </Link>
      </div>
      {prompts.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          No prompts yet. Create one and fetch it from the SDK.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {prompts.map((prompt) => (
            <li key={prompt.key}>
              <Link
                href={`/prompts/${prompt.key}`}
                className="flex items-center justify-between gap-4 py-4"
              >
                <span>
                  <span className="font-mono text-sm">{prompt.key}</span>
                  <span className="mt-1 block text-sm text-muted">{prompt.name}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
