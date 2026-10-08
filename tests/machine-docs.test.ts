import { test } from "node:test";
import assert from "node:assert/strict";
import { projects } from "../data/projects";
import { existsSync, readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { renderIndex, renderProject, renderFullCatalog } from "../lib/machine-docs";
import { GET as indexGET } from "../app/llms.txt/route";
import { GET as aliasGET } from "../app/llm.txt/route";
import { GET as fullGET } from "../app/llms-full.txt/route";
import { GET as projectGET } from "../app/[locale]/projects/(machine-docs)/immich.md/route";
import { projectMarkdownResponse } from "../lib/machine-docs";

test("canonical index lists all 28 projects in both locales with public markdown URLs", () => {
  const index = renderIndex();
  assert.match(index, /^# Selfhost/m);
  for (const project of projects) {
    for (const locale of ["en", "vi"]) {
      assert.ok(index.includes(`https://selfhost.io.vn/${locale}/projects/${project.slug}.md`));
    }
  }
  assert.equal((index.match(/https:\/\/selfhost\.io\.vn\/(?:en|vi)\/projects\/[a-z0-9-]+\.md/g) ?? []).length, 56);
});

test("localized documents preserve evidence, unknowns and deployment caveats without exporting snippets", () => {
  for (const project of projects) for (const locale of ["en", "vi"] as const) {
    const doc = renderProject(project, locale);
    assert.ok(doc.includes(project.summary[locale]));
    assert.ok(doc.includes(project.notes[locale]));
    assert.ok(doc.includes(project.license));
    assert.ok(doc.includes(project.links.docs));
    assert.ok(doc.includes(project.links.source));
    assert.match(doc, /Lifecycle: (active|archived|unknown)/);
    assert.match(doc, /Deployment verification: unverified/);
    assert.match(doc, /Checked date: (\d{4}-\d{2}-\d{2}|unknown)/);
    assert.match(doc, /Disk \(GiB\): (\d+|unknown)/);
    assert.ok(!doc.includes(project.deploySnippets.dockerCompose));
    assert.ok(!doc.includes(project.deploySnippets.setupScript));
    const provenance = project.structuredRequirements?.provenance;
    if (provenance?.kind === "documented") {
      assert.ok(doc.includes(provenance.source));
      assert.ok(doc.includes(provenance.checkedAt));
    }
  }
});

test("text routes have exact status and MIME; singular alias permanently redirects", async () => {
  for (const [handler, body] of [[indexGET, renderIndex()], [fullGET, renderFullCatalog()]] as const) {
    const response = handler();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
    assert.equal(await response.text(), body);
  }
  const alias = aliasGET();
  assert.equal(alias.status, 308);
  assert.equal(alias.headers.get("location"), "https://selfhost.io.vn/llms.txt");
});

test("localized markdown route responds with exact MIME and rejects invalid locale or slug", async () => {
  const response = await projectGET(new Request("https://selfhost.io.vn/en/projects/immich.md"), { params: Promise.resolve({ locale: "en" }) });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.equal(await response.text(), renderProject(projects[0], "en"));
  for (const [locale, slug] of [["fr", "immich"], ["EN", "immich"], ["en", "missing"], ["en", "immich.md"], ["en", "../immich"], ["vi", "Immich"]]) {
    const invalid = projectMarkdownResponse(locale, slug);
    assert.equal(invalid.status, 404);
    assert.equal(invalid.headers.get("content-type"), "text/plain; charset=utf-8");
    assert.equal(await invalid.text(), "Not found\n");
  }
});

test("pilot installer is linked only when its artifact manifest exists, preserving verification limits", () => {
  for (const project of projects) {
    const path = `installers/${project.slug}/v1/metadata.json`;
    const doc = renderProject(project, "en");
    if (existsSync(path)) {
      const metadata = JSON.parse(readFileSync(path, "utf8"));
      assert.ok(doc.includes(`https://selfhost.io.vn/install/${project.slug}/v1/install.sh`));
      assert.ok(doc.includes(metadata.status));
      assert.ok(doc.includes(metadata.sha256));
      assert.ok(doc.includes(metadata.validation));
    } else assert.ok(!doc.includes(`/install/${project.slug}/`));
    assert.ok(!doc.includes("install.ps1"));
  }
});

test("corrupt optional installer metadata does not break public documents", () => {
  const cwd = process.cwd();
  const root = mkdtempSync(join(process.env.TMPDIR!, "docs-corrupt-"));
  try {
    const directory = join(root, "installers/uptime-kuma/v1");
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "install.sh"), "placeholder");
    writeFileSync(join(directory, "metadata.json"), "{broken");
    process.chdir(root);
    const project = projects.find(p => p.slug === "uptime-kuma")!;
    const doc = renderProject(project, "en");
    assert.match(doc, /Deployment verification: unverified/);
    assert.doesNotMatch(doc, /Experimental pilot installer/);
  } finally { process.chdir(cwd); rmSync(root, { recursive: true, force: true }); }
});

test("full catalog contains exactly 56 complete localized documents", () => {
  const full = renderFullCatalog();
  assert.equal((full.match(/^# .+ \((?:vi|en)\)$/gm) ?? []).length, 56);
  for (const project of projects) for (const locale of ["en", "vi"] as const) {
    assert.ok(full.includes(renderProject(project, locale)));
  }
});
