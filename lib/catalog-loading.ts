import { validateCatalog } from "./catalog-validation";

/** Parse declarative catalog data at the boundary before exposing it to the app. */
export function loadCatalog(projects: unknown, categories: unknown, useCases: unknown) {
  return validateCatalog(projects, categories, useCases);
}
