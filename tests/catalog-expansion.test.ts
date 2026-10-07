import { test } from "node:test";
import assert from "node:assert/strict";
import { projects, getProject } from "../data/projects";
import { advise } from "../lib/advisor";
import { renderToStaticMarkup } from "react-dom/server";
import ProjectPage from "../app/[locale]/projects/[slug]/page";
const slugs = ["file-browser", "syncthing", "paperless-ngx", "stirling-pdf", "memos", "actual-budget", "forgejo", "gitea", "beszel", "searxng"];
for (const slug of slugs) test(`${slug} is integrated with honest unknown resources and bilingual guidance`, () => {
  const p = getProject(slug)!;
  assert.ok(p);
  assert.equal(p.score, 0);
  assert.equal(p.structuredRequirements?.minimum, undefined);
  assert.equal(p.structuredRequirements?.recommended, undefined);
  assert.equal(p.structuredRequirements?.architectures, undefined);
  assert.equal(p.structuredRequirements?.provenance.kind, "estimate");
  for (const locale of ["en", "vi"] as const) {
    assert.ok(p.summary[locale]); assert.ok(p.notes[locale]); assert.ok(p.deployGuide[locale].backup);
  }
});
test("archived File Browser is excluded even when it would be the first matching recommendation", async () => {
  assert.equal(getProject("file-browser")!.lifecycle, "archived");
  const result = advise({ locale: "en", category: "media", deploy: "Docker", host: { cpu: 8, ramGiB: 16, diskGiB: 1000, architecture: "amd64" } });
  assert.ok(!result.choices.some(p => p.slug === "file-browser"));
  for (const locale of ["en", "vi"]) {
    const html = renderToStaticMarkup(await ProjectPage({ params: Promise.resolve({ locale, slug: "file-browser" }) }));
    assert.match(html, /data-lifecycle="archived"/);
  }
});
test("setup guidance never embeds a second executable Compose copy", () => {
  for (const p of projects) assert.ok(p.deploySnippets.setupScript.split("\n").every(line => !line.trim() || line.trim().startsWith("#")), p.slug);
});
test("license caveats preserve open-core and version scopes", () => {
  assert.match(getProject("stirling-pdf")!.license, /MIT|open.core/i);
  assert.match(getProject("stirling-pdf")!.license, /exception|director|core/i);
  assert.match(getProject("forgejo")!.license, /GPL.*v9|v9.*GPL/i);
});
