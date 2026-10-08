import { renderIndex, textResponse } from "@/lib/machine-docs";

export function GET() {
  return textResponse(renderIndex());
}
