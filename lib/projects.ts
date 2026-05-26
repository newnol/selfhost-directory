import { categories, projects, useCases } from "@/data/projects";
import type { Project } from "@/data/projects";

export function projectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function projectsBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => projectBySlug(slug))
    .filter((project): project is Project => project !== undefined);
}

export function useCaseBySlug(slug: string) {
  return useCases.find((useCase) => useCase.slug === slug);
}

export function categoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function projectsByCategory(categorySlug: string) {
  return projects.filter((project) => project.categorySlug === categorySlug);
}

export function categoryProjectCounts() {
  return categories.map((category) => ({
    ...category,
    count: projectsByCategory(category.slug).length
  }));
}
