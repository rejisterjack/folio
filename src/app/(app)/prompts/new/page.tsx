import { CreatePromptForm } from "@/components/prompt-forms";

export const metadata = { title: "New prompt" };

export default function NewPromptPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">New prompt</h1>
      <p className="mt-2 text-sm text-muted">
        Keys are stable identifiers used by the SDK at runtime.
      </p>
      <div className="mt-8">
        <CreatePromptForm />
      </div>
    </div>
  );
}
