"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { callApi } from "@/components/client-api";

export function CreatePromptForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="flex max-w-lg flex-col gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setPending(true);
        setError(null);
        try {
          const data = await callApi<{ prompt: { key: string } }>("/api/prompts", {
            method: "POST",
            body: JSON.stringify({
              key: form.get("key"),
              name: form.get("name"),
              description: form.get("description") || "",
            }),
          });
          router.push(`/prompts/${data.prompt.key}`);
          router.refresh();
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "Could not create prompt");
          setPending(false);
        }
      }}
    >
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Key</span>
        <input
          required
          name="key"
          placeholder="my-prompt"
          className="h-11 rounded-md border border-line bg-card px-3 font-mono text-sm"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Name</span>
        <input required name="name" className="h-11 rounded-md border border-line bg-card px-3" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Description</span>
        <textarea name="description" rows={3} className="rounded-md border border-line bg-card px-3 py-2" />
      </label>
      {error ? <p className="text-sm text-bad">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-md bg-accent px-4 text-sm font-medium text-accent-ink disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create prompt"}
      </button>
    </form>
  );
}

export function NewVersionForm({ promptKey }: { promptKey: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        setPending(true);
        setError(null);
        try {
          await callApi(`/api/prompts/${encodeURIComponent(promptKey)}/versions`, {
            method: "POST",
            body: JSON.stringify({
              content: form.get("content"),
              message: form.get("message") || "",
            }),
          });
          formElement.reset();
          router.refresh();
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "Could not create version");
        } finally {
          setPending(false);
        }
      }}
    >
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Message</span>
        <input
          name="message"
          placeholder="What changed"
          className="h-11 rounded-md border border-line bg-card px-3"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Content</span>
        <textarea
          required
          name="content"
          rows={10}
          className="rounded-md border border-line bg-card px-3 py-2 font-mono text-sm"
        />
      </label>
      {error ? <p className="text-sm text-bad">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-11 self-start rounded-md bg-accent px-4 text-sm font-medium text-accent-ink disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save version"}
      </button>
    </form>
  );
}
