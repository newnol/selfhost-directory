import { createAdvisorHandler } from "@/lib/advisor-server";
export const runtime = "nodejs";
const handler = createAdvisorHandler();
export async function POST(request: Request) {
  return handler(request);
}
