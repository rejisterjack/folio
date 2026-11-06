import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { diffLines } from "./diff.ts";

describe("diffLines", () => {
  it("marks identical content as same", () => {
    const rows = diffLines("a\nb", "a\nb");
    assert.ok(rows.every((row) => row.type === "same"));
  });

  it("detects added and removed lines", () => {
    const rows = diffLines("hello", "hello\nworld");
    assert.ok(rows.some((row) => row.type === "add" && row.right === "world"));
  });
});
