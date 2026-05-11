import { getSupabase } from './supabase';

// Append-only payment event log. One row per lifecycle event:
//   'initiated' — written when we ask Cashfree to create an order
//   'success'   — written when Cashfree confirms payment (webhook OR verify)
//   'failed'    — written when Cashfree confirms failure / drop / cancel
//
// The (cf_order_id, event) unique index for terminal events makes this
// idempotent: the webhook and the verify-route can both try to insert
// the same 'success' row, and the DB will dedupe to the first writer.
// Returns true if this call was the one that wrote the terminal row
// (so the caller knows to fire side-effects like generation).

export type TxEvent = 'initiated' | 'success' | 'failed';

export type RecordTxInput = {
  userUuid: string;
  orderId: string | null;        // our order.id, nullable for orphan logs
  cfOrderId: string;
  cfPaymentId?: string | null;
  event: TxEvent;
  amountPaise: number;
  currency?: string;
  payload?: unknown;
};

// Returns:
//   { recorded: true }  — this call inserted a new row
//   { recorded: false } — dedup'd by the unique index (terminal already exists)
//
// For 'initiated' events the unique index doesn't apply, so recorded is
// always true. Callers that care about side-effect-on-first-success
// should check recorded === true.
export async function recordTransaction(
  input: RecordTxInput,
): Promise<{ recorded: boolean }> {
  const sb = getSupabase();
  if (!sb) {
    // Memory-only dev mode — nothing to persist; pretend we recorded
    // so generation still fires on the verify path.
    return { recorded: true };
  }

  const row = {
    user_uuid: input.userUuid,
    order_id: input.orderId,
    cf_order_id: input.cfOrderId,
    cf_payment_id: input.cfPaymentId ?? null,
    event: input.event,
    amount: input.amountPaise,
    currency: input.currency || 'INR',
    payload: input.payload ?? null,
  };

  const { error } = await sb.from('transactions').insert(row);
  if (!error) return { recorded: true };

  // 23505 = unique_violation — the terminal row already exists. This is
  // expected and is the whole point of the partial unique index.
  if (error.code === '23505') return { recorded: false };

  // Any other error is a real failure. Don't throw — we never want a
  // logging hiccup to break the payment flow. Log and move on.
  console.error('[transactions] insert failed:', error);
  return { recorded: false };
}
