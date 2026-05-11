// Persistent per-browser identity. Generated once on first visit, stored
// in localStorage so the same browser sees the same UUID across every
// proposal and every payment attempt. There's no account system — this
// is the closest we get to a "user".
//
// Used for:
//   - Stitching multiple orders to one person ("user X made 3 proposals")
//   - Threading transaction events ("user X retried payment 4 times")
//   - Cashfree's customer_id field (so their dashboard groups attempts)

const STORAGE_KEY = 'proposemagic_user_uuid';
const COOKIE_KEY = 'pm_user_uuid';

function generate(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for very old browsers — same shape, just slower entropy.
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// Writes a long-lived cookie alongside localStorage. The cookie lets
// server routes that don't see the request body (e.g. Cashfree's
// return-url GET) still know who the user is.
function writeCookie(value: string) {
  if (typeof document === 'undefined') return;
  const maxAge = 60 * 60 * 24 * 365 * 5; // 5 years
  document.cookie = `${COOKIE_KEY}=${value}; max-age=${maxAge}; path=/; samesite=lax`;
}

export function getOrCreateUserUuid(): string {
  if (typeof window === 'undefined') {
    // SSR — return a throwaway so consumers don't break. The real value
    // will be assigned on first client render.
    return '';
  }
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing && existing.length > 0) {
      writeCookie(existing); // keep cookie alive even if it expired
      return existing;
    }
  } catch {
    // Private/storage-blocked browsers fall through to generating a
    // fresh UUID per session.
  }
  const fresh = generate();
  try {
    window.localStorage.setItem(STORAGE_KEY, fresh);
  } catch {
    // ignore — cookie still works
  }
  writeCookie(fresh);
  return fresh;
}
