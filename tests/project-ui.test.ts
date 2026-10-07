import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { projects } from "../data/projects";
import ProjectPage from "../app/[locale]/projects/[slug]/page";
import { ProjectCard } from "../components/project-card";
test("project decision UI has calculator and honest deployment warnings in both languages without scores", async () => {
  for (const locale of ["en", "vi"]) {
    const html = renderToStaticMarkup(
      await ProjectPage({
        params: Promise.resolve({ locale, slug: "immich" }),
      }),
    );
    assert.match(html, /name="cpu"/);
    assert.match(
      html,
      locale === "en"
        ? /Unverified deployment examples/
        : /Ví dụ triển khai chưa kiểm chứng/,
    );
    assert.match(html, /secrets/);
    assert.doesNotMatch(
      html,
      /92\/100|score-green|Copy and run on your server/,
    );
  }
  const html = renderToStaticMarkup(
    createElement(ProjectCard, { locale: "en", project: projects[0] }),
  );
  assert.doesNotMatch(html, /class="score"/);
});
