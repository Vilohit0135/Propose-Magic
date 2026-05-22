// Client-side Meta tracking. trackMeta() fires one event to BOTH the
// browser pixel AND the Conversions API (via /api/meta/track), tagged
// with one shared event_id so Meta deduplicates the pair.
//
// Client-only — relies on window/document. Never import server-side.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)'),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

function genEventId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function trackMeta(
  eventName: string,
  customData?: Record<string, unknown>,
  // Pass an explicit id for events that also fire server-side (Purchase,
  // InitiateCheckout) so both copies dedupe. Omit for one-off events
  // (PageView) — a random id is generated.
  eventId?: string,
  // Optional contact info — improves CAPI match quality.
  contact?: { email?: string | null; phone?: string | null },
): void {
  if (typeof window === 'undefined') return;
  const id = eventId || genEventId();

  // 1. Browser pixel. The 4th arg's `eventID` is what Meta dedupes on.
  window.fbq?.('track', eventName, customData ?? {}, { eventID: id });

  // 2. Conversions API forward. keepalive lets the request finish even
  //    if the user navigates away immediately after.
  void fetch('/api/meta/track', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      event_name: eventName,
      event_id: id,
      event_source_url: window.location.href,
      custom_data: customData ?? {},
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc'),
      email: contact?.email ?? undefined,
      phone: contact?.phone ?? undefined,
    }),
  }).catch(() => {
    // Tracking must never surface an error to the user.
  });
}
