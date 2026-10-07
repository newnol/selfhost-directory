import { projects, categories, useCases } from "../data/projects";
import { validateCatalog } from "../lib/catalog-validation";
validateCatalog(projects, categories, useCases);
console.log(
  `Catalog valid: ${projects.length} projects, ${categories.length} categories, ${useCases.length} use cases`,
);
