import { test } from "node:test";
import assert from "node:assert/strict";
import { projects } from "../data/projects";
import { compatibility } from "../lib/compatibility";
const fixture = {
  structuredRequirements: {
    provenance: {
      kind: "estimate" as const,
      note: "Test fixture, not catalog evidence",
    },
    minimum: { cpu: 1, ramGiB: 2, diskGiB: 10 },
    recommended: { cpu: 2, ramGiB: 4, diskGiB: 20 },
    architectures: ["amd64" as const],
  },
};
test("distinguishes below minimum, minimum and recommended at inclusive boundaries", () => {
  assert.equal(
    compatibility(fixture, {
      cpu: 2,
      ramGiB: 4,
      diskGiB: 20,
      architecture: "amd64",
    }).status,
    "recommended",
  );
  assert.equal(
    compatibility(fixture, {
      cpu: 1,
      ramGiB: 2,
      diskGiB: 10,
      architecture: "amd64",
    }).status,
    "minimum",
  );
  assert.equal(
    compatibility(fixture, {
      cpu: 1,
      ramGiB: 1,
      diskGiB: 10,
      architecture: "amd64",
    }).status,
    "below-minimum",
  );
  assert.equal(
    compatibility(fixture, {
      cpu: 2,
      ramGiB: 4,
      diskGiB: 20,
      architecture: "arm64",
    }).status,
    "architecture-mismatch",
  );
  assert.equal(
    compatibility(
      {
        structuredRequirements: {
          ...fixture.structuredRequirements,
          minimum: { cpu: 1 },
        },
      },
      { cpu: 2, ramGiB: 4, diskGiB: 20, architecture: "amd64" },
    ).status,
    "unknown",
  );
});
test("rejects non-finite, coerced, negative, excessive and invalid architecture input", () => {
  for (const h of [
    { cpu: 0 },
    { cpu: -1 },
    { cpu: NaN },
    { cpu: Infinity },
    { cpu: "2" },
    { cpu: 2000 },
    { architecture: "x86" },
    { ramGiB: null },
  ])
    assert.throws(() => compatibility(fixture, { ...host, ...h }));
});
const host = { cpu: 2, ramGiB: 4, diskGiB: 20, architecture: "amd64" };
test("legacy resource strings cannot imply hardware compatibility", () =>
  assert.equal(compatibility({}, host).status, "unknown"));
test("partial evidence returns each threshold and check without promoting unknown to compatible", () => {
  const result = compatibility({ structuredRequirements: {
    ...fixture.structuredRequirements,
    minimum: { cpu: 1 }, recommended: { cpu: 4 }, architectures: undefined,
  } }, host);
  assert.equal(result.status, "unknown");
  assert.deepEqual(result.checks, [
    { resource: "cpu", available: 2, minimum: 1, recommended: 4, status: "minimum" },
    { resource: "ramGiB", available: 4, minimum: undefined, recommended: undefined, status: "unknown" },
    { resource: "diskGiB", available: 20, minimum: undefined, recommended: undefined, status: "unknown" },
    { resource: "architecture", available: "amd64", supported: undefined, status: "unknown" },
  ]);
});
