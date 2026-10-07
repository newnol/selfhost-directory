"use client";
import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { advise } from "@/lib/advisor";
import { planningCopy } from "@/lib/planning-copy";
import { HardwareFields, hardwareFromForm } from "./hardware-fields";
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
    <section className="planning-panel">
      <form
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
        <HardwareFields locale={locale} />
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
        <button type="submit" disabled={busy}>
          {busy ? t.loading : t.send}
        </button>
      </form>
      <div aria-live="polite">
        {error && <p role="alert">{t.error}</p>}
        {result && (
          <>
            <p>
              {result.mode}: {result.caveat}
            </p>
            {result.choices.length === 0 && <p>{t.none}</p>}
            <ul>
              {result.choices.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${locale}/projects/${p.slug}`}>{p.name}</Link>
                  <p>{p.summary}</p>
                  <p>{p.caveat}</p>
                  <a href={p.docs} target="_blank" rel="noreferrer">
                    Docs
                  </a>
                </li>
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
