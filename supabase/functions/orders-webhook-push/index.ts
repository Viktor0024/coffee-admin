// Supabase Edge Function: Database Webhook (UPDATE orders) → Expo Push
// Invoke from Database Webhook: POST, table orders, events: UPDATE

declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response>) => unknown;
};

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface WebhookPayload {
  type: string;
  table: string;
  schema: string;
  record: { id?: string; status?: string; push_token?: string | null } | null;
  old_record: { id?: string; status?: string; push_token?: string | null } | null;
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let payload: WebhookPayload;
  try {
    payload = (await req.json()) as WebhookPayload;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (payload.type !== "UPDATE" || payload.table !== "orders") {
    return new Response(JSON.stringify({ ok: true, skipped: "not orders UPDATE" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const record = payload.record;
  const oldRecord = payload.old_record;

  if (!record?.status || oldRecord?.status === undefined) {
    return new Response(JSON.stringify({ ok: true, skipped: "no status change" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (oldRecord.status === record.status) {
    return new Response(JSON.stringify({ ok: true, skipped: "status unchanged" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Пуш только когда заказ готов — не при других сменах статуса
  if (record.status !== "ready") {
    return new Response(JSON.stringify({ ok: true, skipped: "push only when ready" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const pushToken =
    (record.push_token && record.push_token.trim()) ||
    (oldRecord?.push_token && oldRecord.push_token.trim());
  if (!pushToken) {
    return new Response(JSON.stringify({ ok: true, skipped: "no push_token" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const title = "Замовлення готове";
  const body = "Можете забрати.";

  const expoBody = {
    to: pushToken,
    title,
    body,
    data: { orderId: record.id, status: record.status },
  };

  try {
    const res = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(expoBody),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error("Expo Push error", res.status, text);
      return new Response(
        JSON.stringify({ error: "Expo Push failed", status: res.status, detail: text }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }
    const data = text ? JSON.parse(text) : {};
    return new Response(JSON.stringify({ ok: true, expo: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Expo Push request failed", e);
    return new Response(
      JSON.stringify({ error: "Expo Push request failed", message: String(e) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
});
