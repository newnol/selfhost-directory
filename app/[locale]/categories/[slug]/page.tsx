import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { categories } from "@/data/projects";
import { isLocale, type Locale } from "@/lib/i18n";
import { categoryBySlug, projectsByCategory } from "@/lib/projects";

export function generateStaticParams() {
  return categories.flatMap((category) => [
    { locale: "vi", slug: category.slug },
    { locale: "en", slug: category.slug }
  ]);
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "vi";
  const category = categoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryProjects = projectsByCategory(category.slug);

  return (
    <section className="detail-page">
      <div className="detail-hero">
        <p className="eyebrow">Category</p>
        <h1>{category.title[locale]}</h1>
        <p>{category.description[locale]}</p>
      </div>

      <div className="project-grid">
        {categoryProjects.map((project) => (
          <ProjectCard key={project.slug} locale={locale} project={project} />
        ))}
      </div>
    </section>
  );
}
