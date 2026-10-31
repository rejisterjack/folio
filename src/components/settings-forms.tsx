"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { callApi } from "@/components/client-api";

export function CreateKeyForm() {
  const router = useRouter();
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={async (event) => {
          event.preventDefault();
          const formElement = event.currentTarget;
          const form = new FormData(formElement);
          setError(null);
          try {
            const data = await callApi<{ key: { secret: string } }>("/api/api-keys", {
              method: "POST",
              body: JSON.stringify({ name: form.get("name") }),
            });
            setSecret(data.key.secret);
            formElement.reset();
            router.refresh();
          } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Could not create the key");
          }
        }}
      >
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Key name</span>
          <input required name="name" className="h-11 rounded-md border border-line bg-card px-3" />
        </label>
        <button type="submit" className="h-11 rounded-md bg-accent px-4 text-sm font-medium text-accent-ink">
          Create key
        </button>
      </form>
      {secret ? (
        <p className="rounded-md border border-line bg-card p-4 text-sm">
          Copy this secret now. It will not be shown again.
          <code className="mt-2 block break-all font-mono text-xs">{secret}</code>
        </p>
      ) : null}
      {error ? <p className="text-sm text-bad">{error}</p> : null}
    </div>
  );
}

export function RevokeKeyButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-sm text-bad"
      onClick={async () => {
        await callApi(`/api/api-keys/${id}`, { method: "DELETE" });
        router.refresh();
      }}
    >
      Revoke
    </button>
  );
}
