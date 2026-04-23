// Pulls the 11-character video ID + optional start time out of any YouTube URL
// shape the user is likely to paste. Returns null if the input doesn't look
// like a valid YouTube link or bare ID.
export type YouTubeParsed = {
  id: string;
  startSeconds: number | null;
};

export function parseYouTubeUrl(raw: string): YouTubeParsed | null {
  const input = (raw || '').trim();
  if (!input) return null;

  // Bare 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return { id: input, startSeconds: null };
  }

  try {
    const u = new URL(input);
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    const id = extractIdFromUrl(u, host);
    if (!id) return null;
    const startSeconds = extractStartFromUrl(u);
    return { id, startSeconds };
  } catch {
    return null;
  }
}

export function extractYouTubeId(raw: string): string | null {
  return parseYouTubeUrl(raw)?.id ?? null;
}

function extractIdFromUrl(u: URL, host: string): string | null {
  if (host === 'youtu.be') {
    const id = u.pathname.slice(1).split('/')[0];
    return isValidId(id) ? id : null;
  }
  const isYt =
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'music.youtube.com' ||
    host === 'youtube-nocookie.com';
  if (!isYt) return null;
  const v = u.searchParams.get('v');
  if (v && isValidId(v)) return v;
  const parts = u.pathname.split('/').filter(Boolean);
  if (
    parts.length >= 2 &&
    (parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live')
  ) {
    return isValidId(parts[1]) ? parts[1] : null;
  }
  return null;
}

// YouTube share links use several start-time formats. Covers `t=30`, `t=30s`,
// `t=1m30s`, `t=1h2m3s`, and `start=30`.
function extractStartFromUrl(u: URL): number | null {
  const raw = u.searchParams.get('t') || u.searchParams.get('start');
  if (!raw) return null;
  return parseTimeString(raw);
}

export function parseTimeString(raw: string): number | null {
  const s = raw.trim().toLowerCase();
  if (!s) return null;

  // Plain integer seconds
  if (/^\d+$/.test(s)) return clampSeconds(parseInt(s, 10));

  // mm:ss or h:mm:ss
  if (/^\d+(:\d{1,2}){1,2}$/.test(s)) {
    const parts = s.split(':').map((p) => parseInt(p, 10));
    let total = 0;
    for (const n of parts) total = total * 60 + n;
    return clampSeconds(total);
  }

  // 1h2m3s / 30s / 1m30s / 1m / etc.
  const m = s.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
  if (m && (m[1] || m[2] || m[3])) {
    const h = parseInt(m[1] || '0', 10);
    const mm = parseInt(m[2] || '0', 10);
    const ss = parseInt(m[3] || '0', 10);
    return clampSeconds(h * 3600 + mm * 60 + ss);
  }

  return null;
}

// Cap to 10 hours so a rogue paste can't break anything downstream.
function clampSeconds(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  if (n > 36000) return 36000;
  return Math.floor(n);
}

export function formatTimeMmSs(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${ss.toString().padStart(2, '0')}`;
}

function isValidId(s: string | undefined | null): s is string {
  return !!s && /^[a-zA-Z0-9_-]{11}$/.test(s);
}

export function idToWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
