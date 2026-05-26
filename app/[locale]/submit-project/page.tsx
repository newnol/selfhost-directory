import { SubmitProjectForm } from "@/components/submit-project-form";
import { dictionary, isLocale, type Locale } from "@/lib/i18n";

export default async function SubmitProjectPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "vi";
  const t = dictionary[locale].submit;

  return (
    <section className="submit-page">
      <div className="section-heading">
        <p className="eyebrow">Review queue</p>
        <h1>{t.title}</h1>
        <p>{t.copy}</p>
      </div>
      <SubmitProjectForm locale={locale} />
    </section>
  );
}
