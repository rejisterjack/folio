export type FolioEnvironment = "development" | "staging" | "production";

export type FolioOptions = {
  baseUrl: string;
  apiKey: string;
  /** Milliseconds to reuse a fetched prompt. Defaults to 60_000. */
  cacheTtlMs?: number;
  fetch?: typeof fetch;
};

type CacheEntry = {
  content: string;
  version: number;
  expiresAt: number;
};

/**
 * Server-side client. Do not ship the API key to a browser.
 * Fetches the prompt currently deployed to the requested environment.
 */
export class Folio {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly cacheTtlMs: number;
  private readonly fetchImpl: typeof fetch;
  private readonly cache = new Map<string, CacheEntry>();

  constructor(options: FolioOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.apiKey = options.apiKey;
    this.cacheTtlMs = options.cacheTtlMs ?? 60_000;
    this.fetchImpl = options.fetch ?? globalThis.fetch;
  }

  async get(
    prompt: string,
    options?: { env?: FolioEnvironment },
  ): Promise<string> {
    const env = options?.env ?? "production";
    const cacheKey = `${prompt}\n${env}`;
    if (this.cacheTtlMs > 0) {
      const hit = this.cache.get(cacheKey);
      if (hit && hit.expiresAt > Date.now()) return hit.content;
    }

    const url = new URL(`${this.baseUrl}/api/v1/prompts/${encodeURIComponent(prompt)}`);
    url.searchParams.set("env", env);

    const response = await this.fetchImpl(url, {
      headers: { authorization: `Bearer ${this.apiKey}` },
    });

    if (!response.ok) {
      throw new Error(`Folio get failed (${response.status})`);
    }

    const body = (await response.json()) as {
      content?: unknown;
      version?: unknown;
    };
    if (typeof body.content !== "string") {
      throw new Error("Folio get returned an unexpected payload");
    }

    if (this.cacheTtlMs > 0) {
      this.cache.set(cacheKey, {
        content: body.content,
        version: typeof body.version === "number" ? body.version : 0,
        expiresAt: Date.now() + this.cacheTtlMs,
      });
    }
    return body.content;
  }
}
