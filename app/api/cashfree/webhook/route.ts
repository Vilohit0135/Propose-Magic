import { NextResponse } from 'next/server';
import { getOrderById, updateOrder } from '@/lib/db';
import {
  type CashfreeWebhookPayload,
  isConfigured,
  verifyWebhookSignature,
} from '@/lib/cashfree';
import { startGeneration } from '@/lib/generation';
import { recordTransaction } from '@/lib/transactions';

// POST /api/cashfree/webhook
//
// Cashfree posts payment lifecycle events here. We:
//   1. Verify the HMAC signature against the raw body
//   2. Decide success vs failed from data.payment.payment_status
//   3. Record a transactions row (idempotent via unique index)
//   4. On first 'success': update orders + fire generation
//
// Cashfree retries failed deliveries — we MUST be idempotent. The DB
// unique index on (cf_order_id, event) for terminal events makes this
// trivial: a duplicate insert returns 23505 and we skip the side-effects.
export async function POST(req: Request) {
  if (!isConfigured()) {
    // No secret to verify against — refuse rather than silently accept.
    return NextResponse.json(
      { error: 'cashfree_not_configured' },
      { status: 503 },
    );
  }

  const rawBody = await req.text();
  const sig = req.headers.get('x-webhook-signature');
  const ts = req.headers.get('x-webhook-timestamp');

  if (!verifyWebhookSignature(rawBody, sig, ts)) {
    console.warn('[cashfree/webhook] bad signature', {
      hasSig: !!sig,
      hasTs: !!ts,
    });
    return NextResponse.json({ error: 'bad_signature' }, { status: 401 });
  }

  let payload: CashfreeWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as CashfreeWebhookPayload;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const ourOrderId = payload?.data?.order?.order_id;
  const cfPaymentId = String(payload?.data?.payment?.cf_payment_id ?? '');
  const paymentStatus = payload?.data?.payment?.payment_status;
  const amountRupees = Number(payload?.data?.payment?.payment_amount ?? 0);
  if (!ourOrderId) {
    return NextResponse.json({ error: 'missing_order_id' }, { status: 400 });
  }

  const order = await getOrderById(ourOrderId);
  if (!order) {
    // Not our order — could be a stale webhook from a deleted order.
    // Acknowledge with 200 so Cashfree stops retrying.
    return NextResponse.json({ ok: true, ignored: 'unknown_order' });
  }

  const event = paymentStatus === 'SUCCESS' ? 'success' : 'failed';
  const { recorded } = await recordTransaction({
    userUuid: order.user_uuid || 'anonymous',
    orderId: order.id,
    cfOrderId: ourOrderId,
    cfPaymentId,
    event,
    amountPaise: Math.round(amountRupees * 100),
    payload,
  });

  // Only the first writer of the terminal event runs the side effects.
  // Webhook + verify race; whichever lands first wins.
  if (recorded && event === 'success') {
    await updateOrder(order.id, {
      status: 'PAID',
      cashfree_order_id: ourOrderId,
      cashfree_payment_id: cfPaymentId || null,
      amount_paid: Math.round(amountRupees * 100),
    });
    await startGeneration(order.id);
  }

  return NextResponse.json({ ok: true });
}
