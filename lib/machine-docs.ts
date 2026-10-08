import { projects } from "../data/projects";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

const installerEvidenceSchema = z.object({
  slug: z.string(), version: z.literal("v1"), status: z.string(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/), checkedAt: z.string(),
  validation: z.string(), platforms: z.record(z.string(), z.string())
});

function installerEvidence(project: Project): string[] {
  const directory = join(process.cwd(), "installers", project.slug, "v1");
  const manifest = join(directory, "metadata.json");
  if (!existsSync(manifest) || !existsSync(join(directory, "install.sh"))) return [];
  let contents: unknown;
  try { contents = JSON.parse(readFileSync(manifest, "utf8")); }
  catch { return []; } // Optional evidence must not take public documents offline.
  const result = installerEvidenceSchema.safeParse(contents);
  if (!result.success || result.data.slug !== project.slug) return [];
  const metadata = result.data;
  const base = `${publicOrigin}/install/${project.slug}/v1`;
  return [
    "## Experimental pilot installer",
    `- Shell artifact (download and inspect; not a deployment guarantee): ${base}/install.sh`,
    `- Manifest: ${base}/metadata.json`,
    `- Checksums: ${base}/SHA256SUMS`,
    `- SHA-256: ${metadata.sha256}`,
    `- Status: ${metadata.status}`,
    `- Installer evidence checked date: ${metadata.checkedAt}`,
    `- Validation: ${metadata.validation}`,
    ...Object.entries(metadata.platforms).map(([platform, caveat]) => `- ${platform}: ${caveat}`),
    ""
  ];
}
import { locales, isLocale, type Locale } from "./i18n";

export function textResponse(body: string, status = 200, markdown = false) {
  return new Response(body, { status, headers: {
    "Content-Type": `${markdown ? "text/markdown" : "text/plain"}; charset=utf-8`,
    "X-Content-Type-Options": "nosniff"
  } });
}

export function createProjectMarkdownHandler(slug: string) {
  return async (_request: Request, context: { params: Promise<{ locale: string }> }) => {
    const { locale } = await context.params;
    return projectMarkdownResponse(locale, slug);
  };
}

export function projectMarkdownResponse(locale: string, slug: string) {
  const project = projects.find((entry) => entry.slug === slug);
  if (!isLocale(locale) || !project) return textResponse("Not found\n", 404);
  return textResponse(renderProject(project, locale), 200, true);
}
import type { Project } from "../data/types";

export function renderProject(project: Project, locale: Locale) {
  const requirements = project.structuredRequirements;
  const provenance = requirements?.provenance;
  const note = provenance?.note;
  const guide = project.deployGuide[locale];
  return [
    `# ${project.name} (${locale})`, "",
    `Canonical page: ${publicOrigin}/${locale}/projects/${project.slug}`,
    `Markdown: ${publicOrigin}/${locale}/projects/${project.slug}.md`,
    `Language: ${locale}`, "",
    project.summary[locale], "",
    "## Catalog metadata",
    `- Category: ${project.category}`,
    `- Tags: ${project.tags.join(", ")}`,
    `- Stack: ${project.stack.join(", ")}`,
    `- License (catalog label; consult upstream terms): ${project.license}`,
    `- Lifecycle: ${project.lifecycle ?? "unknown"}`,
    "- Lifecycle and license checked date: unknown (not separately recorded)",
    `- Official source: ${project.links.source}`,
    `- Official documentation: ${project.links.docs}`, "",
    "## Requirements and evidence",
    `- Provenance: ${provenance?.kind ?? "unknown"}`,
    `- Source: ${provenance?.kind === "documented" ? provenance.source : "unknown; editorial estimate, not an upstream requirement"}`,
    `- Checked date: ${provenance?.kind === "documented" ? provenance.checkedAt : "unknown"}`,
    "- Missing fields mean unknown, not zero. Documented thresholds are not runtime validation or a production sizing guarantee.",
    `- Catalog requirement summary (editorial, not independently verified): ${project.requirements}`,
    ...(["minimum", "recommended"] as const).flatMap((level) => [
      `### ${level}`,
      `- CPU (cores): ${requirements?.[level]?.cpu ?? "unknown"}`,
      `- RAM (GiB): ${requirements?.[level]?.ramGiB ?? "unknown"}`,
      `- Disk (GiB): ${requirements?.[level]?.diskGiB ?? "unknown"}`,
    ]),
    `- Architectures (catalog evidence only): ${requirements?.architectures?.join(", ") ?? "unknown"}`,
    `- Evidence caveat: ${typeof note === "string" ? note : note?.[locale] ?? "No structured evidence recorded."}`, "",
    "## Notes", project.notes[locale], "",
    "## Deployment guidance",
    `- Deployment method: ${project.deploy}`,
    "- Deployment verification: unverified",
    locale === "vi"
      ? "Hướng dẫn biên tập chưa được kiểm thử triển khai. Đọc tài liệu chính thức hiện hành; kiểm tra secrets, image, cổng mạng, HTTPS và bản sao lưu trước khi triển khai."
      : "Editorial guidance has not been runtime-tested. Follow current official documentation; review secrets, images, network ports, HTTPS and backups before deployment.",
    guide.overview,
    ...guide.steps.map((step, i) => `${i + 1}. ${step}`),
    `Backup: ${guide.backup}`, "",
    ...installerEvidence(project),
    "Executable snippets, private configuration and user submissions are intentionally excluded.", ""
  ].join("\n");
}

export function renderFullCatalog() {
  return `${renderIndex()}\n---\n\n${projects.flatMap((project) => locales.map((locale) => renderProject(project, locale))).join("\n---\n\n")}`;
}

export const publicOrigin = "https://selfhost.io.vn";

export function renderIndex() {
  return [
    "# Selfhost",
    "",
    "> A bilingual catalog of self-hostable software. Public catalog only; no submissions or private configuration.",
    "",
    "Canonical index: https://selfhost.io.vn/llms.txt",
    "Full catalog: https://selfhost.io.vn/llms-full.txt",
    "",
    "## Projects",
    ...projects.flatMap((project) => locales.map((locale) =>
      `- [${project.name} (${locale})](${publicOrigin}/${locale}/projects/${project.slug}.md): ${project.summary[locale]}`)),
    ""
  ].join("\n");
}
