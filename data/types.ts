import type { Locale } from "@/lib/i18n";

export type Project = {
  slug: string;
  name: string;
  iconUrl: string;
  categorySlug: string;
  category: string;
  tags: string[];
  stack: string[];
  license: string;
  deploy: "Docker" | "Docker Compose" | "Helm" | "Binary";
  requirements: string; // Legacy editorial estimate, unverified.
  structuredRequirements?: import("zod").infer<
    typeof import("../lib/catalog-validation").requirementsSchema
  >;
  score: number;
  links: {
    source: string;
    docs: string;
    demo?: string;
  };
  summary: Record<Locale, string>;
  notes: Record<Locale, string>;
  deployGuide: Record<
    Locale,
    {
      overview: string;
      steps: string[];
      backup: string;
    }
  >;
  deploySnippets: {
    dockerCompose: string;
    setupScript: string;
  };
};

export type Category = {
  slug: string;
  icon: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
};
