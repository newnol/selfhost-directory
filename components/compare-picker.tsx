"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
type Option = { slug: string; name: string; category: string };
export function ComparePicker({ locale, projects, initial = [] }: { locale: Locale; projects: Option[]; initial?: string[] }) {
  const vi = locale === "vi";
  const [selected, setSelected] = useState(() => [...new Set(initial)].filter(id => projects.some(p => p.slug === id)).slice(0, 3));
  const [query, setQuery] = useState("");
  const filtered = projects.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  function toggle(id: string) { setSelected(current => current.includes(id) ? current.filter(item => item !== id) : current.length < 3 ? [...current, id] : current); }
  return <form method="get" className="planning-panel compare-picker" onSubmit={e => { if (selected.length < 2 || selected.length > 3) e.preventDefault(); }}>
    <label htmlFor="compare-search">{vi ? "Tìm dự án để so sánh" : "Find projects to compare"}</label>
    <input id="compare-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={vi ? "Tên hoặc danh mục" : "Name or category"} />
    <p id="compare-help" role="status">{selected.length}/3 {vi ? "đã chọn · Chọn 2–3 dự án." : "selected · Choose 2–3 projects."}</p>
    <div className="compare-chips">{selected.map(id => <button className="compare-chip" type="button" key={id} onClick={() => toggle(id)} aria-label={`${vi ? "Bỏ chọn" : "Remove"} ${projects.find(p => p.slug === id)!.name}`}>{projects.find(p => p.slug === id)!.name} <span aria-hidden="true">×</span></button>)}</div>
    <fieldset className="compare-options" aria-describedby="compare-help"><legend>{vi ? "Dự án trong thư mục" : "Catalog projects"}</legend>
      {projects.map(p => <label key={p.slug} hidden={!filtered.includes(p)}><input type="checkbox" name="projects" value={p.slug} checked={selected.includes(p.slug)} disabled={selected.length === 3 && !selected.includes(p.slug)} onChange={() => toggle(p.slug)} /><span><strong>{p.name}</strong><small>{p.category}</small></span></label>)}
    </fieldset>
    {!filtered.length && <p>{vi ? "Không tìm thấy dự án. Thử từ khóa khác." : "No projects found. Try another keyword."}</p>}
    <div className="picker-actions"><button type="submit" disabled={selected.length < 2}>{vi ? "So sánh dự án" : "Compare projects"}</button><button className="picker-reset" type="button" disabled={!selected.length && !query} onClick={() => { setSelected([]); setQuery(""); }}>{vi ? "Đặt lại" : "Clear selection"}</button></div>
  </form>;
}
