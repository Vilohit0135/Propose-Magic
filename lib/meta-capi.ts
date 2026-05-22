import crypto from 'crypto';

// Meta Conversions API (server-side event sending). Runs alongside the
// browser pixel: the same event is sent from both with one shared
// `event_id`, and Meta deduplicates the pair. CAPI events can't be
// blocked by ad blockers / iOS ATT, so conversion data is far more
// complete than pixel-only.
//
// Config (env):
//   NEXT_PUBLIC_META_PIXEL_ID   the pixel id (also used by the browser)
//   META_CAPI_ACCESS_TOKEN      server-only secret from Events Manager
//
// No-ops cleanly when either is missing.

const GRAPH_VERSION = 'v21.0';

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// Meta requires PII normalized then SHA-256 hashed: email lowercased +
// trimmed; phone reduced to digits only (country code included).
function hashEmail(email: string): string {
  return sha256(email.trim().toLowerCase());
}
function hashPhone(phone: string): string {
  return sha256(phone.replace(/\D/g, ''));
}

export type CapiUserData = {
  email?: string | null;
  phone?: string | null;
  clientIp?: string;
  userAgent?: string;
  fbp?: string; // _fbp cookie
  fbc?: string; // _fbc cookie
};

export type CapiEvent = {
  eventName: string;
  eventId: string; // MUST match the browser pixel's eventID for dedup
  eventSourceUrl?: string;
  userData: CapiUserData;
  customData?: Record<string, unknown>;
};

export function isCapiConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_META_PIXEL_ID && process.env.META_CAPI_ACCESS_TOKEN
  );
}

export async function sendCapiEvent(
  ev: CapiEvent,
): Promise<{ ok: boolean; error?: string }> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) return { ok: false, error: 'capi_not_configured' };

  // Build the hashed user_data block. More fields = better match
  // quality; Meta accepts the event even with just IP + UA.
  const user: Record<string, unknown> = {};
  if (ev.userData.email) user.em = [hashEmail(ev.userData.email)];
  if (ev.userData.phone) {
    const digits = ev.userData.phone.replace(/\D/g, '');
    if (digits) user.ph = [hashPhone(ev.userData.phone)];
  }
  if (ev.userData.clientIp) user.client_ip_address = ev.userData.clientIp;
  if (ev.userData.userAgent) user.client_user_agent = ev.userData.userAgent;
  if (ev.userData.fbp) user.fbp = ev.userData.fbp;
  if (ev.userData.fbc) user.fbc = ev.userData.fbc;

  const payload = {
    data: [
      {
        event_name: ev.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: ev.eventId,
        action_source: 'website',
        ...(ev.eventSourceUrl
          ? { event_source_url: ev.eventSourceUrl }
          : {}),
        user_data: user,
        ...(ev.customData ? { custom_data: ev.customData } : {}),
      },
    ],
  };

  try {
    const resp = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    if (!resp.ok) {
      const text = await resp.text();
      console.error(
        `[meta-capi] ${ev.eventName} failed ${resp.status}: ${text.slice(0, 300)}`,
      );
      return { ok: false, error: `http_${resp.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error('[meta-capi] network error', err);
    return { ok: false, error: 'network_error' };
  }
}
