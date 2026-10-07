import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { projects, categories, useCases, getProject } from "../data/projects";

test("catalog has 28 individual project modules and preserves public exports", () => {
  assert.equal(
    readdirSync("data/projects").filter((x) => x.endsWith(".ts")).length,
    28,
  );
  assert.equal(projects.length, 28);
  assert.equal(categories.length, 6);
  assert.equal(useCases.length, 9);
  for (const p of projects) assert.equal(getProject(p.slug), p);
});
