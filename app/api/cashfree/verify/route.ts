import { NextResponse } from 'next/server';
import { getOrderById, updateOrder } from '@/lib/db';
import { fetchCashfreeOrder, isConfigured } from '@/lib/cashfree';
import { startGeneration } from '@/lib/generation';
import { recordTransaction } from '@/lib/transactions';

// POST /api/cashfree/verify
//
// Called by the client right after the cashfree-js modal closes. The
// client says "I think payment succeeded, please verify" — and we
// verify against Cashfree's order-status API rather than trusting any
// claim. Two reasons this exists:
//
//   1. Local dev: webhooks can't reach localhost. This is the only path
//      that records 'success' and fires generation in dev.
//   2. Prod safety net: the webhook may take a few seconds to arrive.
//      Calling verify on the client callback gives the user a snappier
//      transition to the generating screen. Whichever wins inserts the
//      terminal row first; the loser gets dedup'd by the unique index.
//
// Body: { order_id: string }   (our orders.id)
// Response: { status: 'PAID' | 'PENDING' | 'FAILED', order_status?: string }
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

  // Already past PENDING (webhook beat us, or we've been called twice).
  // Just report current state.
  if (order.status !== 'PENDING') {
    return NextResponse.json({ status: order.status });
  }

  let cf;
  try {
    cf = await fetchCashfreeOrder(order.id);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'cashfree_error';
    console.error('[cashfree/verify] fetch failed:', msg);
    return NextResponse.json({ error: 'cashfree_fetch_failed' }, { status: 502 });
  }
  if (!cf) {
    // No Cashfree order under this id — caller likely jumped the gun
    // before /api/cashfree/order was hit.
    return NextResponse.json({ status: 'PENDING' });
  }

  if (cf.order_status === 'PAID') {
    const amountPaise = Math.round(cf.order_amount * 100);
    const { recorded } = await recordTransaction({
      userUuid: order.user_uuid || 'anonymous',
      orderId: order.id,
      cfOrderId: cf.cf_order_id,
      event: 'success',
      amountPaise,
      payload: cf,
    });
    if (recorded) {
      await updateOrder(order.id, {
        status: 'PAID',
        cashfree_order_id: cf.cf_order_id,
        amount_paid: amountPaise,
      });
      await startGeneration(order.id);
    }
    return NextResponse.json({ status: 'PAID' });
  }

  if (cf.order_status === 'EXPIRED' || cf.order_status === 'TERMINATED') {
    await recordTransaction({
      userUuid: order.user_uuid || 'anonymous',
      orderId: order.id,
      cfOrderId: cf.cf_order_id,
      event: 'failed',
      amountPaise: Math.round(cf.order_amount * 100),
      payload: cf,
    });
    return NextResponse.json({ status: 'FAILED', order_status: cf.order_status });
  }

  // ACTIVE / TERMINATION_REQUESTED — payment hasn't reached a terminal
  // state yet. Caller should retry or wait for the webhook.
  return NextResponse.json({ status: 'PENDING', order_status: cf.order_status });
}
