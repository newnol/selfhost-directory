import type { Project } from "@/data/types";
import type { compatibility } from "@/lib/compatibility";
import type { Locale } from "@/lib/i18n";
import { planningCopy } from "@/lib/planning-copy";
export function ResourceChecks({ requirements, result, locale }: {
  requirements?: Project["structuredRequirements"];
  result?: ReturnType<typeof compatibility> | null;
  locale: Locale;
}) {
  const t = planningCopy[locale];
  const provenance = result?.provenance ?? requirements?.provenance;
  return <div className="resource-checks">
    <dl>{(["cpu", "ramGiB", "diskGiB", "architecture"] as const).map(resource => {
      const check = result?.checks.find(c => c.resource === resource);
      return <div key={resource} data-resource={resource}>
        <dt>{t[resource]}</dt>
        <dd>{resource === "architecture" ? (requirements?.architectures ?? result?.checks.find(c => c.resource === "architecture")?.supported)?.join(", ") ?? t.noEvidence
          : <>{t.recordedMinimum}: {requirements?.minimum?.[resource] ?? (check && "minimum" in check ? check.minimum : undefined) ?? t.noEvidence}; {t.recordedRecommended}: {requirements?.recommended?.[resource] ?? (check && "recommended" in check ? check.recommended : undefined) ?? t.noEvidence}</>}
          {check && <><br/>{t.available}: {check.available}; {t[check.status]}</>}
        </dd>
      </div>;
    })}</dl>
    {provenance ? <p>{provenance.kind === "estimate" ? t.estimate : t.source}: {typeof provenance.note === "string" ? provenance.note : provenance.note[locale]} {provenance.kind === "documented" && <a href={provenance.source}>{t.checkedAt}: {provenance.checkedAt}</a>}</p> : <p>{t.noEvidence}</p>}
  </div>;
}
