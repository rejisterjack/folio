"use client";

import { useEffect, useState } from "react";
import { callApi } from "@/components/client-api";
import type { DiffLine } from "@/lib/diff";

type Version = { version: number };

export function DiffPanel({
  promptKey,
  versions,
}: {
  promptKey: string;
  versions: Version[];
}) {
  const sorted = [...versions].sort((a, b) => a.version - b.version);
  const [from, setFrom] = useState(sorted[0]?.version ?? 1);
  const [to, setTo] = useState(sorted[sorted.length - 1]?.version ?? 1);
  const [lines, setLines] = useState<DiffLine[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sorted.length < 2) return;
    let cancelled = false;
    setError(null);
    callApi<{ lines: DiffLine[] }>(
      `/api/prompts/${encodeURIComponent(promptKey)}/diff?from=${from}&to=${to}`,
    )
      .then((data) => {
        if (!cancelled) setLines(data.lines);
      })
      .catch((caught: unknown) => {
        if (!cancelled) {
          setLines(null);
          setError(caught instanceof Error ? caught.message : "Diff failed");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [promptKey, from, to, sorted.length]);

  if (sorted.length < 2) {
    return <p className="text-sm text-muted">Write at least two versions to compare them.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">From</span>
          <select
            value={from}
            onChange={(e) => setFrom(Number(e.target.value))}
            className="h-11 rounded-md border border-line bg-card px-3"
          >
            {sorted.map((v) => (
              <option key={v.version} value={v.version}>
                v{v.version}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">To</span>
          <select
            value={to}
            onChange={(e) => setTo(Number(e.target.value))}
            className="h-11 rounded-md border border-line bg-card px-3"
          >
            {sorted.map((v) => (
              <option key={v.version} value={v.version}>
                v{v.version}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error ? <p className="text-sm text-bad">{error}</p> : null}
      {lines ? (
        <div className="overflow-x-auto rounded-md border border-line bg-card font-mono text-xs leading-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="w-10 px-2 py-1">#</th>
                <th className="w-1/2 px-2 py-1">v{from}</th>
                <th className="w-10 px-2 py-1">#</th>
                <th className="w-1/2 px-2 py-1">v{to}</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => (
                <tr
                  key={index}
                  className={
                    line.type === "add"
                      ? "bg-diff-add"
                      : line.type === "remove"
                        ? "bg-diff-remove"
                        : undefined
                  }
                >
                  <td className="px-2 text-muted">{line.leftNo ?? ""}</td>
                  <td className="whitespace-pre-wrap px-2">{line.left ?? ""}</td>
                  <td className="px-2 text-muted">{line.rightNo ?? ""}</td>
                  <td className="whitespace-pre-wrap px-2">{line.right ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted">Loading diff…</p>
      )}
    </div>
  );
}
