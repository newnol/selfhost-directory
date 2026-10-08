import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { dirname, resolve } from "node:path";
import { projects } from "../data/projects";
import { renderFullCatalog, renderIndex, renderProject } from "../lib/machine-docs";

async function unusedPort() {
  const server = createServer();
  await new Promise<void>((ok, fail) => { server.once("error", fail); server.listen(0, "127.0.0.1", ok); });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const port = address.port;
  await new Promise<void>((ok, fail) => server.close(error => error ? fail(error) : ok()));
  return port;
}

async function main() {
  // Check emitted Next traces, not only configuration, before starting HTTP.
  const routes = ["llms.txt", "llms-full.txt", ...projects.map(p => `[locale]/projects/(machine-docs)/${p.slug}.md`)];
  for (const route of routes) {
    const trace = resolve(".next/server/app", route, "route.js.nft.json");
    const files: string[] = JSON.parse(await readFile(trace, "utf8")).files;
    for (const file of ["install.sh", "metadata.json", "SHA256SUMS"]) {
      const artifact = resolve("installers/uptime-kuma/v1", file);
      assert.ok(files.some(entry => resolve(dirname(trace), entry) === artifact), `${route} trace missing ${file}`);
    }
  }
  const port = await unusedPort();
  const base = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], { stdio: "inherit" });
  const exited = new Promise<void>(ok => child.once("exit", () => ok()));
  let spawnError: Error | undefined;
  child.once("error", error => { spawnError = error; });
  const request = (path: string, method = "GET") => fetch(base + path, { method, redirect: "manual", signal: AbortSignal.timeout(5000) });
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (spawnError) throw spawnError;
      assert.equal(child.exitCode, null, "server exited before readiness");
      try { ready = (await request("/llms.txt")).ok; } catch {}
      if (ready) break;
      await new Promise(ok => setTimeout(ok, 100));
    }
    assert.ok(ready, "server readiness timeout");
    let markdown = 0;
    for (const project of projects) for (const locale of ["en", "vi"] as const) {
      const response = await request(`/${locale}/projects/${project.slug}.md`);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("content-type"), "text/markdown; charset=utf-8");
      assert.equal(response.headers.get("x-content-type-options"), "nosniff");
      assert.equal(await response.text(), renderProject(project, locale));
      markdown++;
    }
    assert.equal(markdown, 56);
    for (const [path, expected] of [["/llms.txt", renderIndex()], ["/llms-full.txt", renderFullCatalog()]]) {
      const response = await request(path);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
      assert.equal(await response.text(), expected);
    }
    const alias = await request("/llm.txt");
    assert.equal(alias.status, 308);
    assert.equal(alias.headers.get("location"), "https://selfhost.io.vn/llms.txt");
    const invalid = ["/fr/projects/immich.md", "/EN/projects/immich.md", "/en/projects/missing.md", "/en/projects/Immich.md", "/en/projects/immich.md.md", "/en/projects/[slug].md", "/install/authentik/v1/install.sh", "/install/uptime-kuma/v2/install.sh", "/install/uptime-kuma/v1/install.ps1", "/install/uptime-kuma/v1/metadata.json.bak"];
    for (const path of invalid) assert.equal((await request(path)).status, 404, path);
    const html = await request("/en/projects/uptime-kuma");
    assert.equal(html.status, 200);
    assert.match(html.headers.get("content-type")!, /^text\/html/);
    assert.match(await html.text(), /not deployment-verified/);
    const artifacts = new Map<string, Buffer>();
    for (const file of ["install.sh", "SHA256SUMS", "metadata.json"]) {
      const path = `/install/uptime-kuma/v1/${file}`;
      const response = await request(path);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("content-type"), file === "metadata.json" ? "application/json; charset=utf-8" : "text/plain; charset=utf-8");
      assert.equal(response.headers.get("content-disposition"), `attachment; filename="${file}"`);
      assert.equal(response.headers.get("cache-control"), "public, max-age=31536000, immutable");
      assert.equal(response.headers.get("x-content-type-options"), "nosniff");
      const bytes = Buffer.from(await response.arrayBuffer());
      assert.deepEqual(bytes, await readFile(resolve("installers/uptime-kuma/v1", file)));
      artifacts.set(file, bytes);
      const head = await request(path, "HEAD");
      assert.equal(head.status, 200);
      assert.equal(head.headers.get("content-disposition"), `attachment; filename="${file}"`);
      assert.equal((await head.arrayBuffer()).byteLength, 0);
    }
    const digest = createHash("sha256").update(artifacts.get("install.sh")!).digest("hex");
    assert.equal(artifacts.get("SHA256SUMS")!.toString(), `${digest}  install.sh\n`);
    const metadata = JSON.parse(artifacts.get("metadata.json")!.toString());
    assert.equal(metadata.sha256, digest);
    assert.equal(metadata.status, "experimental-not-deployment-verified");
    console.log(`Deployment docs smoke passed: ${routes.length} traces; ${markdown} exact markdown bodies; index/full/308 alias; ${invalid.length} 404s; 3 exact downloads + HEAD, MIME, immutable/nosniff/attachment; SHA256 ${digest}`);
  } finally {
    if (child.exitCode === null && !spawnError) {
      child.kill("SIGTERM");
      const timer = setTimeout(() => child.kill("SIGKILL"), 5000);
      try { await exited; } finally { clearTimeout(timer); }
    }
    // Rebind verifies the owned listener is gone; never kill another process.
    const server = createServer();
    await new Promise<void>((ok, fail) => { server.once("error", fail); server.listen(port, "127.0.0.1", ok); });
    await new Promise<void>((ok, fail) => server.close(error => error ? fail(error) : ok()));
    console.log(`Cleanup verified: port ${port} closed`);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
