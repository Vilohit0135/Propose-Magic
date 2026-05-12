import { NextResponse } from 'next/server';

// Shortens the caller's URL via two free, key-less, permanent URL
// shorteners chained as a fallback pair. Done server-side so browser
// CORS restrictions don't block the calls.
//
// Chain: tinyurl.com (primary) → is.gd (fallback) → original URL.
//
// Why TinyURL first:
//   - is.gd has been intermittently unreachable from some networks
//     (DNS / ISP block / outage), returning ERR_CONNECTION_TIMED_OUT
//     for end users. TinyURL's domain is more reliably resolvable
//     globally.
//   - TinyURL's free links now show a brief ad interstitial before
//     redirecting — a known cost we accept for reliability. Music
//     playback is no longer affected (the prior "TinyURL breaks
//     music" symptom traced to an SSR hydration bug in
//     BackgroundMusic, fixed separately).
//   - is.gd kept as a fallback for the case where TinyURL's API is
//     rate-limited or down.
//   - Both shorteners create PERMANENT redirects. The 48h expiry is
//     enforced by the receiver page itself (status → EXPIRED), not the
//     short link — so functionally the link goes dead after 48h by
//     landing on the "faded" page, and the DB/Cloudinary are wiped.

type ShortResult = {
  short: string;
  original: string;
  provider: 'tinyurl' | 'isgd' | 'fallback';
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

  // Try TinyURL first — most reliably reachable; cost is the brief
  // ad-interstitial receivers see before reaching the proposal.
  const tiny = await tryTinyUrl(url);
  if (tiny) {
    return NextResponse.json<ShortResult>({
      short: tiny,
      original: url,
      provider: 'tinyurl',
    });
  }

  // Fall back to is.gd if TinyURL is down / rate-limited. is.gd does a
  // cleaner redirect (no ads) but has had network reachability issues
  // from some ISPs in the past, so it's only the safety net.
  const isgd = await tryIsGd(url);
  if (isgd) {
    return NextResponse.json<ShortResult>({
      short: isgd,
      original: url,
      provider: 'isgd',
    });
  }

  // Neither worked — return the original so the UI still has something
  // to show / share.
  console.warn('[shorten] both tinyurl and is.gd failed, returning original');
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
