import { z } from "zod";
import { projects, categories, useCases } from "../data/projects";
import { compatibility, hostSchema } from "./compatibility";
import { planningCopy } from "./planning-copy";
export const advisorInputSchema = z
  .object({
    locale: z.enum(["vi", "en"]),
    host: hostSchema,
    useCase: z
      .string()
      .max(80)
      .refine((v) => v === "" || useCases.some((u) => u.slug === v))
      .optional(),
    category: z
      .string()
      .max(80)
      .refine((v) => v === "" || categories.some((c) => c.slug === v))
      .optional(),
    deploy: z
      .enum(["", "Docker", "Docker Compose", "Helm", "Binary"])
      .optional(),
    useClaude: z.boolean().default(false),
  })
  .strict();
export function advise(raw: unknown) {
  const input = advisorInputSchema.parse(raw),
    t = planningCopy[input.locale];
  const allowed = input.useCase
    ? useCases.find((u) => u.slug === input.useCase)!.projectSlugs
    : undefined;
  const choices = projects
    .filter(
      (p) =>
        (!allowed || allowed.includes(p.slug)) &&
        (!input.category || p.categorySlug === input.category) &&
        (!input.deploy || p.deploy === input.deploy),
    )
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      summary: p.summary[input.locale],
      tradeoff: p.notes[input.locale],
      reason: input.useCase ? useCases.find(u => u.slug === input.useCase)!.description[input.locale] : p.category,
      explanationSource: "catalog-editorial" as const,
      docs: p.links.docs,
      compatibility: compatibility(p, input.host),
    }))
    .filter(
      (p) =>
        p.compatibility.status !== "below-minimum" &&
        p.compatibility.status !== "architecture-mismatch",
    )
    // Curated use-case order, not an unsupported performance or popularity score.
    .sort((a, b) => allowed ? allowed.indexOf(a.slug) - allowed.indexOf(b.slug) : 0)
    .slice(0, 3)
    .map((p) => ({
      ...p,
      caveat:
        t[p.compatibility.status] +
        (p.compatibility.provenance?.kind === "estimate"
          ? " " + t.estimate
          : ""),
    }));
  return {
    mode: "deterministic" as "deterministic" | "claude-ranked",
    rankingPreview: false,
    choices,
    caveat: t.fallback,
  };
}
