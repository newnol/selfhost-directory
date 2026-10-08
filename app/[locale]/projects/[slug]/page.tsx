import { InstallPanel } from "@/components/install-panel";
import { CompatibilityCalculator } from "@/components/compatibility-calculator";
import { planningCopy } from "@/lib/planning-copy";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyCodeBlock } from "@/components/copy-code-block";
import { ProjectIcon } from "@/components/project-icon";
import { projects } from "@/data/projects";
import { dictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { projectBySlug } from "@/lib/projects";

export function generateStaticParams() {
  return projects.flatMap((project) => [
    { locale: "vi", slug: project.slug },
    { locale: "en", slug: project.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "vi";
  const project = projectBySlug(slug);
  if (!project) {
    return {};
  }
  const title = `${project.name} - Selfhost Directory`;
  const description = project.summary[locale];
  const alternateLanguages: Record<string, string> = {};
  for (const l of locales) {
    alternateLanguages[l] = `https://selfhost.io.vn/${l}/projects/${slug}`;
  }
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://selfhost.io.vn/${locale}/projects/${slug}`,
      locale: locale === "vi" ? "vi_VN" : "en_US",
    },
    alternates: {
      canonical: `https://selfhost.io.vn/${locale}/projects/${slug}`,
      languages: alternateLanguages,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "vi";
  const project = projectBySlug(slug);

  if (!project) {
    notFound();
  }

  const t = dictionary[locale].project;

  return (
    <article className="detail-page">
      <div className="detail-hero">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href={`/${locale}`}>
            {locale === "vi" ? "Trang chủ" : "Home"}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <Link href={`/${locale}/categories/${project.categorySlug}`}>
            {project.category}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span>{project.name}</span>
        </nav>
        <ProjectIcon project={project} size="lg" />
        <Link
          className="eyebrow-link"
          href={`/${locale}/categories/${project.categorySlug}`}
        >
          {project.category}
        </Link>
        <h1>{project.name}</h1>
        {project.lifecycle === "archived" && <p role="alert" data-lifecycle="archived">{locale === "vi" ? "Dự án đã lưu trữ: không còn bản vá bảo mật. Không khuyến nghị triển khai mới." : "Archived: no further security fixes. Not recommended for new deployments."}</p>}
        <p>{project.summary[locale]}</p>
      </div>

      <div className="detail-grid">
        <section className="detail-main">
          <CompatibilityCalculator
            locale={locale}
            requirements={project.structuredRequirements}
          />
          <h2>{locale === "vi" ? "Ghi chú review" : "Review notes"}</h2>
          <p>{project.notes[locale]}</p>

          {project.slug !== "uptime-kuma" && <>
          <h2>{locale === "vi" ? "Hướng dẫn deploy" : "Deployment guide"}</h2>
          <p>{project.deployGuide[locale].overview}</p>
          <ol className="deploy-steps">
            {project.deployGuide[locale].steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="backup-note">
            <strong>{locale === "vi" ? "Backup:" : "Backup:"}</strong>
            <span>{project.deployGuide[locale].backup}</span>
          </div>
          </>}

          <InstallPanel slug={project.slug} docsUrl={project.links.docs} locale={locale} />
          {project.slug !== "uptime-kuma" && <section className="copy-run-section">
            <div className="copy-run-heading">
              <h2>{planningCopy[locale].warning}</h2>
              <p>{planningCopy[locale].secrets}</p>
            </div>
            <CopyCodeBlock
              code={project.deploySnippets.dockerCompose}
              label="docker-compose.yml"
              language="yaml"
              copyLabel={locale === "vi" ? "Copy" : "Copy"}
              copiedLabel={locale === "vi" ? "Đã copy" : "Copied"}
            />
            <CopyCodeBlock
              code={project.deploySnippets.setupScript}
              label="setup.sh"
              language="bash"
              copyLabel={locale === "vi" ? "Copy" : "Copy"}
              copiedLabel={locale === "vi" ? "Đã copy" : "Copied"}
            />
          </section>}

          <h2>{t.stack}</h2>
          <div className="tag-row">
            {project.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>
        <aside className="meta-panel">
          <dl>
            <div>
              <dt>{t.license}</dt>
              <dd>{project.license}</dd>
            </div>
            <div>
              <dt>{t.deploy}</dt>
              <dd>{project.deploy}</dd>
            </div>
            <div>
              <dt>{t.requirements}</dt>
              <dd>
                {project.requirements}
                <br />
                {planningCopy[locale].estimate}
              </dd>
            </div>
          </dl>
          <div className="resource-links">
            <a href={project.links.source} rel="noreferrer" target="_blank">
              {t.source}
            </a>
            <a href={project.links.docs} rel="noreferrer" target="_blank">
              {t.docs}
            </a>
            {project.links.demo ? (
              <a href={project.links.demo} rel="noreferrer" target="_blank">
                {t.demo}
              </a>
            ) : null}
          </div>
        </aside>
      </div>
    </article>
  );
}
