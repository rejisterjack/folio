import { db } from "@/prisma/db";
import type { Actor } from "@/lib/actors";
import { recordAudit } from "@/lib/audit";
import { HttpError, isUniqueViolation } from "@/lib/http";
import type { Environment } from "@/lib/validate";

export type PromptSummary = {
  id: string;
  key: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type PromptVersionRow = {
  id: string;
  version: number;
  content: string;
  message: string;
  authorId: string | null;
  createdAt: string;
};

export type DeploymentRow = {
  id: string;
  env: Environment;
  versionId: string;
  version: number;
  createdAt: string;
};

async function requirePrompt(key: string) {
  const prompt = await db.orm.public.Prompt.whereUnique({ key }).first();
  if (!prompt) throw new HttpError(404, "Prompt not found");
  return prompt;
}

export async function listPrompts(): Promise<PromptSummary[]> {
  const rows = await db.orm.public.Prompt.orderBy((p) => p.key.asc()).all();
  return rows.map((row) => ({
    id: row.id,
    key: row.key,
    name: row.name,
    description: row.description,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));
}

export async function getPrompt(key: string): Promise<PromptSummary> {
  const prompt = await requirePrompt(key);
  return {
    id: prompt.id,
    key: prompt.key,
    name: prompt.name,
    description: prompt.description,
    createdAt: prompt.createdAt,
    updatedAt: prompt.updatedAt,
  };
}

export async function createPrompt(
  actor: Actor,
  input: { key: string; name: string; description: string },
): Promise<PromptSummary> {
  try {
    const prompt = await db.orm.public.Prompt.create({
      key: input.key,
      name: input.name,
      description: input.description,
    });
    await recordAudit({
      actor,
      action: "prompt.created",
      promptKey: prompt.key,
      after: { key: prompt.key, name: prompt.name, description: prompt.description },
    });
    return {
      id: prompt.id,
      key: prompt.key,
      name: prompt.name,
      description: prompt.description,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
    };
  } catch (error) {
    if (isUniqueViolation(error)) throw new HttpError(409, "Prompt key already exists");
    throw error;
  }
}

export async function listVersions(key: string): Promise<PromptVersionRow[]> {
  const prompt = await requirePrompt(key);
  const rows = await db.orm.public.PromptVersion.where({ promptId: prompt.id })
    .orderBy((v) => v.version.desc())
    .all();
  return rows.map((row) => ({
    id: row.id,
    version: row.version,
    content: row.content,
    message: row.message,
    authorId: row.authorId,
    createdAt: row.createdAt,
  }));
}

export async function getVersion(key: string, version: number): Promise<PromptVersionRow> {
  const prompt = await requirePrompt(key);
  const row = await db.orm.public.PromptVersion.where({
    promptId: prompt.id,
    version,
  }).first();
  if (!row) throw new HttpError(404, "Version not found");
  return {
    id: row.id,
    version: row.version,
    content: row.content,
    message: row.message,
    authorId: row.authorId,
    createdAt: row.createdAt,
  };
}

export async function createVersion(
  actor: Actor,
  key: string,
  input: { content: string; message: string },
): Promise<PromptVersionRow> {
  const prompt = await requirePrompt(key);
  const latest = await db.orm.public.PromptVersion.where({ promptId: prompt.id })
    .orderBy((v) => v.version.desc())
    .first();
  const next = (latest?.version ?? 0) + 1;
  const row = await db.orm.public.PromptVersion.create({
    promptId: prompt.id,
    version: next,
    content: input.content,
    message: input.message,
    authorId: actor.id,
  });
  await recordAudit({
    actor,
    action: "prompt.version_created",
    promptKey: key,
    after: { version: row.version, message: row.message },
  });
  return {
    id: row.id,
    version: row.version,
    content: row.content,
    message: row.message,
    authorId: row.authorId,
    createdAt: row.createdAt,
  };
}

export async function getDeployments(key: string): Promise<DeploymentRow[]> {
  const prompt = await requirePrompt(key);
  const rows = await db.orm.public.PromptDeployment.where({ promptId: prompt.id })
    .include("version")
    .all();
  return rows.map((row) => ({
    id: row.id,
    env: row.env as Environment,
    versionId: row.versionId,
    version: row.version.version,
    createdAt: row.createdAt,
  }));
}

export async function deploy(
  actor: Actor,
  key: string,
  env: Environment,
  versionNumber: number,
): Promise<DeploymentRow> {
  const prompt = await requirePrompt(key);
  const version = await db.orm.public.PromptVersion.where({
    promptId: prompt.id,
    version: versionNumber,
  }).first();
  if (!version) throw new HttpError(404, "Version not found");

  const existing = await db.orm.public.PromptDeployment.where({
    promptId: prompt.id,
    env,
  })
    .include("version")
    .first();

  const before = existing
    ? { env, version: existing.version.version }
    : null;

  const row = existing
    ? await db.orm.public.PromptDeployment.whereUnique({ id: existing.id }).update({
        versionId: version.id,
      })
    : await db.orm.public.PromptDeployment.create({
        promptId: prompt.id,
        versionId: version.id,
        env,
      });
  if (!row) throw new HttpError(500, "Failed to save deployment");

  await recordAudit({
    actor,
    action: "prompt.deployed",
    promptKey: key,
    before,
    after: { env, version: version.version },
  });

  return {
    id: row.id,
    env,
    versionId: version.id,
    version: version.version,
    createdAt: row.createdAt,
  };
}

export async function rollback(
  actor: Actor,
  key: string,
  env: Environment,
  toVersion?: number,
): Promise<DeploymentRow> {
  const prompt = await requirePrompt(key);
  const current = await db.orm.public.PromptDeployment.where({
    promptId: prompt.id,
    env,
  })
    .include("version")
    .first();
  if (!current) throw new HttpError(404, "No deployment for this environment");

  const targetNumber =
    toVersion ?? (current.version.version > 1 ? current.version.version - 1 : null);
  if (targetNumber == null) {
    throw new HttpError(400, "Nothing to roll back to");
  }
  if (targetNumber === current.version.version) {
    throw new HttpError(400, "Already on that version");
  }

  return deploy(actor, key, env, targetNumber);
}

export async function getDeployedContent(
  key: string,
  env: Environment,
): Promise<{ key: string; env: Environment; content: string; version: number }> {
  const prompt = await db.orm.public.Prompt.whereUnique({ key }).first();
  if (!prompt) throw new HttpError(404, "Prompt not found");
  const deployment = await db.orm.public.PromptDeployment.where({
    promptId: prompt.id,
    env,
  })
    .include("version")
    .first();
  if (!deployment) throw new HttpError(404, "No deployment for this environment");
  return {
    key,
    env,
    content: deployment.version.content,
    version: deployment.version.version,
  };
}
