"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { categories } from "@/data/categories";
import { ProjectCard } from "@/components/project-card";

export type ProjectCardData = {
  slug: string; name: string; iconUrl: string; categorySlug: string; category: string;
  tags: string[]; score: number;
  deploy: "Docker" | "Docker Compose" | "Helm" | "Binary";
  summary: Record<Locale, string>;
};
type SearchFilterProps = { locale: Locale; projects: ProjectCardData[]; placeholder: string };

export function SearchFilter({ locale, projects, placeholder }: SearchFilterProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const vi = locale === "vi";
  const q = query.trim().toLocaleLowerCase();
  const filtered = projects.filter(project => (!category || project.categorySlug === category) &&
    (!q || [project.name, project.summary[locale], ...project.tags].some(value => value.toLocaleLowerCase().includes(q))));
  return (
    <section className="search-filter section" id="projects" aria-labelledby="catalog-title">
      <div className="section-heading catalog-heading">
        <div><p className="eyebrow">{vi ? "Thư mục phần mềm" : "The directory"}</p>
          <h2 id="catalog-title">{vi ? "Tìm công cụ phù hợp." : "Find your next tool."}</h2></div>
        <p>{vi ? "Khám phá phần mềm. Kiểm tra yêu cầu. Tự triển khai." : "Explore the software. Check the requirements. Make it yours."}</p>
      </div>
      <div className="catalog-controls">
        <label htmlFor="catalog-search">{vi ? "Tìm kiếm dự án" : "Search projects"}
          <div className="search-input-wrapper">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input id="catalog-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={placeholder} />
          </div>
        </label>
        <label>{vi ? "Danh mục" : "Category"}
          <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">{vi ? "Tất cả danh mục" : "All categories"}</option>
            {categories.map(item => <option key={item.slug} value={item.slug}>{item.title[locale]}</option>)}
          </select>
        </label>
        <button className="button secondary" type="button" disabled={!query && !category} onClick={() => { setQuery(""); setCategory(""); }}>{vi ? "Đặt lại" : "Reset filters"}</button>
      </div>
      <p className="search-results-heading" role="status">{filtered.length} {vi ? "dự án" : "projects"}</p>
      {filtered.length ? <div className="project-grid">{filtered.map(project => <ProjectCard key={project.slug} locale={locale} project={project} />)}</div> :
        <div className="empty-state"><h3>{vi ? "Không tìm thấy dự án" : "No projects found"}</h3><p>{vi ? "Thử từ khóa khác hoặc đặt lại bộ lọc." : "Try another keyword or reset your filters."}</p></div>}
    </section>
  );
}
