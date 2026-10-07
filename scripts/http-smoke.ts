import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { projects, categories, useCases } from "../data/projects";
async function main() {
  const port = process.env.SMOKE_PORT ?? "3217",
    base = `http://127.0.0.1:${port}`;
  const child = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "--hostname", "0.0.0.0", "-p", port],
    { stdio: "inherit", env: { ...process.env, ADVISOR_ALLOWED_ORIGINS: base, ADVISOR_CLAUDE_ENABLED: "false" } },
  );
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (child.exitCode !== null) throw new Error("Server exited");
      try {
        if ((await fetch(base + "/en")).ok) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 100));
    }
    assert.ok(ready, "server readiness");
    let count = 0;
    for (const locale of ["en", "vi"]) {
      const routes = [
        `/${locale}`,
        `/${locale}/advisor`,
        `/${locale}/submit-project`,
        ...projects.map((p) => `/${locale}/projects/${p.slug}`),
        ...categories.map((p) => `/${locale}/categories/${p.slug}`),
        ...useCases.map((p) => `/${locale}/alternatives/${p.slug}`),
      ];
      for (const route of routes) {
        const r = await fetch(base + route);
        assert.equal(r.status, 200, route);
        count++;
      }
      const r = await fetch(
        base + `/${locale}/compare?projects=immich,jellyfin,nextcloud`,
      );
      assert.equal(r.status, 200);
      assert.ok((await r.text()).includes("<table"));
      count++;
    }
    const r = await fetch(base + "/en/compare?projects=immich,missing");
    assert.equal(r.status, 200);
    assert.ok((await r.text()).includes("Choose 2–3 distinct projects"));
    count++;
    const input = {
      locale: "en",
      useCase: "vps-monitoring",
      host: { cpu: 2, ramGiB: 4, diskGiB: 20, architecture: "arm64" },
    };
    const response = await fetch(base + "/api/advisor", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: base },
      body: JSON.stringify(input),
    });
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.mode, "deterministic");
    assert.equal(data.choices.length, 3);
    assert.ok(
      data.choices.every(
        (p: { compatibility: { status: string } }) =>
          p.compatibility.status === "unknown",
      ),
    );
    assert.equal(data.choices[0].slug, "uptime-kuma");
    assert.ok(data.choices.every((p: { tradeoff: string; compatibility: { checks: unknown[] } }) => p.tradeoff && p.compatibility.checks.length === 4));
    const immich = await fetch(base + "/en/projects/immich");
    const html = await immich.text();
    assert.ok(html.includes('data-resource="ramGiB"') && html.includes("2026-10-07"));
    const partial = await fetch(base + "/api/advisor", {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({...input, useCase: "google-photos", host: {...input.host, cpu: 4, ramGiB: 8}}),
    });
    const evidence = (await partial.json()).choices[0];
    assert.equal(evidence.compatibility.status, "unknown");
    assert.equal(evidence.compatibility.checks[0].status, "recommended");
    assert.equal(evidence.compatibility.checks[2].status, "unknown");
    assert.equal(evidence.compatibility.provenance.kind, "documented");
    const bad = await fetch(base + "/api/advisor", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: base },
      body: '{"locale":"invalid"}',
    });
    assert.equal(bad.status, 400);
    console.log(
      `HTTP smoke passed: ${count} page requests; advisor fallback 200 (3 unknown choices); invalid input 400`,
    );
  } finally {
    child.kill("SIGTERM");
    await new Promise<void>((resolve) =>
      child.exitCode !== null ? resolve() : child.once("exit", () => resolve()),
    );
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
