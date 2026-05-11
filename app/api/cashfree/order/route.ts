import { NextResponse } from 'next/server';
import { getOrderById } from '@/lib/db';
import { amountPaiseFor } from '@/lib/order';
import {
  createCashfreeOrder,
  getCashfreeConfig,
  isConfigured,
} from '@/lib/cashfree';
import { recordTransaction } from '@/lib/transactions';

// POST /api/cashfree/order
//
// Creates a Cashfree payment session for an existing order.id and writes
// an 'initiated' row to transactions. The amount is derived server-side
// from the order's package_type — the client never gets to set the price.
//
// Body: { order_id: string }
// Response: { payment_session_id, mode, cf_order_id }
//   The client passes payment_session_id + mode to cashfree-js.
export async function POST(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: 'cashfree_not_configured' },
      { status: 503 },
    );
  }

  let body: { order_id?: string };
  try {
    body = (await req.json()) as { order_id?: string };
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const orderId = typeof body.order_id === 'string' ? body.order_id : '';
  if (!orderId) {
    return NextResponse.json({ error: 'missing_order_id' }, { status: 400 });
  }

  const order = await getOrderById(orderId);
  if (!order) {
    return NextResponse.json({ error: 'order_not_found' }, { status: 404 });
  }
  if (order.status !== 'PENDING') {
    // Already paid / generating / done — refuse to create a fresh
    // session and risk a double charge.
    return NextResponse.json(
      { error: 'order_not_payable', status: order.status },
      { status: 409 },
    );
  }

  const amountPaise = amountPaiseFor(order.package_type);

  // Build URLs from the incoming request so dev (localhost) and prod
  // (proposemagic.in) both Just Work without an env var.
  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`;
  const returnUrl = `${origin}/create?cf_order_id={order_id}`;
  // Skip notify_url on localhost — Cashfree can't reach it. The
  // /api/cashfree/verify route will pick up the slack on the client
  // callback. In prod we always send notify_url.
  const isLocal =
    url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const notifyUrl = isLocal ? undefined : `${origin}/api/cashfree/webhook`;

  const cfg = getCashfreeConfig()!;

  let cfOrder;
  try {
    cfOrder = await createCashfreeOrder({
      orderId: order.id,
      amountPaise,
      customer: {
        id: order.user_uuid || order.id,
        name: order.from_name || 'ProposeMagic User',
        email: order.email,
        phone: order.from_phone || '9999999999',
      },
      returnUrl,
      notifyUrl,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'cashfree_error';
    console.error('[cashfree/order] create failed:', msg);
    return NextResponse.json({ error: 'cashfree_create_failed' }, { status: 502 });
  }

  // Record the initiation. Don't block on this — losing a log entry is
  // strictly less bad than blocking checkout.
  void recordTransaction({
    userUuid: order.user_uuid || 'anonymous',
    orderId: order.id,
    cfOrderId: cfOrder.cf_order_id,
    event: 'initiated',
    amountPaise,
    payload: cfOrder,
  });

  return NextResponse.json({
    payment_session_id: cfOrder.payment_session_id,
    cf_order_id: cfOrder.cf_order_id,
    mode: cfg.mode,
  });
}
