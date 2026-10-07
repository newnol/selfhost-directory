import { test } from "node:test";
import assert from "node:assert/strict";
import { createAdvisorHandler } from "../lib/advisor-server";
const input = {
  locale: "en",
  useCase: "vps-monitoring",
  host: { cpu: 2, ramGiB: 4, diskGiB: 20, architecture: "amd64" },
};
function request(body: unknown = input, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/advisor", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}
test("API defaults to deterministic without credentials and rejects malformed, oversized and cross-origin requests", async () => {
  const handler = createAdvisorHandler({ env: {} });
  const response = await handler(request());
  assert.equal(response.status, 200);
  const r = await response.json();
  assert.equal(r.mode, "deterministic");
  assert.equal(r.choices.length, 3);
  assert.equal(
    (await handler(request({ ...input, prompt: "bad" }))).status,
    400,
  );
  assert.equal(
    (await handler(request(input, { origin: "https://evil.example" }))).status,
    403,
  );
  assert.equal(
    (await handler(request(input, { "content-type": "text/plain" }))).status,
    415,
  );
  assert.equal(
    (await handler(request({ padding: "x".repeat(9000) }))).status,
    413,
  );
});
test("explicit public origin allows wildcard bind without trusting forwarded headers", async () => {
  const env = { ADVISOR_ALLOWED_ORIGINS: "http://127.0.0.1:4312" };
  const handler = createAdvisorHandler({ env });
  const make = (origin: string) => new Request("http://0.0.0.0:4312/api/advisor", {
    method: "POST", headers: { "content-type": "application/json", origin,
      "x-forwarded-host": "evil.example", "x-forwarded-proto": "https" }, body: JSON.stringify(input),
  });
  assert.equal((await handler(make("http://127.0.0.1:4312"))).status, 200);
  for (const origin of ["https://evil.example", "null", "http://127.0.0.1:4312.evil.example", "http://0.0.0.0:4312"]) {
    assert.equal((await handler(make(origin))).status, 403);
  }
  assert.equal((await createAdvisorHandler({ env: {} })(make("https://evil.example"))).status, 403);
  assert.equal((await createAdvisorHandler({ env: { ADVISOR_ALLOWED_ORIGINS: "*" } })(make("http://127.0.0.1:4312"))).status, 403);
});
const enabled = {
  ADVISOR_CLAUDE_ENABLED: "true",
  ADVISOR_ALLOW_PROCESS_LOCAL_LIMITS: "true",
  ANTHROPIC_API_KEY: "test-only-not-a-real-key",
  ANTHROPIC_MODEL: "configured-test-model",
};
test("Claude requires explicit opt-in and only validated permutations can affect catalog output", async () => {
  let calls = 0;
  const fetcher: typeof fetch = async (_url, init) => {
    calls++;
    const payload = JSON.parse(String(init?.body));
    assert.equal(payload.max_tokens, 256);
    assert.ok(String(init?.body).length < 12000);
    assert.ok(init?.signal);
    return Response.json({
      content: [
        { type: "text", text: '{"slugs":["uptime-kuma","grafana","netdata"]}' },
      ],
    });
  };
  for (const env of [
    {},
    { ...enabled, ADVISOR_CLAUDE_ENABLED: "false" },
    { ...enabled, ADVISOR_ALLOW_PROCESS_LOCAL_LIMITS: undefined },
  ]) {
    const r = await createAdvisorHandler({ env, fetcher })(
      request({ ...input, useClaude: true }),
    );
    assert.equal((await r.json()).mode, "deterministic");
  }
  assert.equal(calls, 0);
  const r = await createAdvisorHandler({ env: enabled, fetcher })(
    request({ ...input, useClaude: true }),
  );
  const result = await r.json();
  assert.equal(result.mode, "claude-ranked");
  assert.equal(result.rankingPreview, true);
  assert.equal(result.choices[0].explanationSource, "catalog-editorial");
  assert.deepEqual(
    result.choices.map((p: { slug: string }) => p.slug),
    ["uptime-kuma", "grafana", "netdata"],
  );
  assert.ok(result.choices[0].caveat.includes("Unknown"));
  for (const text of [
    '{"slugs":["invented"]}',
    '{"slugs":["grafana","grafana","netdata"]}',
    '{"slugs":["grafana"],"compose":"evil"}',
    "not json",
  ]) {
    const bad: typeof fetch = async () =>
      Response.json({ content: [{ type: "text", text }] });
    const r = await createAdvisorHandler({ env: enabled, fetcher: bad })(
      request({ ...input, useClaude: true }),
    );
    assert.equal((await r.json()).mode, "deterministic");
  }
});
test("Claude network failure and aborted timeout return safe deterministic fallback", async () => {
  for (const fetcher of [
    async () => {
      throw new Error("network");
    },
    async (_url: unknown, init?: RequestInit) =>
      new Promise<Response>((_, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(new Error("aborted")),
        );
      }),
  ]) {
    const r = await createAdvisorHandler({
      env: enabled,
      fetcher: fetcher as typeof fetch,
      timeoutMs: 10,
    })(request({ ...input, useClaude: true }));
    assert.equal((await r.json()).mode, "deterministic");
  }
});
test("global in-process limit rejects excess requests without trusting client IP headers", async () => {
  const handler = createAdvisorHandler({ env: {}, maxRequests: 2 });
  assert.equal((await handler(request())).status, 200);
  assert.equal((await handler(request())).status, 200);
  const r = await handler(request(input, { "x-forwarded-for": "spoofed" }));
  assert.equal(r.status, 429);
  assert.ok(r.headers.get("retry-after"));
});
