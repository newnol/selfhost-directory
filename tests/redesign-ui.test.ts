import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { SearchFilter } from "../components/search-filter";
import { projects } from "../data/projects";
import { AdvisorForm } from "../components/advisor-form";
import ComparePage from "../app/[locale]/compare/page";

test("advisor introduces the empty shortlist in both languages", () => {
  for (const locale of ["en", "vi"] as const) {
    const html = renderToStaticMarkup(createElement(AdvisorForm, {locale, categories:[], useCases:[]}));
    assert.match(html, locale === "en" ? /Your shortlist starts here/ : /Danh sách gợi ý bắt đầu tại đây/);
  }
});

test("comparison is keyboard-scrollable and gives native multi-select instructions", async () => {
  const html = renderToStaticMarkup(await ComparePage({ params: Promise.resolve({ locale: "en" }), searchParams: Promise.resolve({ projects: "immich,jellyfin" }) }));
  assert.match(html, /aria-describedby="compare-help"/);
  assert.match(html, /id="compare-help"/);
  assert.match(html, /tabindex="0"/);
  assert.match(html, /<caption/);
});

test("catalog exposes a labeled search, category filter and live result count in both languages", () => {
  for (const locale of ["en", "vi"] as const) {
    const html = renderToStaticMarkup(createElement(SearchFilter, { locale, projects, placeholder: "Search" }));
    assert.match(html, /id="catalog-search"/);
    assert.match(html, /for="catalog-search"/);
    assert.match(html, /name="category"/);
    assert.match(html, /role="status"/);
    assert.match(html, /28/);
    assert.match(html, /Immich/);
  }
});
