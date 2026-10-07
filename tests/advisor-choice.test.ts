import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { AdvisorChoice } from "../components/advisor-choice";
import { advise } from "../lib/advisor";
test("advisor choice shows editorial tradeoffs, resource checks and checked source", () => {
  const choice = advise({locale:"en", useCase:"google-photos", host:{cpu:4,ramGiB:8,diskGiB:100,architecture:"amd64"}}).choices[0];
  const html = renderToStaticMarkup(createElement(AdvisorChoice,{choice,locale:"en"}));
  assert.match(html, /plan storage plus backups/);
  assert.match(html, /Catalog editorial notes/);
  assert.match(html, /data-resource="ramGiB"/);
  assert.match(html, /2026-10-07/);
  assert.match(html, /docs.immich.app/);
  assert.match(html, /Unknown/);
});
