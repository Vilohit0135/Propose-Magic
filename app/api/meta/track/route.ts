import { NextResponse } from 'next/server';
import { sendCapiEvent } from '@/lib/meta-capi';

// POST /api/meta/track — receives a browser-fired event from
// trackMeta() and forwards it to the Meta Conversions API. The server
// adds the things only it can see reliably: the real client IP and
// user-agent. The shared event_id (set by the client) lets Meta dedupe
// this against the browser pixel's copy of the same event.
//
// Always responds 200 — tracking must never break the page.

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false });
  }

  const eventName = typeof body.event_name === 'string' ? body.event_name : '';
  const eventId = typeof body.event_id === 'string' ? body.event_id : '';
  if (!eventName || !eventId) {
    return NextResponse.json({ ok: false });
  }

  // x-forwarded-for is a comma-separated list; the first entry is the
  // original client. Vercel/most proxies populate it.
  const fwd = req.headers.get('x-forwarded-for') || '';
  const clientIp = fwd.split(',')[0]?.trim() || undefined;
  const userAgent = req.headers.get('user-agent') || undefined;

  const str = (v: unknown): string | undefined =>
    typeof v === 'string' && v.length > 0 ? v : undefined;

  await sendCapiEvent({
    eventName,
    eventId,
    eventSourceUrl: str(body.event_source_url),
    userData: {
      clientIp,
      userAgent,
      fbp: str(body.fbp),
      fbc: str(body.fbc),
      email: str(body.email),
      phone: str(body.phone),
    },
    customData:
      body.custom_data && typeof body.custom_data === 'object'
        ? (body.custom_data as Record<string, unknown>)
        : undefined,
  });

  return NextResponse.json({ ok: true });
}
