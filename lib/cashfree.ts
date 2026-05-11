import crypto from 'crypto';

// Server-side Cashfree PG client. Direct REST against the documented
// API surface — no SDK dependency. Toggles between sandbox (test) and
// production via the CASHFREE_ENV env var.
//
// Why no SDK? The official cashfree-pg npm package has flaky ESM/CJS
// interop with Next.js App Router and the API surface is small enough
// that fetch + types here is cleaner than wrestling with the wrapper.

const API_VERSION = '2023-08-01';

export type CashfreeMode = 'sandbox' | 'production';

export type CashfreeConfig = {
  mode: CashfreeMode;
  appId: string;
  secretKey: string;
  apiBase: string;
};

export function getCashfreeConfig(): CashfreeConfig | null {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  if (!appId || !secretKey) return null;
  const envFlag = (process.env.CASHFREE_ENV || 'TEST').toUpperCase();
  const mode: CashfreeMode = envFlag === 'PROD' ? 'production' : 'sandbox';
  const apiBase =
    mode === 'production'
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg';
  return { mode, appId, secretKey, apiBase };
}

export function isConfigured(): boolean {
  return getCashfreeConfig() !== null;
}

function authHeaders(cfg: CashfreeConfig): HeadersInit {
  return {
    'x-api-version': API_VERSION,
    'x-client-id': cfg.appId,
    'x-client-secret': cfg.secretKey,
    'content-type': 'application/json',
  };
}

export type CreateOrderInput = {
  orderId: string;            // our order.id (uuid). Cashfree allows up to 50 chars.
  amountPaise: number;        // server-derived; never trust client
  currency?: string;          // defaults INR
  customer: {
    id: string;               // our user_uuid
    name: string;
    email: string;
    phone: string;            // E.164 or 10-digit Indian — Cashfree is lenient
  };
  notifyUrl?: string;         // webhook destination (omit if no public URL in dev)
  returnUrl: string;          // where Cashfree redirects after upi/netbanking
};

export type CreateOrderResponse = {
  cf_order_id: string;        // Cashfree's internal id
  order_id: string;           // echoes back our id
  payment_session_id: string; // client passes this to cashfree-js
  order_status: string;
};

// Cashfree wants the phone in a permissive form. Strip everything but
// digits, then drop a leading 91 (country code) if the result is 12
// digits — gives us the 10-digit local number their checkout expects.
// Falls back to the raw input if we can't normalize.
function normalizePhoneForCashfree(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 10) return digits;
  // Cashfree accepts +91xxxxxxxxxx for non-Indian flows; pass-through.
  return raw.trim() || '9999999999';
}

export async function createCashfreeOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResponse> {
  const cfg = getCashfreeConfig();
  if (!cfg) throw new Error('cashfree_not_configured');

  // Cashfree's API expects amount as a decimal number in major units
  // (rupees with up to 2 dp), not paise.
  const amount = +(input.amountPaise / 100).toFixed(2);

  const body: Record<string, unknown> = {
    order_id: input.orderId,
    order_amount: amount,
    order_currency: input.currency || 'INR',
    customer_details: {
      customer_id: input.customer.id,
      customer_name: input.customer.name.slice(0, 50),
      customer_email: input.customer.email.slice(0, 100),
      customer_phone: normalizePhoneForCashfree(input.customer.phone),
    },
    order_meta: {
      return_url: input.returnUrl,
      ...(input.notifyUrl ? { notify_url: input.notifyUrl } : {}),
    },
  };

  const resp = await fetch(`${cfg.apiBase}/orders`, {
    method: 'POST',
    headers: authHeaders(cfg),
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`cashfree_create_failed:${resp.status}:${text.slice(0, 200)}`);
  }
  return (await resp.json()) as CreateOrderResponse;
}

export type CashfreeOrderStatus = {
  cf_order_id: string;
  order_id: string;
  order_status: 'ACTIVE' | 'PAID' | 'EXPIRED' | 'TERMINATED' | 'TERMINATION_REQUESTED';
  order_amount: number;
  order_currency: string;
};

export async function fetchCashfreeOrder(
  orderId: string,
): Promise<CashfreeOrderStatus | null> {
  const cfg = getCashfreeConfig();
  if (!cfg) throw new Error('cashfree_not_configured');

  const resp = await fetch(`${cfg.apiBase}/orders/${encodeURIComponent(orderId)}`, {
    method: 'GET',
    headers: authHeaders(cfg),
  });
  if (resp.status === 404) return null;
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`cashfree_get_failed:${resp.status}:${text.slice(0, 200)}`);
  }
  return (await resp.json()) as CashfreeOrderStatus;
}

// Webhook signature verification per Cashfree docs:
//   signature = base64(HMAC_SHA256(secret_key, timestamp + raw_body))
// We compare against the x-webhook-signature header. raw_body MUST be the
// exact bytes Cashfree posted — JSON.stringify(parsed) loses key order
// and whitespace and will fail.
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  timestampHeader: string | null,
): boolean {
  if (!signatureHeader || !timestampHeader) return false;
  const cfg = getCashfreeConfig();
  if (!cfg) return false;

  const signedPayload = timestampHeader + rawBody;
  const computed = crypto
    .createHmac('sha256', cfg.secretKey)
    .update(signedPayload)
    .digest('base64');

  // Constant-time compare to avoid signature-timing oracles.
  if (computed.length !== signatureHeader.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(computed),
    Buffer.from(signatureHeader),
  );
}

// Webhook payload shape (subset — Cashfree sends many fields, we only
// read the ones we care about). Both PAYMENT_SUCCESS and PAYMENT_FAILED
// share this skeleton; outcome distinguished by `data.payment.payment_status`.
export type CashfreeWebhookPayload = {
  type: string; // e.g. 'PAYMENT_SUCCESS_WEBHOOK', 'PAYMENT_FAILED_WEBHOOK'
  data: {
    order: {
      order_id: string;
      order_amount: number;
      order_currency: string;
    };
    payment: {
      cf_payment_id: string | number;
      payment_status: 'SUCCESS' | 'FAILED' | 'USER_DROPPED' | 'PENDING' | 'NOT_ATTEMPTED' | 'CANCELLED' | 'VOID';
      payment_amount: number;
      payment_currency: string;
    };
  };
};
