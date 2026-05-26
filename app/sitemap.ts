import type { MetadataRoute } from "next";
import { categories, projects, useCases } from "@/data/projects";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://selfhost.io.vn";
  const lastModified = new Date("2025-06-01");
  const entries: MetadataRoute.Sitemap = [];

  // Home pages
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0
    });
  }

  // Project detail pages
  for (const project of projects) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/projects/${project.slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8
      });
    }
  }

  // Category pages
  for (const category of categories) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/categories/${category.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7
      });
    }
  }

  // Alternatives pages
  for (const useCase of useCases) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/alternatives/${useCase.slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7
      });
    }
  }

  return entries;
}
