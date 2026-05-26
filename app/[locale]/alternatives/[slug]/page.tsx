import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { useCases } from "@/data/projects";
import { isLocale, type Locale } from "@/lib/i18n";
import { projectsBySlugs, useCaseBySlug } from "@/lib/projects";

export function generateStaticParams() {
  return useCases.flatMap((useCase) => [
    { locale: "vi", slug: useCase.slug },
    { locale: "en", slug: useCase.slug }
  ]);
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
        <p className="eyebrow">Alternatives</p>
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
