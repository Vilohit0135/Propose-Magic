import type { Order, OrderDraft, OrderStatus } from './order';
import { ORDER_TTL_MS } from './order';
import { destroyAssets } from './cloudinary';
import { generateShortId } from './short-id';
import { getSupabase } from './supabase';

// When SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL are set, every
// helper routes through Supabase. When they're missing (e.g. local dev
// before env is populated), we fall back to an in-memory Map on globalThis
// so the app still boots. The public API is identical either way — callers
// don't know which backend is live.

type Store = {
  byId: Map<string, Order>;
  byShortId: Map<string, string>;
};

declare global {
  var __proposeMagicStore: Store | undefined;
}

function memStore(): Store {
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

// Supabase returns Postgres nullables for array columns as either [] or
// null depending on driver behavior. Normalize everything to the shape the
// app expects before handing it back to callers.
function normalize(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    short_id: row.short_id as string,
    status: row.status as OrderStatus,

    from_name: (row.from_name as string) ?? '',
    from_gender: (row.from_gender as Order['from_gender']) ?? 'they',
    to_name: (row.to_name as string) ?? '',
    story: (row.story as string | null) ?? null,
    email: (row.email as string) ?? '',

    flow: row.flow as Order['flow'],
    sub_flow: row.sub_flow as string,

    is_anonymous: !!row.is_anonymous,
    reveal_style: (row.reveal_style as Order['reveal_style']) ?? null,
    reveal_difficulty:
      (row.reveal_difficulty as Order['reveal_difficulty']) ?? null,
    reveal_content: (row.reveal_content as Order['reveal_content']) ?? null,
    reveal_attempts: (row.reveal_attempts as number) ?? 0,
    reveal_solved: !!row.reveal_solved,
    reveal_solved_at: (row.reveal_solved_at as string | null) ?? null,

    package_type: row.package_type as Order['package_type'],
    tone: row.tone as Order['tone'],
    generated_message: (row.generated_message as string | null) ?? null,
    template: row.template as Order['template'],

    photo_urls: (row.photo_urls as string[]) ?? [],
    photo_captions: (row.photo_captions as string[]) ?? [],
    photo_layout: (row.photo_layout as Order['photo_layout']) ?? null,
    scratch_photo_index: (row.scratch_photo_index as number | null) ?? null,
    video_url: (row.video_url as string | null) ?? null,
    video_clip_urls: (row.video_clip_urls as string[]) ?? [],
    video_timestamps:
      (row.video_timestamps as Record<string, number> | null) ?? null,
    video_treatment: (row.video_treatment as Order['video_treatment']) ?? null,

    razorpay_order_id: (row.razorpay_order_id as string | null) ?? null,
    razorpay_payment_id: (row.razorpay_payment_id as string | null) ?? null,
    amount_paid: (row.amount_paid as number | null) ?? null,

    s3_url: (row.s3_url as string | null) ?? null,
    cloudfront_url: (row.cloudfront_url as string | null) ?? null,

    music_video_id: (row.music_video_id as string | null) ?? null,
    music_start_seconds: (row.music_start_seconds as number | null) ?? null,

    love_taps: (row.love_taps as number) ?? 0,
    reactions: (row.reactions as string[]) ?? [],
    quiz_score: (row.quiz_score as number | null) ?? null,
    yes_time_seconds: (row.yes_time_seconds as number | null) ?? null,

    yes_clicked: !!row.yes_clicked,
    yes_clicked_at: (row.yes_clicked_at as string | null) ?? null,

    referral_short_id: (row.referral_short_id as string | null) ?? null,
    ref_source: (row.ref_source as string | null) ?? null,

    created_at: row.created_at as string,
    completed_at: (row.completed_at as string | null) ?? null,
    expires_at: row.expires_at as string,
    expired_at: (row.expired_at as string | null) ?? null,
  };
}

function buildOrder(draft: OrderDraft, shortId: string): Order {
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + ORDER_TTL_MS);
  return {
    id: uuid(),
    short_id: shortId,
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

    created_at: createdAt.toISOString(),
    completed_at: null,
    expires_at: expiresAt.toISOString(),
    expired_at: null,
  };
}

export async function createOrder(draft: OrderDraft): Promise<Order> {
  const sb = getSupabase();

  if (!sb) {
    // Memory fallback.
    const s = memStore();
    let short = generateShortId(12);
    while (s.byShortId.has(short)) short = generateShortId(12);
    const order = buildOrder(draft, short);
    s.byId.set(order.id, order);
    s.byShortId.set(order.short_id, order.id);
    return order;
  }

  // Retry the short_id up to a few times in the unlikely event of collision.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const short = generateShortId(12);
    const order = buildOrder(draft, short);
    const { data, error } = await sb
      .from('orders')
      .insert(order)
      .select('*')
      .single();
    if (error) {
      // 23505 = unique_violation on short_id. Try again with a new id.
      if (error.code === '23505') continue;
      throw new Error(`createOrder failed: ${error.message}`);
    }
    return normalize(data as Record<string, unknown>);
  }
  throw new Error('createOrder failed: short_id collision');
}

export async function getOrderById(id: string): Promise<Order | null> {
  const sb = getSupabase();
  if (!sb) return memStore().byId.get(id) ?? null;

  const { data, error } = await sb
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(`getOrderById failed: ${error.message}`);
  return data ? normalize(data as Record<string, unknown>) : null;
}

export async function getOrderByShortId(
  shortId: string,
): Promise<Order | null> {
  const sb = getSupabase();
  if (!sb) {
    const s = memStore();
    const id = s.byShortId.get(shortId);
    return id ? (s.byId.get(id) ?? null) : null;
  }

  const { data, error } = await sb
    .from('orders')
    .select('*')
    .eq('short_id', shortId)
    .maybeSingle();
  if (error) throw new Error(`getOrderByShortId failed: ${error.message}`);
  return data ? normalize(data as Record<string, unknown>) : null;
}

export async function updateOrder(
  id: string,
  patch: Partial<Order>,
): Promise<Order | null> {
  const sb = getSupabase();
  if (!sb) {
    const s = memStore();
    const current = s.byId.get(id);
    if (!current) return null;
    const next: Order = { ...current, ...patch };
    s.byId.set(id, next);
    return next;
  }

  const { data, error } = await sb
    .from('orders')
    .update(patch)
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) throw new Error(`updateOrder failed: ${error.message}`);
  return data ? normalize(data as Record<string, unknown>) : null;
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

// Zero out PII + destroy uploaded media. The order row itself stays so
// analytics and short_id lookups still resolve (they'll return an EXPIRED
// shell). Idempotent: calling expireOrder twice just re-nulls empty fields.
export async function expireOrder(id: string): Promise<Order | null> {
  const current = await getOrderById(id);
  if (!current) return null;
  if (current.status === 'EXPIRED') return current;

  const mediaUrls = [
    ...current.photo_urls,
    ...(current.video_url ? [current.video_url] : []),
    ...current.video_clip_urls,
  ];
  // Don't let a Cloudinary outage block wiping PII from the DB.
  await destroyAssets(mediaUrls).catch(() => 0);

  const patch: Partial<Order> = {
    status: 'EXPIRED',
    expired_at: new Date().toISOString(),
    from_name: '',
    to_name: '',
    email: '',
    story: null,
    generated_message: null,
    photo_urls: [],
    photo_captions: [],
    video_url: null,
    video_clip_urls: [],
    video_timestamps: null,
    reveal_content: null,
    music_video_id: null,
    music_start_seconds: null,
  };
  return updateOrder(id, patch);
}

export function isExpired(order: Order): boolean {
  if (order.status === 'EXPIRED') return true;
  return Date.now() > Date.parse(order.expires_at);
}

// Used by the cron sweep to find orders past their TTL that haven't already
// been expired (either by a receiver visit or a prior sweep).
export async function listExpiringOrders(): Promise<Order[]> {
  const sb = getSupabase();
  if (!sb) {
    const now = Date.now();
    return Array.from(memStore().byId.values()).filter(
      (o) => o.status !== 'EXPIRED' && Date.parse(o.expires_at) <= now,
    );
  }

  const { data, error } = await sb
    .from('orders')
    .select('*')
    .neq('status', 'EXPIRED')
    .lte('expires_at', new Date().toISOString());
  if (error) throw new Error(`listExpiringOrders failed: ${error.message}`);
  return (data ?? []).map((r) => normalize(r as Record<string, unknown>));
}
