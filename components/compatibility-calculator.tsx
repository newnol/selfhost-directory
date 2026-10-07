"use client";
import { useState } from "react";
import type { Project } from "@/data/projects";
import type { Locale } from "@/lib/i18n";
import { compatibility } from "@/lib/compatibility";
import { planningCopy } from "@/lib/planning-copy";
import { HardwareFields, hardwareFromForm } from "./hardware-fields";
export function CompatibilityCalculator({
  requirements,
  locale,
}: {
  requirements: Project["structuredRequirements"];
  locale: Locale;
}) {
  const t = planningCopy[locale];
  const [result, setResult] = useState<string>("");
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
            setResult(
              t[r.status] +
                (r.provenance?.kind === "estimate" ? " " + t.estimate : ""),
            );
          } catch {
            setResult(t.invalid);
          }
        }}
      >
        <HardwareFields locale={locale} />
        <button type="submit">{t.check}</button>
      </form>
      <p role="status">{result}</p>
      {requirements && (
        <p>
          {requirements.provenance.note}{" "}
          {requirements.provenance.kind === "documented" && (
            <a href={requirements.provenance.source}>
              {requirements.provenance.checkedAt}
            </a>
          )}
        </p>
      )}
    </section>
  );
}
