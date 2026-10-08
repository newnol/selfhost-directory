"use client";
import { useState } from "react";
import type { Project } from "@/data/projects";
import type { Locale } from "@/lib/i18n";
import { compatibility } from "@/lib/compatibility";
import { planningCopy } from "@/lib/planning-copy";
import { HardwareFields, hardwareFromForm } from "./hardware-fields";
import { ResourceChecks } from "./resource-checks";
export function CompatibilityCalculator({
  requirements,
  locale,
}: {
  requirements: Project["structuredRequirements"];
  locale: Locale;
}) {
  const t = planningCopy[locale];
  const [result, setResult] = useState<ReturnType<typeof compatibility> | null>(null);
  const [error, setError] = useState(false);
  return (
    <section className="planning-panel">
      <h2>{t.calculator}</h2>
      <p>{t.unknown}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            const r = compatibility(
              { structuredRequirements: requirements },
              hardwareFromForm(new FormData(e.currentTarget)),
            );
            setResult(r);
            setError(false);
          } catch {
            setResult(null);
            setError(true);
          }
        }}
      >
        <HardwareFields locale={locale} />
        <button type="submit">{t.check}</button>
      </form>
      <p role="status">{error ? t.invalid : result ? t[result.status] : ""}</p>
      <ResourceChecks requirements={requirements} result={result} locale={locale} />
    </section>
  );
}
