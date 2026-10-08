import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "node:test";
import assert from "node:assert/strict";

import NotFound from "../app/[locale]/not-found";
import RouteError from "../app/[locale]/error";


test("missing route gives a real catalog recovery link", () => {
 assert.match(renderToStaticMarkup(createElement(NotFound)), /href="\/vi#projects"/);
});
test("route error exposes a retry action and never leaks server details", () => {
 const html=renderToStaticMarkup(createElement(RouteError,{error:new Error("private diagnostics"),reset:()=>{}}));
 assert.match(html, /role="alert"/);
 assert.match(html, /type="button"/);
 assert.doesNotMatch(html,/private diagnostics/);
});
