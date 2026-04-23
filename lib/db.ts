import type { Order, OrderDraft, OrderStatus } from './order';
import { generateShortId } from './short-id';

// In-memory store for local development when Supabase isn't configured yet.
// Persists across Next.js HMR by living on globalThis. Cleared on server restart.
// Swapped out for a real Supabase client in Milestone 2 once SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY are provisioned.

type Store = {
  byId: Map<string, Order>;
  byShortId: Map<string, string>;
};

declare global {
  var __proposeMagicStore: Store | undefined;
}

function store(): Store {
  if (!globalThis.__proposeMagicStore) {
    globalThis.__proposeMagicStore = {
      byId: new Map(),
      byShortId: new Map(),
    };
  }
  return globalThis.__proposeMagicStore;
}

function uuid(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function createOrder(draft: OrderDraft): Promise<Order> {
  const s = store();
  let short = generateShortId(12);
  while (s.byShortId.has(short)) short = generateShortId(12);

  const order: Order = {
    id: uuid(),
    short_id: short,
    status: 'PENDING',

    from_name: draft.from_name,
    from_gender: draft.from_gender,
    to_name: draft.to_name,
    story: draft.story ?? null,
    email: draft.email,

    flow: draft.flow,
    sub_flow: draft.sub_flow,

    is_anonymous: draft.is_anonymous,
    reveal_style: draft.reveal_style,
    reveal_difficulty: draft.reveal_difficulty,
    reveal_content: draft.reveal_content,
    reveal_attempts: 0,
    reveal_solved: false,
    reveal_solved_at: null,

    package_type: draft.package_type,
    tone: draft.tone,
    generated_message: null,
    template: draft.template,

    photo_urls: draft.photo_urls ?? [],
    photo_captions: draft.photo_captions ?? [],
    photo_layout: draft.photo_layout,
    scratch_photo_index: draft.scratch_photo_index ?? null,
    video_url: draft.video_url ?? null,
    video_clip_urls: [],
    video_timestamps: null,
    video_treatment: draft.video_treatment,

    razorpay_order_id: null,
    razorpay_payment_id: null,
    amount_paid: null,

    s3_url: null,
    cloudfront_url: null,

    music_video_id: draft.music_video_id ?? null,
    music_start_seconds: draft.music_start_seconds ?? null,

    love_taps: 0,
    reactions: [],
    quiz_score: null,
    yes_time_seconds: null,

    yes_clicked: false,
    yes_clicked_at: null,

    referral_short_id: null,
    ref_source: null,

    created_at: new Date().toISOString(),
    completed_at: null,
  };

  s.byId.set(order.id, order);
  s.byShortId.set(order.short_id, order.id);
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  return store().byId.get(id) ?? null;
}

export async function getOrderByShortId(shortId: string): Promise<Order | null> {
  const s = store();
  const id = s.byShortId.get(shortId);
  return id ? (s.byId.get(id) ?? null) : null;
}

export async function updateOrder(
  id: string,
  patch: Partial<Order>,
): Promise<Order | null> {
  const s = store();
  const current = s.byId.get(id);
  if (!current) return null;
  const next: Order = { ...current, ...patch };
  s.byId.set(id, next);
  return next;
}

export async function setStatus(
  id: string,
  status: OrderStatus,
  extra: Partial<Order> = {},
): Promise<Order | null> {
  const patch: Partial<Order> = { status, ...extra };
  if (status === 'COMPLETED' && !extra.completed_at) {
    patch.completed_at = new Date().toISOString();
  }
  return updateOrder(id, patch);
}
