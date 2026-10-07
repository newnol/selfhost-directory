import { AdvisorForm } from "@/components/advisor-form";
import { categories, useCases } from "@/data/projects";
import { isLocale } from "@/lib/i18n";
import { planningCopy } from "@/lib/planning-copy";
export default async function AdvisorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "vi";
  return (
    <article className="detail-page">
      <h1>{planningCopy[locale].advisor}</h1>
      <p>{planningCopy[locale].fallback}</p>
      <AdvisorForm
        locale={locale}
        categories={categories.map((c) => ({
          slug: c.slug,
          title: c.title[locale],
        }))}
        useCases={useCases.map((c) => ({
          slug: c.slug,
          title: c.title[locale],
        }))}
      />
    </article>
  );
}
