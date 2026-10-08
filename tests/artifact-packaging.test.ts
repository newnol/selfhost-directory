import { test } from "node:test";
import assert from "node:assert/strict";
import config from "../next.config";

test("filesystem installer evidence is explicitly traced for every server route", () => {
  assert.deepEqual(config.outputFileTracingIncludes?.["/*"], ["./installers/uptime-kuma/v1/*"]);
});
