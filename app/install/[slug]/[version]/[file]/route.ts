import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-static";
const files = ["install.sh", "SHA256SUMS", "metadata.json"] as const;
export function generateStaticParams() {
  return files.map((file) => ({ slug: "uptime-kuma", version: "v1", file }));
}
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string; version: string; file: string }> }) {
  const { slug, version, file } = await params;
  if (slug !== "uptime-kuma" || version !== "v1" || !files.includes(file as typeof files[number])) {
    return new Response("Installer artifact not found\n", { status: 404 });
  }
  const bytes = await readFile(join(process.cwd(), "installers", "uptime-kuma", "v1", file));
  return new Response(new Uint8Array(bytes), { headers: {
    "Content-Type": file === "metadata.json" ? "application/json; charset=utf-8" : "text/plain; charset=utf-8",
    "Content-Disposition": `attachment; filename="${file}"`,
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  } });
}
