import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { SearchFilter } from "@/components/search-filter";
import { projects, useCases } from "@/data/projects";
import { dictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { categoryProjectCounts, projectsByCategory } from "@/lib/projects";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "vi";
  const title =
    locale === "vi"
      ? "Selfhost Directory - Kham pha du an open source tu host"
      : "Selfhost Directory - Discover self-hosted open source projects";
  const description =
    locale === "vi"
      ? "Thu muc cac du an open source tu host, so sanh va huong dan deploy cho VPS va team nho."
      : "A curated directory of self-hosted open source projects with deployment guides and comparisons.";
  const alternateLanguages: Record<string, string> = {};
  for (const l of locales) {
    alternateLanguages[l] = `https://selfhost.io.vn/${l}`;
  }
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://selfhost.io.vn/${locale}`,
      locale: locale === "vi" ? "vi_VN" : "en_US"
    },
    alternates: {
      canonical: `https://selfhost.io.vn/${locale}`,
      languages: alternateLanguages
    }
  };
}

export default async function LocaleHome({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "vi";
  const t = dictionary[locale];
  const categories = categoryProjectCounts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Selfhost Directory",
        url: `https://selfhost.io.vn/${locale}`,
        description:
          locale === "vi"
            ? "Thu muc cac du an open source tu host"
            : "A curated directory of self-hosted open source projects",
        inLanguage: locale === "vi" ? "vi" : "en"
      },
      {
        "@type": "ItemList",
        name:
          locale === "vi"
            ? "Danh sach du an self-hosted"
            : "Self-hosted projects list",
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: project.name,
          url: `https://selfhost.io.vn/${locale}/projects/${project.slug}`
        }))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.hero.title}</h1>
          <p>{t.hero.copy}</p>
          <div className="hero-actions">
            <Link className="button primary" href="#projects">
              {t.hero.primary}
            </Link>
            <Link className="button secondary" href={`/${locale}/submit-project`}>
              {t.hero.secondary}
            </Link>
          </div>
        </div>
        <div className="hero-panel" aria-label="Directory snapshot">
          <div>
            <span>{projects.length}</span>
            <p>{locale === "vi" ? "project đã curate" : "curated projects"}</p>
          </div>
          <div>
            <span>2</span>
            <p>{locale === "vi" ? "ngôn ngữ" : "languages"}</p>
          </div>
          <div>
            <span>API</span>
            <p>{locale === "vi" ? "submission serverless" : "serverless submissions"}</p>
          </div>
        </div>
      </section>

      <SearchFilter
        locale={locale}
        projects={projects.map((p) => ({
          slug: p.slug,
          name: p.name,
          iconUrl: p.iconUrl,
          categorySlug: p.categorySlug,
          category: p.category,
          tags: p.tags,
          score: p.score,
          deploy: p.deploy,
          summary: p.summary,
        }))}
        placeholder={locale === "vi" ? "Tìm kiếm project theo tên hoặc tag..." : "Search projects by name or tag..."}
      />

      <section className="section" id="projects">
        <div className="section-heading">
          <p className="eyebrow">Categories</p>
          <h2>{locale === "vi" ? "Duyệt theo danh mục" : "Browse by category"}</h2>
          <p>
            {locale === "vi"
              ? "Mỗi danh mục gom các project cùng nhu cầu để website dễ mở rộng khi số lượng project tăng lên."
              : "Each category groups projects by job-to-be-done so the directory can scale cleanly."}
          </p>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link className="category-card" key={category.slug} href={`/${locale}/categories/${category.slug}`}>
              <span className="category-icon">{category.icon}</span>
              <h3>{category.title[locale]}</h3>
              <p>{category.description[locale]}</p>
              <span className="category-count">{category.count} projects</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Directory</p>
          <h2>{t.sections.featured}</h2>
        </div>
        <div className="category-sections">
          {categories
            .filter((category) => category.count > 0)
            .map((category) => (
              <section className="category-section" key={category.slug}>
                <div className="category-section-heading">
                  <div>
                    <p className="eyebrow">{category.count} projects</p>
                    <h3>{category.title[locale]}</h3>
                  </div>
                  <Link className="text-link" href={`/${locale}/categories/${category.slug}`}>
                    {locale === "vi" ? "Xem tất cả" : "View all"}
                  </Link>
                </div>
                <div className="project-grid">
                  {projectsByCategory(category.slug).map((project) => (
                    <ProjectCard key={project.slug} locale={locale} project={project} />
                  ))}
                </div>
              </section>
            ))}
        </div>
      </section>

      <section className="section" id="alternatives">
        <div className="section-heading">
          <p className="eyebrow">Use cases</p>
          <h2>{t.sections.useCases}</h2>
        </div>
        <div className="use-case-grid">
          {useCases.map((useCase) => (
            <Link className="use-case" key={useCase.slug} href={`/${locale}/alternatives/${useCase.slug}`}>
              <h3>{useCase.title[locale]}</h3>
              <p>{useCase.description[locale]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="submit-band">
        <div>
          <p className="eyebrow">Review queue</p>
          <h2>{t.sections.submit}</h2>
          <p>
            {locale === "vi"
              ? "Người dùng có thể gửi project mới, bạn review rồi quyết định có đưa lên directory hay không."
              : "Users can submit new projects, then you review and decide what gets listed."}
          </p>
        </div>
        <Link className="button primary" href={`/${locale}/submit-project`}>
          {t.nav.submit}
        </Link>
      </section>
    </>
  );
}
