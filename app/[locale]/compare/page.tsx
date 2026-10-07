import Link from "next/link";
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
      <form method="get" className="planning-panel">
        <label>
          {t.compare}
          <select name="projects" multiple size={6} defaultValue={ids}>
            {catalog.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">{t.compare}</button>
      </form>
      {valid ? (
        <div className="compare-scroll">
          <table>
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
                    p!.structuredRequirements
                      ? JSON.stringify(p!.structuredRequirements)
                      : t.unknown,
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
