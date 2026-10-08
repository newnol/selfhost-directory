import { z } from "zod";
const text = z.string().trim().min(1);
const bilingual = z.object({ vi: text, en: text });
const slug = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const url = z
  .string()
  .url()
  .refine((v) => new URL(v).protocol === "https:");
const resources = z
  .object({
    cpu: z.number().finite().positive().optional(),
    ramGiB: z.number().finite().positive().optional(),
    diskGiB: z.number().finite().positive().optional(),
  })
  .strict();
export const requirementsSchema = z
  .object({
    provenance: z.discriminatedUnion("kind", [
      z.object({ kind: z.literal("estimate"), note: z.union([text, bilingual]) }).strict(),
      z
        .object({
          kind: z.literal("documented"),
          source: url,
          checkedAt: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/)
            .refine((v) => {
              const d = new Date(v);
              return (
                !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v
              );
            }),
          note: z.union([text, bilingual]),
        })
        .strict(),
    ]),
    minimum: resources.optional(),
    recommended: resources.optional(),
    architectures: z
      .array(z.enum(["amd64", "arm64"]))
      .min(1)
      .optional(),
  })
  .strict()
  .superRefine((r, ctx) => {
    for (const key of ["cpu", "ramGiB", "diskGiB"] as const)
      if (
        r.minimum?.[key] !== undefined &&
        r.recommended?.[key] !== undefined &&
        r.recommended[key]! < r.minimum[key]!
      )
        ctx.addIssue({ code: "custom", message: "recommended below minimum" });
  });
export const projectSchema = z.object({
  slug,
  name: text,
  iconUrl: url,
  categorySlug: slug,
  category: text,
  tags: z.array(text).min(1),
  stack: z.array(text).min(1),
  license: text,
  deploy: z.enum(["Docker", "Docker Compose", "Helm", "Binary"]),
  requirements: text,
  lifecycle: z.enum(["active", "archived"]).optional(),
  score: z.number().finite(),
  structuredRequirements: requirementsSchema.optional(),
  links: z.object({ source: url, docs: url, demo: url.optional() }),
  summary: bilingual,
  notes: bilingual,
  deployGuide: z.object({
    vi: z.object({ overview: text, steps: z.array(text).min(1), backup: text }),
    en: z.object({ overview: text, steps: z.array(text).min(1), backup: text }),
  }),
  deploySnippets: z.object({ dockerCompose: text, setupScript: text }),
});
const categorySchema = z.object({
  slug,
  icon: text,
  title: bilingual,
  description: bilingual,
});
const useCaseSchema = z.object({
  slug,
  title: bilingual,
  description: bilingual,
  projectSlugs: z.array(slug).min(1),
});
export function validateCatalog(
  projects: unknown,
  categories: unknown,
  useCases: unknown,
) {
  const ps = z.array(projectSchema).parse(projects),
    cs = z.array(categorySchema).parse(categories),
    us = z.array(useCaseSchema).parse(useCases);
  for (const list of [ps, cs, us])
    if (new Set(list.map((x) => x.slug)).size !== list.length)
      throw new Error("Duplicate slug");
  for (const p of ps)
    if (!cs.some((c) => c.slug === p.categorySlug))
      throw new Error("Unknown category");
  for (const u of us) {
    if (new Set(u.projectSlugs).size !== u.projectSlugs.length)
      throw new Error("Duplicate reference");
    for (const id of u.projectSlugs)
      if (!ps.some((p) => p.slug === id)) throw new Error("Unknown project");
  }
  return { projects: ps, categories: cs, useCases: us };
}
