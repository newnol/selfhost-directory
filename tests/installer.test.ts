import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, statSync, symlinkSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { renderToStaticMarkup } from "react-dom/server";
import ProjectPage from "../app/[locale]/projects/[slug]/page";

// Dynamic import allows the RED assertion to describe a missing route.
 test("versioned downloads are exact bytes with checksum and immutable metadata", async () => {
  const { GET } = await import("../app/install/[slug]/[version]/[file]/route");
  const params = (file: string) => ({ params: Promise.resolve({ slug: "uptime-kuma", version: "v1", file }) });
  const response = await GET(new Request("https://selfhost.io.vn/install/uptime-kuma/v1/install.sh"), params("install.sh"));
  const bytes = readFileSync(script);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes);
  assert.match(response.headers.get("cache-control")!, /immutable/);
  const digest = createHash("sha256").update(bytes).digest("hex");
  const checksums = await GET(new Request("https://selfhost.io.vn"), params("SHA256SUMS"));
  assert.equal(await checksums.text(), `${digest}  install.sh\n`);
  const metadata = await GET(new Request("https://selfhost.io.vn"), params("metadata.json"));
  const meta = await metadata.json();
  assert.equal(meta.sha256, digest);
  assert.equal(meta.status, "experimental-not-deployment-verified");
  const unknown = await GET(new Request("https://selfhost.io.vn"), { params: Promise.resolve({ slug: "authentik", version: "v1", file: "install.sh" }) });
  assert.equal(unknown.status, 404);
 });

test("UI offers only Kuma pilot, inspect-before-run and explicit unsupported guidance", async () => {
  for (const locale of ["en", "vi"]) {
    const html = renderToStaticMarkup(await ProjectPage({ params: Promise.resolve({ locale, slug: "uptime-kuma" }) }));
    assert.match(html, /\/install\/uptime-kuma\/v1\/install.sh/);
    assert.match(html, /SHA256SUMS/);
    assert.match(html, /--check/);
    assert.match(html, /--apply/);
    assert.match(html, /WSL2/);
    assert.match(html, /Docker Desktop/);
    assert.doesNotMatch(html, /curl[^<]*\|\s*(?:ba)?sh/);
    assert.doesNotMatch(html, /setup.sh|louislam\/uptime-kuma:latest/);
  }
  const other = renderToStaticMarkup(await ProjectPage({ params: Promise.resolve({ locale: "en", slug: "authentik" }) }));
  assert.match(other, /No hosted installer/);
  assert.doesNotMatch(other, /\/install\/authentik/);
});

const script = resolve("installers/uptime-kuma/v1/install.sh");
function sandbox(overrides: Record<string, string> = {}) {
  const root = mkdtempSync(join(process.env.TMPDIR!, "kuma-installer-"));
  const bin = join(root, "bin"); mkdirSync(bin);
  for (const [name, content] of Object.entries({
    id: 'echo "${FAKE_UID:-1000}"',
    uname: 'case "$1" in -s) echo "${FAKE_OS:-Linux}";; -m) echo "${FAKE_ARCH:-x86_64}";; esac',
    docker: 'printf "%s\\n" "$*" >> "$CALLS"; case "$*" in "context inspect --format {{.Endpoints.docker.Host}}") echo "${DOCKER_ENDPOINT:-unix:///var/run/docker.sock}";; "info --format {{.OSType}}") echo "${DOCKER_OS:-linux}";; "compose version --short") echo "${COMPOSE_VERSION:-2.39.0}";; esac; exit "${DOCKER_EXIT:-0}"',
  })) writeFileSync(join(bin, name), `#!/bin/sh\n${content}\n`, { mode: 0o700 });
  const target = join(root, "folder with spaces");
  const calls = join(root, "calls");
  return { root, target, calls,
    run: (args: string[] = []) => spawnSync("/bin/bash", [script, "--directory", target, ...args], { encoding: "utf8", env: { ...process.env, PATH: `${bin}:/usr/bin:/bin`, CALLS: calls, ...overrides } }),
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

test("pilot defaults to preflight only, with no filesystem writes or docker up", () => {
  const s = sandbox();
  try {
    const result = s.run();
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /--apply/);
    assert.equal(existsSync(s.target), false);
    assert.doesNotMatch(readFileSync(s.calls, "utf8"), /up|pull/);
  } finally { s.cleanup(); }
});

test("apply creates restrictive local configuration and rerun refuses without changing data", () => {
  const s = sandbox();
  try {
    const first = s.run(["--apply"]);
    assert.equal(first.status, 0, first.stderr);
    assert.equal(statSync(s.target).mode & 0o777, 0o700);
    assert.equal(statSync(join(s.target, "data")).mode & 0o777, 0o700);
    assert.equal(statSync(join(s.target, "compose.yaml")).mode & 0o777, 0o600);
    const compose = readFileSync(join(s.target, "compose.yaml"), "utf8");
    assert.match(compose, /2\.5\.5@sha256:/);
    assert.match(compose, /127\.0\.0\.1:3001:3001/);
    assert.match(readFileSync(s.calls, "utf8"), /up --detach/);
    writeFileSync(join(s.target, ".env"), "SECRET=sentinel");
    writeFileSync(join(s.target, "data", "sentinel"), "keep me");
    const callsBefore = readFileSync(s.calls, "utf8");
    const again = s.run(["--apply"]);
    assert.notEqual(again.status, 0);
    assert.match(again.stderr, /already exists/);
    assert.equal(readFileSync(join(s.target, ".env"), "utf8"), "SECRET=sentinel");
    assert.equal(readFileSync(join(s.target, "data", "sentinel"), "utf8"), "keep me");
    assert.equal(readFileSync(s.calls, "utf8"), callsBefore);
    assert.equal(readFileSync(join(s.target, "compose.yaml"), "utf8"), compose);
    assert.doesNotMatch(first.stdout + first.stderr + again.stdout + again.stderr, /SECRET=sentinel/);
  } finally { s.cleanup(); }
});

for (const [label, env, args] of [
  ["root", { FAKE_UID: "0" }, []],
  ["unknown OS", { FAKE_OS: "FreeBSD" }, []],
  ["unsupported arch", { FAKE_ARCH: "riscv64" }, []],
  ["daemon failure", { DOCKER_EXIT: "1" }, []],
  ["Windows containers", { DOCKER_OS: "windows" }, []],
  ["Compose v1", { COMPOSE_VERSION: "1.29" }, []],
  ["remote daemon", { DOCKER_ENDPOINT: "tcp://remote:2375" }, []],
  ["Docker host override", { DOCKER_HOST: "unix:///remote" }, []],
  ["unknown argument", {}, ["--force"]],
  ["missing directory", {}, ["--directory"]],
  ["invalid path", {}, ["--directory", "/tmp/$(touch hacked)"]],
  ["dot traversal", {}, ["--directory", "/home/../target"]],
  ["conflicting modes", {}, ["--check", "--apply"]],
  ["macOS apply", { FAKE_OS: "Darwin" }, ["--apply"]],
] as [string, Record<string, string>, string[]][]) test(`fail closed: ${label}`, () => {
  const s = sandbox(env);
  try {
    const result = s.run(args);
    assert.notEqual(result.status, 0);
    assert.equal(existsSync(s.target), false);
    if (existsSync(s.calls)) assert.doesNotMatch(readFileSync(s.calls, "utf8"), /up --detach/);
  } finally { s.cleanup(); }
});

test("dry-run and macOS check stay read-only", () => {
  for (const env of [{}, { FAKE_OS: "Darwin" }] as Record<string, string>[]) {
    const s = sandbox(env);
    try {
      const result = s.run(["--dry-run"]);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(existsSync(s.target), false);
    } finally { s.cleanup(); }
  }
});

test("refuses existing symlinks without following or replacing them", () => {
  const s = sandbox();
  try {
    symlinkSync(join(s.root, "absent"), s.target);
    const result = s.run(["--apply"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /already exists/);
    assert.equal(existsSync(s.calls), false);
  } finally { s.cleanup(); }
});

test("bash syntax parses without executing", () => {
  assert.equal(spawnSync("bash", ["-n", script]).status, 0);
});
