export function GET() {
  return new Response(null, { status: 308, headers: { Location: "https://selfhost.io.vn/llms.txt" } });
}
