import test from "node:test";
import assert from "node:assert/strict";
import { projects, categories, useCases } from "../data/projects";
import { loadCatalog } from "../lib/catalog-loading";

test("catalog loader accepts declarative data without losing project metadata", () => {
  const baseline = structuredClone({ projects, categories, useCases });
  assert.deepEqual(loadCatalog(baseline.projects, baseline.categories, baseline.useCases), baseline);
});

test("catalog loader rejects an invalid deploy method before exposing data", () => {
  const baseline = structuredClone({ projects, categories, useCases });
  const invalid = { ...baseline.projects[0], deploy: "invalid" };
  assert.throws(() => loadCatalog([invalid], baseline.categories, baseline.useCases));
});
