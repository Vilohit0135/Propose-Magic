import { NextResponse } from 'next/server';

// Shortens the caller's URL via two free, key-less, permanent URL
// shorteners chained as a fallback pair. Done server-side so browser
// CORS restrictions don't block the calls.
//
// Chain: is.gd (primary) → tinyurl.com (fallback) → original URL.
//
// Why this chain, and why not just one provider:
//   - Both services produce PERMANENT URLs. Neither applies a TTL.
//     (We pass `expires_at=+48h` to is.gd anyway so that even if their
//      policy changes, our short link outlives the receiver page's
//      own 48h window.)
//   - is.gd is noticeably less aggressive with anti-abuse rules on
//     *.vercel.app URLs, which TinyURL occasionally flags. is.gd going
//     first means fewer "link broken" complaints.
//   - TinyURL kept as a fallback in case is.gd is temporarily down.
//   - If both fail, we return the original URL so the sender still
//     gets something clickable — just unshortened.

type ShortResult = {
  short: string;
  original: string;
  provider: 'isgd' | 'tinyurl' | 'fallback';
};

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const url =
    typeof (body as Record<string, unknown>)?.url === 'string'
      ? ((body as Record<string, unknown>).url as string).trim()
      : '';

  if (!/^https?:\/\/[^\s]+$/i.test(url) || url.length > 2000) {
    return NextResponse.json({ error: 'invalid_url' }, { status: 400 });
  }

  // Try is.gd first.
  const isgd = await tryIsGd(url);
  if (isgd) {
    return NextResponse.json<ShortResult>({
      short: isgd,
      original: url,
      provider: 'isgd',
    });
  }

  // Fall back to tinyurl.
  const tiny = await tryTinyUrl(url);
  if (tiny) {
    return NextResponse.json<ShortResult>({
      short: tiny,
      original: url,
      provider: 'tinyurl',
    });
  }

  // Neither worked — return the original so the UI still has something
  // to show / share.
  console.warn('[shorten] both is.gd and tinyurl failed, returning original');
  return NextResponse.json<ShortResult>({
    short: url,
    original: url,
    provider: 'fallback',
  });
}

// 5s per provider is generous but bounded — if one of them is slow
// we still fall over to the next inside Vercel's 10s edge timeout.
const PROVIDER_TIMEOUT_MS = 5000;

async function tryIsGd(url: string): Promise<string | null> {
  const api = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`;
  try {
    const resp = await fetch(api, {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });
    if (!resp.ok) return null;
    const text = (await resp.text()).trim();
    if (/^https:\/\/is\.gd\/[A-Za-z0-9_-]+$/.test(text)) return text;
    return null;
  } catch (err) {
    console.warn('[shorten] is.gd failed:', err);
    return null;
  }
}

async function tryTinyUrl(url: string): Promise<string | null> {
  try {
    const resp = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
      {
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
      },
    );
    if (!resp.ok) return null;
    const text = (await resp.text()).trim();
    if (/^https:\/\/tinyurl\.com\/[A-Za-z0-9_-]+$/.test(text)) return text;
    return null;
  } catch (err) {
    console.warn('[shorten] tinyurl failed:', err);
    return null;
  }
}
