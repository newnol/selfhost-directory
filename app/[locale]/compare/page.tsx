import Link from "next/link";
import { ComparePicker } from "@/components/compare-picker";
import { ResourceChecks } from "@/components/resource-checks";
import { projects as catalog } from "@/data/projects";
import { isLocale } from "@/lib/i18n";
import { planningCopy } from "@/lib/planning-copy";
export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ projects?: string | string[] }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "vi";
  const t = planningCopy[locale];
  const query = (await searchParams).projects;
  const ids =
    typeof query === "string" && query.length <= 200
      ? query.split(",")
      : Array.isArray(query)
        ? query
        : [];
  const selected = ids.map((id) => catalog.find((p) => p.slug === id));
  const valid =
    ids.length >= 2 &&
    ids.length <= 3 &&
    new Set(ids).size === ids.length &&
    selected.every(Boolean);
  return (
    <article className="detail-page">
      <h1>{t.compare}</h1>
      <p>{t.choose}</p>
      <ComparePicker locale={locale} projects={catalog.map(p => ({slug:p.slug,name:p.name,category:p.category}))} initial={ids} />
      {valid ? (
        <div className="compare-scroll" tabIndex={0} role="region" aria-label={t.compare}>
          <table>
            <caption>{locale === "vi" ? "So sánh yêu cầu và triển khai" : "Requirements and deployment, side by side"}</caption>
            <thead>
              <tr>
                <th>{t.compare}</th>
                {selected.map((p) => (
                  <th key={p!.slug}>
                    <Link href={`/${locale}/projects/${p!.slug}`}>
                      {p!.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [t.category, ...selected.map((p) => p!.category)],
                [
                  locale === "vi" ? "Mô tả" : "Summary",
                  ...selected.map((p) => p!.summary[locale]),
                ],
                ["License", ...selected.map((p) => p!.license)],
                [t.deploy, ...selected.map((p) => p!.deploy)],
                [t.estimate, ...selected.map((p) => p!.requirements)],
                [
                  t.calculator,
                  ...selected.map((p) =>
                    <ResourceChecks key={p!.slug} requirements={p!.structuredRequirements} locale={locale} />,
                  ),
                ],
                [
                  locale === "vi" ? "Lưu ý" : "Notes",
                  ...selected.map((p) => p!.notes[locale]),
                ],
                [
                  "Backup",
                  ...selected.map((p) => p!.deployGuide[locale].backup),
                ],
              ].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) =>
                    j === 0 ? (
                      <th key={j} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={j}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <p>{t.fallback}</p>
          <p>
            {t.warning}: {t.secrets}
          </p>
        </div>
      ) : (
        query && <p role="alert">{t.choose}</p>
      )}
    </article>
  );
}
