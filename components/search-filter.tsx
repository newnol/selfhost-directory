"use client";

import { useState } from "react";
import Link from "next/link";
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
  const [deploy, setDeploy] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const vi = locale === "vi";
  const q = query.trim().toLocaleLowerCase();
  const filtered = projects.filter(project => (!category || project.categorySlug === category) && (!deploy || project.deploy === deploy) &&
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
        <details className="catalog-filter-group" open>
          <summary>{vi ? "Bộ lọc" : "Filters"}{category || deploy ? ` · ${vi ? "Đang áp dụng" : "Active"}` : ""}</summary>
          <div className="catalog-filter-fields">
        <label>{vi ? "Danh mục" : "Category"}
          <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">{vi ? "Tất cả danh mục" : "All categories"}</option>
            {categories.map(item => <option key={item.slug} value={item.slug}>{item.title[locale]}</option>)}
          </select>
        </label>
        <label>{vi ? "Triển khai" : "Deployment"}<select name="deploy" value={deploy} onChange={e => setDeploy(e.target.value)}><option value="">{vi ? "Tất cả cách triển khai" : "All deployments"}</option>{["Docker", "Docker Compose", "Helm", "Binary"].map(value => <option key={value}>{value}</option>)}</select></label>
        </div></details>
        <button className="button secondary" type="button" disabled={!query && !category && !deploy} onClick={() => { setQuery(""); setCategory(""); setDeploy(""); }}>{vi ? "Đặt lại" : "Reset filters"}</button>
      </div>
      <p className="search-results-heading" role="status">{filtered.length} {vi ? "dự án" : "projects"}</p>
      <div className="catalog-compare" aria-label={vi ? "Chọn dự án để so sánh" : "Compare selection"}><p role="status">{selected.length}/3 {vi ? "đã chọn để so sánh" : "selected to compare"}</p>{selected.map(id => <button type="button" className="compare-chip" key={id} onClick={() => setSelected(selected.filter(item => item !== id))} aria-label={`${vi ? "Bỏ chọn" : "Remove"} ${projects.find(p => p.slug === id)!.name}`}>{projects.find(p => p.slug === id)!.name} ×</button>)}{selected.length >= 2 ? <Link className="button primary" href={`/${locale}/compare?projects=${selected.join(",")}`}>{vi ? "So sánh" : "Compare selected"}</Link> : null}<span id="catalog-compare-help">{vi ? "Chọn 2–3 dự án" : "Choose 2–3 projects"}</span></div>
      {filtered.length ? <div className="project-grid">{filtered.map(project => <div className="catalog-item" key={project.slug}><ProjectCard locale={locale} project={project} /><label className="card-compare"><input name="compare-project" aria-describedby="catalog-compare-help" type="checkbox" checked={selected.includes(project.slug)} disabled={selected.length === 3 && !selected.includes(project.slug)} onChange={() => setSelected(current => current.includes(project.slug) ? current.filter(id => id !== project.slug) : current.length < 3 ? [...current, project.slug] : current)} />{vi ? "So sánh" : "Compare"} {project.name}</label></div>)}</div> :
        <div className="empty-state"><h3>{vi ? "Không tìm thấy dự án" : "No projects found"}</h3><p>{vi ? "Thử từ khóa khác hoặc đặt lại bộ lọc." : "Try another keyword or reset your filters."}</p></div>}
    </section>
  );
}
