import { Suspense } from "react";
import { io } from "next/cache";
import { notFound } from "next/navigation";
import { DeployControls } from "@/components/deploy-controls";
import { DiffPanel } from "@/components/diff-view";
import { NewVersionForm } from "@/components/prompt-forms";
import { HttpError } from "@/lib/http";
import { getDeployments, getPrompt, listVersions } from "@/lib/prompts";
import { listAudit } from "@/lib/audit";

export const metadata = { title: "Prompt" };

export default function PromptPage({ params }: { params: Promise<{ key: string }> }) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading prompt…</p>}>
      <PromptDetail params={params} />
    </Suspense>
  );
}

async function PromptDetail({ params }: { params: Promise<{ key: string }> }) {
  await io();
  const { key } = await params;
  const loaded = await loadPromptPage(key);
  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="font-mono text-sm text-muted">{loaded.prompt.key}</p>
        <h1 className="mt-1 text-2xl font-semibold">{loaded.prompt.name}</h1>
        {loaded.prompt.description ? (
          <p className="mt-2 max-w-xl text-sm text-muted">{loaded.prompt.description}</p>
        ) : null}
      </div>

      <section>
        <h2 className="text-lg font-semibold">Diff</h2>
        <p className="mt-1 text-sm text-muted">Compare any two versions side by side.</p>
        <div className="mt-4">
          <DiffPanel promptKey={loaded.prompt.key} versions={loaded.versions} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Deployments</h2>
        <div className="mt-4">
          <DeployControls
            promptKey={loaded.prompt.key}
            deployments={loaded.deployments}
            versions={loaded.versions}
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">New version</h2>
        <div className="mt-4">
          <NewVersionForm promptKey={loaded.prompt.key} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Version history</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
          {loaded.versions.length === 0 ? (
            <li className="py-4 text-muted">No versions yet.</li>
          ) : (
            loaded.versions.map((version) => (
              <li key={version.id} className="py-4">
                <span className="font-mono">v{version.version}</span>
                {version.message ? (
                  <span className="text-muted"> — {version.message}</span>
                ) : null}
                <time className="mt-1 block text-muted">
                  {new Date(version.createdAt).toLocaleString()}
                </time>
              </li>
            ))
          )}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Recent audit</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
          {loaded.events.length === 0 ? (
            <li className="py-4 text-muted">No changes yet.</li>
          ) : (
            loaded.events.map((event) => (
              <li key={event.id} className="flex flex-wrap justify-between gap-3 py-3">
                <span>
                  {event.action} by {event.actorEmail}
                </span>
                <time className="text-muted">{new Date(event.createdAt).toLocaleString()}</time>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

async function loadPromptPage(key: string) {
  try {
    const prompt = await getPrompt(key);
    const [versions, deployments, events] = await Promise.all([
      listVersions(key),
      getDeployments(key),
      listAudit(key, 8),
    ]);
    return { prompt, versions, deployments, events };
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) notFound();
    throw error;
  }
}
