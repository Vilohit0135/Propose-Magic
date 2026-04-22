// In-memory refund request log. Replaced by Supabase persistence + Nodemailer
// notification in a later milestone. Kept on globalThis so HMR doesn't wipe it.

export type RefundRequest = {
  id: string;
  name: string;
  email: string;
  order_short_id: string;
  reason: string;
  created_at: string;
  notified: boolean;
};

declare global {
  var __pmRefundStore: { requests: RefundRequest[] } | undefined;
}

function store() {
  if (!globalThis.__pmRefundStore) {
    globalThis.__pmRefundStore = { requests: [] };
  }
  return globalThis.__pmRefundStore;
}

export function addRefundRequest(
  input: Omit<RefundRequest, 'id' | 'created_at' | 'notified'>,
): RefundRequest {
  const req: RefundRequest = {
    ...input,
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    created_at: new Date().toISOString(),
    notified: false,
  };
  store().requests.push(req);
  return req;
}

export function listRefundRequests(): RefundRequest[] {
  return [...store().requests].reverse();
}
