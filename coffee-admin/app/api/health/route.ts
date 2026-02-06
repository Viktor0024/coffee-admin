/**
 * Health check для Render и мониторинга.
 * GET /api/health → { status: "ok" }
 */
export async function GET() {
  return Response.json({ status: "ok" });
}
