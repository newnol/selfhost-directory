import { renderFullCatalog, textResponse } from "@/lib/machine-docs";

export function GET() {
  return textResponse(renderFullCatalog());
}
