"use client";
import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { advise } from "@/lib/advisor";
import { planningCopy } from "@/lib/planning-copy";
import { HardwareFields, hardwareFromForm } from "./hardware-fields";
import { AdvisorChoice } from "./advisor-choice";
type Option = { slug: string; title: string };
export function AdvisorForm({
  locale,
  categories,
  useCases,
}: {
  locale: Locale;
  categories: Option[];
  useCases: Option[];
}) {
  const t = planningCopy[locale];
  const [result, setResult] = useState<ReturnType<typeof advise> | null>(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <section className="planning-panel advisor-panel">
      <form
        onInvalid={e => { const details = (e.target as HTMLElement).closest("details"); if (details) details.open = true; }}
        onSubmit={async (e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          setBusy(true);
          setError(false);
          setResult(null);
          try {
            const response = await fetch("/api/advisor", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                locale,
                host: hardwareFromForm(form),
                useCase: form.get("useCase"),
                category: form.get("category"),
                deploy: form.get("deploy"),
                useClaude: form.get("useClaude") === "on",
              }),
            });
            if (!response.ok) throw new Error("Request failed");
            setResult(await response.json());
          } catch {
            setError(true);
          } finally {
            setBusy(false);
          }
        }}
      >
        <details className="advisor-step" open>
          <summary>01 · {locale === "vi" ? "Nhu cầu" : "Your needs"}</summary>
        {[
          { name: "useCase", title: t.need, options: useCases },
          { name: "category", title: t.category, options: categories },
        ].map((field) => (
          <label key={field.name}>
            {field.title}
            <select name={field.name}>
              <option value="">{t.all}</option>
              {field.options.map((o) => (
                <option key={o.slug} value={o.slug}>
                  {o.title}
                </option>
              ))}
            </select>
          </label>
        ))}
        </details>
        <details className="advisor-step" open>
          <summary>02 · {locale === "vi" ? "Máy chủ" : "Your server"}</summary>
          <p>{locale === "vi" ? "Nhập tài nguyên còn trống, không phải tổng cấu hình." : "Use available resources, not your server’s total capacity."}</p>
          <HardwareFields locale={locale} />
        </details>
        <details className="advisor-step">
          <summary>03 · {locale === "vi" ? "Triển khai" : "Deployment"}</summary>
        <label>
          {t.deploy}
          <select name="deploy">
            <option value="">{t.all}</option>
            {["Docker", "Docker Compose", "Helm", "Binary"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
        <label className="consent">
          <input name="useClaude" type="checkbox" />
          {t.claude}
        </label>
        </details>
        <button type="submit" disabled={busy}>
          {busy ? t.loading : t.send}
        </button>
      </form>
      <div aria-live="polite" aria-busy={busy}>
        {busy && <p role="status">{t.loading}</p>}
        {!result && !busy && !error && <div className="advisor-empty"><p className="eyebrow">{locale === "vi" ? "Bước tiếp theo" : "Up next"}</p><h2>{locale === "vi" ? "Danh sách gợi ý bắt đầu tại đây" : "Your shortlist starts here"}</h2><p>{locale === "vi" ? "Nhập tài nguyên máy chủ và nhu cầu để nhận gợi ý từ thư mục. Các yêu cầu chưa rõ sẽ được ghi rõ, không coi là tương thích." : "Tell us about your server and needs to get catalog-backed suggestions. Unknown requirements stay unknown—not a promise of compatibility."}</p></div>}
        {error && <p role="alert">{t.error}</p>}
        {result && (
          <>
            <h2>{locale === "vi" ? "Gợi ý từ thư mục" : "Your catalog shortlist"}</h2>
            <p>
              {result.mode}: {result.caveat}
            </p>
            {result.choices.length === 0 && <p>{t.none}</p>}
            <ul>
              {result.choices.map((p) => (
                <AdvisorChoice key={p.slug} choice={p} locale={locale} />
              ))}
            </ul>
            {result.choices.length >= 2 && (
              <Link
                href={`/${locale}/compare?projects=${result.choices.map((p) => p.slug).join(",")}`}
              >
                {t.compare}
              </Link>
            )}
          </>
        )}
      </div>
    </section>
  );
}
