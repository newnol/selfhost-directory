import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SearchFilter } from "../components/search-filter";
import { projects } from "../data/projects";
import { SiteShell } from "../components/site-shell";
import { localeHref } from "../lib/navigation";

test("language switching preserves detail route and comparison query", () => {
 assert.equal(localeHref("/en/projects/immich", "vi", "projects=immich,jellyfin"), "/vi/projects/immich?projects=immich,jellyfin");
 assert.equal(localeHref("/vi/advisor", "en"), "/en/advisor");
 assert.equal(localeHref(null, "vi"), "/vi");
});

test("shell gives its content a localized language boundary", () => {
 for (const locale of ["vi", "en"] as const) {
  const html = renderToStaticMarkup(createElement(SiteShell, {locale, children:null}));
  assert.match(html, new RegExp(`class="site-shell" lang="${locale}"`));
 }
});
import ProjectPage from "../app/[locale]/projects/[slug]/page";

test("project detail has localized jump links to requirements, review and deployment", async () => {
 for (const locale of ["vi", "en"] as const) {
  const html = renderToStaticMarkup(await ProjectPage({params:Promise.resolve({locale,slug:"uptime-kuma"})}));
  for (const id of ["requirements", "review", "deployment"]) {
   assert.match(html, new RegExp(`href="#${id}"`));
   assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, locale === "vi" ? /Nội dung dự án/ : /On this page/);
 }
});
test("deployment jump starts before guide and backup in both locales", async () => {
 for (const locale of ["vi", "en"] as const) {
  const html = renderToStaticMarkup(await ProjectPage({params:Promise.resolve({locale,slug:"immich"})}));
  const anchor = html.indexOf('id="deployment"');
  const guide = html.indexOf(locale === "vi" ? "Hướng dẫn deploy" : "Deployment guide");
  assert.ok(anchor > 0 && anchor < guide);
  assert.ok(guide < html.indexOf('class="backup-note"'));
 }
});

import { CopyCodeBlock } from "../components/copy-code-block";
import { SubmitProjectForm } from "../components/submit-project-form";

test("code scrolling is keyboard reachable and submission trap is not exposed to assistive technology", () => {
 const code = renderToStaticMarkup(createElement(CopyCodeBlock,{code:"example",label:"config.yml",language:"yaml",copiedLabel:"Copied",copyLabel:"Copy"}));
 assert.match(code, /<pre[^>]*tabindex="0"/);
 const form = renderToStaticMarkup(createElement(SubmitProjectForm,{locale:"en"}));
 assert.match(form, /class="hidden-field"[^>]*aria-hidden="true"/);
});

 test("catalog filters have an accessible collapsible group without hiding search", () => {
  for (const locale of ["vi", "en"] as const) {
    const html = renderToStaticMarkup(createElement(SearchFilter, {locale, projects, placeholder: "Search"}));
    assert.match(html, /<details[^>]*class="catalog-filter-group"/);
    assert.match(html, locale === "vi" ? /<summary>Bộ lọc/ : /<summary>Filters/);
    assert.ok(html.indexOf('id="catalog-search"') < html.indexOf('class="catalog-filter-group"'));
    assert.match(html, /aria-describedby="catalog-compare-help"/);
    assert.match(html, /id="catalog-compare-help"/);
  }
});

test("night canvas and locally hosted reference typography are deterministic", () => {
 const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
 assert.match(css, /color-scheme:\s*dark/);
 assert.match(css, /--background:\s*#13111[Cc]/);
 assert.match(css, /IBM Plex Serif/);
 assert.match(css, /JetBrains Mono/);
 assert.match(css, /font-display:\s*swap/);
 assert.doesNotMatch(css, /@media\s*\(prefers-color-scheme:dark\)/);
});
