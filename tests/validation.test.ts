import { test } from "node:test";
import assert from "node:assert/strict";
import { projects, categories, useCases } from "../data/projects";
import * as schema from "../lib/catalog-validation";
test("structured requirements demand provenance and valid values, dates and ordered thresholds", () => {
  for (const r of [
    { minimum: { cpu: 2 } },
    { provenance: { kind: "estimate", note: "" } },
    {
      provenance: {
        kind: "documented",
        source: "https://example.com",
        checkedAt: "2026-02-31",
        note: "example",
      },
    },
    {
      provenance: { kind: "estimate", note: "fixture" },
      minimum: { ramGiB: -1 },
    },
    {
      provenance: { kind: "estimate", note: "fixture" },
      minimum: { cpu: 2 },
      recommended: { cpu: 1 },
    },
  ])
    assert.throws(() => schema.requirementsSchema.parse(r));
  assert.doesNotThrow(() =>
    schema.requirementsSchema.parse({
      provenance: { kind: "estimate", note: "fixture; unknown allowed" },
      minimum: { cpu: 1 },
    }),
  );
});
test("runtime validation rejects duplicate identifiers, missing translations, unsafe URLs and dangling references", () => {
  assert.equal(typeof schema.validateCatalog, "function");
  assert.doesNotThrow(() =>
    schema.validateCatalog(projects, categories, useCases),
  );
  for (const bad of [
    [...projects, projects[0]],
    [{ ...projects[0], summary: { en: "x" } }],
    [
      {
        ...projects[0],
        links: { source: "javascript:alert(1)", docs: "https://example.com" },
      },
    ],
  ])
    assert.throws(() => schema.validateCatalog(bad, categories, useCases));
  assert.throws(() =>
    schema.validateCatalog(projects, categories, [
      { ...useCases[0], projectSlugs: ["missing"] },
    ]),
  );
});
