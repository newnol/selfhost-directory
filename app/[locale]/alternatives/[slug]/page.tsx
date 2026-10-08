import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { useCases } from "@/data/projects";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { projectsBySlugs, useCaseBySlug } from "@/lib/projects";

export function generateStaticParams() {
  return useCases.flatMap((useCase) => [
    { locale: "vi", slug: useCase.slug },
    { locale: "en", slug: useCase.slug }
  ]);
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "vi";
  const useCase = useCaseBySlug(slug);
  if (!useCase) {
    return {};
  }
  const title = `${useCase.title[locale]} - Selfhost Directory`;
  const description = useCase.description[locale];
  const alternateLanguages: Record<string, string> = {};
  for (const l of locales) {
    alternateLanguages[l] = `https://selfhost.io.vn/${l}/alternatives/${slug}`;
  }
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://selfhost.io.vn/${locale}/alternatives/${slug}`,
      locale: locale === "vi" ? "vi_VN" : "en_US"
    },
    alternates: {
      canonical: `https://selfhost.io.vn/${locale}/alternatives/${slug}`,
      languages: alternateLanguages
    }
  };
}

export default async function AlternativePage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "vi";
  const useCase = useCaseBySlug(slug);

  if (!useCase) {
    notFound();
  }

  const relatedProjects = projectsBySlugs(useCase.projectSlugs);

  return (
    <section className="detail-page">
      <div className="detail-hero">
        <p className="eyebrow">{locale === "vi" ? "Phần mềm thay thế" : "Alternatives"}</p>
        <h1>{useCase.title[locale]}</h1>
        <p>{useCase.description[locale]}</p>
      </div>
      <div className="project-grid">
        {relatedProjects.map((project) => (
          <ProjectCard key={project.slug} locale={locale} project={project} />
        ))}
      </div>
    </section>
  );
}
