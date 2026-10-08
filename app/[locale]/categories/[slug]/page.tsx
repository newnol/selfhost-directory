import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { categories } from "@/data/projects";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { categoryBySlug, projectsByCategory } from "@/lib/projects";

export function generateStaticParams() {
  return categories.flatMap((category) => [
    { locale: "vi", slug: category.slug },
    { locale: "en", slug: category.slug }
  ]);
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "vi";
  const category = categoryBySlug(slug);
  if (!category) {
    return {};
  }
  const title = `${category.title[locale]} - Selfhost Directory`;
  const description = category.description[locale];
  const alternateLanguages: Record<string, string> = {};
  for (const l of locales) {
    alternateLanguages[l] = `https://selfhost.io.vn/${l}/categories/${slug}`;
  }
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://selfhost.io.vn/${locale}/categories/${slug}`,
      locale: locale === "vi" ? "vi_VN" : "en_US"
    },
    alternates: {
      canonical: `https://selfhost.io.vn/${locale}/categories/${slug}`,
      languages: alternateLanguages
    }
  };
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
        <p className="eyebrow">{locale === "vi" ? "Danh mục" : "Category"}</p>
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
