import { test } from "node:test";
import assert from "node:assert/strict";
import { advise } from "../lib/advisor";
import { projects, useCases } from "../data/projects";
const input = {
  locale: "en",
  useCase: "vps-monitoring",
  host: { cpu: 2, ramGiB: 8, diskGiB: 20, architecture: "amd64" },
};
test("advisor filters only existing catalog entries, returns max3 and preserves unknown caveats", () => {
  const r = advise(input);
  assert.equal(r.choices.length, 3);
  assert.deepEqual(
    r.choices.map((p) => p.slug),
    ["uptime-kuma", "grafana", "netdata"],
  );
  for (const p of r.choices) {
    assert.equal(p.compatibility.status, "unknown");
    assert.ok(p.caveat.includes("Unknown"));
    assert.equal(p.tradeoff, projects.find(project => project.slug === p.slug)!.notes.en);
    assert.equal(p.reason, useCases.find(u => u.slug === input.useCase)!.description.en);
  }
  assert.equal(advise({ ...input, category: "security" }).choices.length, 0);
  assert.deepEqual(
    advise({ ...input, useCase: "google-photos" }).choices.map((p) => p.slug),
    ["immich"],
  );
  for (const bad of [
    { locale: "fr" },
    { useCase: "unknown" },
    { category: "unknown" },
    { host: { ...input.host, cpu: -1 } },
    { prompt: "generate shell commands" },
  ])
    assert.throws(() => advise({ ...input, ...bad }));
});
