"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { ProjectCard } from "@/components/project-card";

export type ProjectCardData = {
  slug: string;
  name: string;
  iconUrl: string;
  categorySlug: string;
  category: string;
  tags: string[];
  score: number;
  deploy: "Docker" | "Docker Compose" | "Helm" | "Binary";
  summary: Record<Locale, string>;
};

type SearchFilterProps = {
  locale: Locale;
  projects: ProjectCardData[];
  placeholder: string;
};

export function SearchFilter({ locale, projects, placeholder }: SearchFilterProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? projects.filter((project) => {
        const q = query.toLowerCase();
        return (
          project.name.toLowerCase().includes(q) ||
          project.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div className="search-filter">
      <div className="search-input-wrapper">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {query.trim() && (
        <>
          <p className="search-results-heading">
            {filtered.length} {locale === "vi" ? "ket qua" : "results"}
          </p>
          <div className="project-grid">
            {filtered.map((project) => (
              <ProjectCard key={project.slug} locale={locale} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
