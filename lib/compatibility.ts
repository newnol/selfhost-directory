import { z } from "zod";
import type { Project } from "../data/types";
import { requirementsSchema } from "./catalog-validation";
export const hostSchema = z
  .object({
    cpu: z.number().finite().positive().max(1024),
    ramGiB: z.number().finite().positive().max(65536),
    diskGiB: z.number().finite().positive().max(10000000),
    architecture: z.enum(["amd64", "arm64"]),
  })
  .strict();
export type Host = z.infer<typeof hostSchema>;
export type CompatibilityStatus =
  | "unknown"
  | "architecture-mismatch"
  | "below-minimum"
  | "minimum"
  | "recommended";
export function compatibility(
  project: Pick<Project, "structuredRequirements">,
  input: unknown,
) {
  const host = hostSchema.parse(input);
  const r = project.structuredRequirements
    ? requirementsSchema.parse(project.structuredRequirements)
    : undefined;
  const keys = ["cpu", "ramGiB", "diskGiB"] as const;
  const missing: string[] = keys.filter((k) => r?.minimum?.[k] === undefined);
  if (!r?.architectures) missing.push("architecture");
  let status: CompatibilityStatus = "unknown";
  if (r?.architectures && !r.architectures.includes(host.architecture))
    status = "architecture-mismatch";
  else if (
    keys.some((k) => r?.minimum?.[k] !== undefined && host[k] < r.minimum[k]!)
  )
    status = "below-minimum";
  else if (!missing.length)
    status = keys.every(
      (k) => r?.recommended?.[k] !== undefined && host[k] >= r.recommended[k]!,
    )
      ? "recommended"
      : "minimum";
  return { status, missing, provenance: r?.provenance };
}
