import type { Metadata } from "next";
import Link from "next/link";
import { SearchFilter } from "@/components/search-filter";
import { projects, useCases } from "@/data/projects";
import { dictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { categoryProjectCounts } from "@/lib/projects";

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

          <h1>{t.hero.title}</h1>
          <p>{t.hero.copy}</p>
          <div className="hero-actions">
            <Link className="button primary" href="#projects">
              {t.hero.primary}
            </Link>
            <Link className="button secondary" href={`/${locale}/advisor`}>
              {locale === "vi" ? "Tìm theo máy chủ" : "Find a fit for your server"}
            </Link>
          </div>
        </div>
        <nav className="topology" aria-label={locale === "vi" ? "Danh mục phần mềm" : "Software categories"}>
          <div className="topology-core"><span>SELFHOST / INDEX</span><strong>{locale === "vi" ? "Bản đồ thư mục" : "Catalog map"}</strong><small>{projects.length} {locale === "vi" ? "dự án trong thư mục" : "cataloged projects"}</small></div>
          <div className="topology-nodes">
            {categories.map((category, index) => <Link className="topology-node" key={category.slug} href={`/${locale}/categories/${category.slug}`}>
              <span className="topology-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <strong>{category.title[locale]}</strong><small>{category.count} {locale === "vi" ? "dự án" : "projects"}</small>
            </Link>)}
          </div>
        </nav>
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


      <section className="section" id="alternatives">
        <div className="section-heading">

          <h2>{t.sections.useCases}</h2>
        </div>
        <div className="use-case-grid">
          {useCases.map((useCase) => (
            <Link className="use-case" key={useCase.slug} href={`/${locale}/alternatives/${useCase.slug}`}>
              <h3>{useCase.title[locale]}</h3>
              <p>{useCase.description[locale]}</p>
              <span className="text-link">{locale === "vi" ? "Khám phá lựa chọn" : "Explore alternatives"}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="submit-band">
        <div>

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
