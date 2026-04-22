import { NextResponse } from 'next/server';
import { addRefundRequest } from '@/lib/refund-store';

function str(v: unknown, max = 200): string {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const name = str(body.name, 100);
  const email = str(body.email, 200);
  const order_short_id = str(body.order_short_id, 20);
  const reason = str(body.reason, 2000);

  if (!name) {
    return NextResponse.json({ error: 'missing_name' }, { status: 400 });
  }
  if (!email.includes('@') || email.length < 5) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }
  if (!order_short_id) {
    return NextResponse.json({ error: 'missing_order_id' }, { status: 400 });
  }
  if (reason.length < 5) {
    return NextResponse.json({ error: 'reason_too_short' }, { status: 400 });
  }

  const request = addRefundRequest({ name, email, order_short_id, reason });

  // TODO(nodemailer): send refund notification to refunds@proposemagic.in and
  // confirmation to {email}. For now we log; the request is stored for later.
  console.log('[refund] new request', {
    id: request.id,
    name: request.name,
    email: request.email,
    order_short_id: request.order_short_id,
    reason_preview: request.reason.slice(0, 80),
  });

  return NextResponse.json({ ok: true, id: request.id });
}
