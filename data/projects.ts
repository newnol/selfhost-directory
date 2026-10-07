export type { Project, Category } from "./types";
export { categories } from "./categories";
export { useCases } from "./use-cases";
import p0 from "./projects/immich";
import p1 from "./projects/uptime-kuma";
import p2 from "./projects/vaultwarden";
import p3 from "./projects/nocodb";
import p4 from "./projects/plane";
import p5 from "./projects/open-webui";
import p6 from "./projects/jellyfin";
import p7 from "./projects/nextcloud";
import p8 from "./projects/grafana";
import p9 from "./projects/netdata";
import p10 from "./projects/authentik";
import p11 from "./projects/wg-easy";
import p12 from "./projects/n8n";
import p13 from "./projects/metabase";
import p14 from "./projects/outline";
import p15 from "./projects/vikunja";
import p16 from "./projects/ollama";
import p17 from "./projects/langfuse";

import { categories } from "./categories";
import { useCases } from "./use-cases";
import { validateCatalog } from "../lib/catalog-validation";
export const projects = [
  p0,
  p1,
  p2,
  p3,
  p4,
  p5,
  p6,
  p7,
  p8,
  p9,
  p10,
  p11,
  p12,
  p13,
  p14,
  p15,
  p16,
  p17,
];
validateCatalog(projects, categories, useCases);
export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
