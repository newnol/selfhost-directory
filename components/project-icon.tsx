import type { Project } from "@/data/projects";

type ProjectIconProps = {
  project: Pick<Project, "iconUrl" | "name">;
  size?: "sm" | "lg";
};

export function ProjectIcon({ project, size = "sm" }: ProjectIconProps) {
  const className = `project-icon project-icon-${size}`;

  return (
    <span className={className}>
      <img alt={`${project.name} logo`} src={project.iconUrl} loading="lazy" decoding="async" />
    </span>
  );
}
