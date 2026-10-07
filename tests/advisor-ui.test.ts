import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import AdvisorPage from "../app/[locale]/advisor/page";
import { SiteShell } from "../components/site-shell";
import { createElement } from "react";
import { POST } from "../app/api/advisor/route";
test("advisor bilingual pages expose hardware, catalog filters and optional consent; nav links are discoverable", async () => {
  for (const locale of ["en", "vi"] as const) {
    const html = renderToStaticMarkup(
      await AdvisorPage({ params: Promise.resolve({ locale }) }),
    );
    assert.match(html, locale === "en" ? /reranking preview/ : /xếp lại thứ tự thử nghiệm/);
    for (const name of [
      "cpu",
      "ramGiB",
      "diskGiB",
      "architecture",
      "useCase",
      "category",
      "deploy",
      "useClaude",
    ])
      assert.ok(html.includes(`name="${name}"`));
    assert.match(
      html,
      locale === "en" ? /Project advisor/ : /Tư vấn chọn dự án/,
    );
    const nav = renderToStaticMarkup(
      createElement(SiteShell, { locale, children: null }),
    );
    assert.ok(nav.includes(`/${locale}/compare`));
    assert.ok(nav.includes(`/${locale}/advisor`));
  }
});
test("real Next API adapter provides fallback", async () => {
  const r = await POST(
    new Request("http://localhost/api/advisor", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        locale: "vi",
        host: { cpu: 1, ramGiB: 1, diskGiB: 10, architecture: "arm64" },
        useCase: "google-photos",
      }),
    }),
  );
  assert.equal(r.status, 200);
  assert.deepEqual((await r.json()).choices, []);
});
