"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { callApi } from "@/components/client-api";

const ENVS = ["development", "staging", "production"] as const;

type Deployment = { env: string; version: number };
type Version = { version: number; message: string };

export function DeployControls({
  promptKey,
  deployments,
  versions,
}: {
  promptKey: string;
  deployments: Deployment[];
  versions: Version[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(versions[0]?.version ?? 1);
  const byEnv = new Map(deployments.map((d) => [d.env, d.version]));

  async function deploy(env: string) {
    setError(null);
    try {
      await callApi(`/api/prompts/${encodeURIComponent(promptKey)}/deployments`, {
        method: "POST",
        body: JSON.stringify({ env, version }),
      });
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Deploy failed");
    }
  }

  async function rollback(env: string) {
    setError(null);
    try {
      await callApi(`/api/prompts/${encodeURIComponent(promptKey)}/rollback`, {
        method: "POST",
        body: JSON.stringify({ env }),
      });
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Rollback failed");
    }
  }

  if (versions.length === 0) {
    return <p className="text-sm text-muted">Create a version before deploying.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm sm:max-w-xs">
        <span className="font-medium">Version to deploy</span>
        <select
          value={version}
          onChange={(event) => setVersion(Number(event.target.value))}
          className="h-11 rounded-md border border-line bg-card px-3"
        >
          {versions.map((v) => (
            <option key={v.version} value={v.version}>
              v{v.version}
              {v.message ? ` — ${v.message}` : ""}
            </option>
          ))}
        </select>
      </label>
      <ul className="divide-y divide-line border-y border-line text-sm">
        {ENVS.map((env) => (
          <li key={env} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <span>
              <span className="font-medium capitalize">{env}</span>
              <span className="ml-3 text-muted">
                {byEnv.has(env) ? `v${byEnv.get(env)}` : "not deployed"}
              </span>
            </span>
            <span className="flex gap-3">
              <button
                type="button"
                className="rounded-md bg-accent px-3 py-2 text-accent-ink"
                onClick={() => deploy(env)}
              >
                Deploy v{version}
              </button>
              {byEnv.has(env) ? (
                <button
                  type="button"
                  className="rounded-md border border-line px-3 py-2"
                  onClick={() => rollback(env)}
                >
                  Roll back
                </button>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
      {error ? <p className="text-sm text-bad">{error}</p> : null}
    </div>
  );
}
