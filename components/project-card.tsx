import Link from "next/link";
import type { ProjectCardData } from "@/components/search-filter";
import type { Locale } from "@/lib/i18n";
import { ProjectIcon } from "@/components/project-icon";

type ProjectCardProps = {
  locale: Locale;
  project: ProjectCardData;
};

export function ProjectCard({ locale, project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <div className="project-card-top">
        <div className="project-title-row">
          <ProjectIcon project={project} />
          <div>
            <p className="eyebrow">{project.category}</p>
            <h3>{project.name}</h3>
          </div>
        </div>
      </div>
      <p>{project.summary[locale]}</p>
      <div className="tag-row">
        {project.tags.slice(0, 3).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <Link className="text-link" href={`/${locale}/projects/${project.slug}`}>
          {locale === "vi" ? "Xem chi tiết" : "View details"}
        </Link>
        <span className="deploy-badge">{project.deploy}</span>
      </div>
    </article>
  );
}
