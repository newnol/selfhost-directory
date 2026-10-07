import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import ComparePage from "../app/[locale]/compare/page";
test("compare query renders 2-3 known distinct projects, with warnings and bilingual selector", async () => {
  for (const locale of ["vi", "en"]) {
    const html = renderToStaticMarkup(
      await ComparePage({
        params: Promise.resolve({ locale }),
        searchParams: Promise.resolve({ projects: "immich,jellyfin" }),
      }),
    );
    assert.match(html, /Immich/);
    assert.match(html, /Jellyfin/);
    assert.match(html, /<table/);
    assert.match(html, /name="projects"/);
    assert.doesNotMatch(html, /92\/100/);
  }
  for (const projects of [
    "immich",
    "immich,immich",
    "immich,missing",
    "immich,jellyfin,nextcloud,ollama",
  ]) {
    const html = renderToStaticMarkup(
      await ComparePage({
        params: Promise.resolve({ locale: "en" }),
        searchParams: Promise.resolve({ projects }),
      }),
    );
    assert.match(html, /Choose 2–3 distinct projects/);
    assert.doesNotMatch(html, /<table/);
  }
});
