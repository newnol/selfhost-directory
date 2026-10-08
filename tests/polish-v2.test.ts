import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "../app/[locale]/page";
import { categoryProjectCounts } from "../lib/projects";
import { SearchFilter } from "../components/search-filter";
import { projects } from "../data/projects";
import ComparePage from "../app/[locale]/compare/page";
import { AdvisorForm } from "../components/advisor-form";
import { SiteShell } from "../components/site-shell";

const home = (locale: "vi" | "en") => Home({ params: Promise.resolve({ locale }) });
test("topology links to every category with derived counts and catalog immediately after hero", async () => {
 for (const locale of ["vi", "en"] as const) {
  const html = renderToStaticMarkup(await home(locale));
  for (const category of categoryProjectCounts()) {
   assert.match(html, new RegExp(`class="topology-node[^\"]*" href="/${locale}/categories/${category.slug}"`));
   assert.match(html, new RegExp(`${category.count} ${locale === "vi" ? "dự án" : "projects"}`));
  }
  assert.ok(html.indexOf('class="search-filter section"') < html.indexOf('id="alternatives"'));
 }
});
test("catalog renders deployment selector and readable compare checkboxes", () => {
 const html = renderToStaticMarkup(createElement(SearchFilter, { locale: "en", projects, placeholder: "Search" }));
 assert.match(html, /name="deploy"/);
 assert.match(html, /name="compare-project"/);
 assert.match(html, /role="status"/);
});
test("compare picker replaces multi-select with searchable checkboxes, chips and a guarded submit", async () => {
 const html = renderToStaticMarkup(await ComparePage({params:Promise.resolve({locale:"en"}),searchParams:Promise.resolve({projects:"immich,jellyfin"})}));
 assert.doesNotMatch(html, /<select[^>]*multiple/);
 assert.match(html, /id="compare-search"/);
 assert.match(html, /name="projects"[^>]*type="checkbox"|type="checkbox"[^>]*name="projects"/);
 assert.match(html, /class="compare-chip"/);
 assert.match(html, /<caption/);
});
test("advisor exposes progressive native details with hardware in second group", () => {
 const html = renderToStaticMarkup(createElement(AdvisorForm,{locale:"vi",categories:[],useCases:[]}));
 assert.match(html, /<details[^>]*class="advisor-step"/);
 assert.match(html, /01[\s\S]*Nhu cầu/);
 assert.match(html, /02[\s\S]*Máy chủ/);
 assert.match(html, /03[\s\S]*Triển khai/);
 assert.match(html, /name="cpu"/);
});
test("navigation has mobile disclosure and translated accessible label", () => {
 for(const locale of ["vi","en"] as const) {
  const html = renderToStaticMarkup(createElement(SiteShell,{locale,children:null}));
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /aria-controls="mobile-navigation"/);
  assert.match(html, locale === "vi" ? /Mở menu/ : /Open menu/);
 }
});