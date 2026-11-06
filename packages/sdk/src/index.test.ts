import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Folio } from "./index.ts";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("Folio SDK", () => {
  it("fetches prompt content with bearer token", async () => {
    let seen: Request | undefined;
    const folio = new Folio({
      baseUrl: "https://folio.example/",
      apiKey: "fo_test",
      cacheTtlMs: 0,
      fetch: async (input, init) => {
        seen = new Request(input, init);
        return jsonResponse({ content: "You are helpful.", version: 3, env: "production" });
      },
    });

    assert.equal(await folio.get("system"), "You are helpful.");
    assert.ok(seen);
    assert.equal(seen.headers.get("authorization"), "Bearer fo_test");
    const url = new URL(seen.url);
    assert.equal(url.pathname, "/api/v1/prompts/system");
    assert.equal(url.searchParams.get("env"), "production");
  });

  it("getPrompt returns content, version, and env", async () => {
    const folio = new Folio({
      baseUrl: "https://folio.example",
      apiKey: "fo_test",
      cacheTtlMs: 0,
      fetch: async () =>
        jsonResponse({ content: "You are helpful.", version: 3, env: "staging" }),
    });
    assert.deepEqual(await folio.getPrompt("system", { env: "staging" }), {
      content: "You are helpful.",
      version: 3,
      env: "staging",
    });
  });

  it("throws when the request fails", async () => {
    const folio = new Folio({
      baseUrl: "https://folio.example",
      apiKey: "fo_test",
      cacheTtlMs: 0,
      fetch: async () => jsonResponse({ error: "no" }, 401),
    });
    await assert.rejects(() => folio.get("system"), /401/);
  });
});
