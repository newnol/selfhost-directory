import { test } from "node:test";
import assert from "node:assert/strict";
import { advise } from "../lib/advisor";
const input = {
  locale: "en",
  useCase: "vps-monitoring",
  host: { cpu: 2, ramGiB: 4, diskGiB: 20, architecture: "amd64" },
};
test("advisor filters only existing catalog entries, returns max3 and preserves unknown caveats", () => {
  const r = advise(input);
  assert.equal(r.choices.length, 3);
  assert.deepEqual(
    r.choices.map((p) => p.slug),
    ["grafana", "netdata", "uptime-kuma"],
  );
  for (const p of r.choices) {
    assert.equal(p.compatibility.status, "unknown");
    assert.ok(p.caveat.includes("Unknown"));
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
