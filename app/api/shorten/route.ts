import { NextResponse } from 'next/server';

// Proxies the caller's URL through TinyURL's free api-create.php endpoint.
// Done server-side because TinyURL doesn't send CORS headers, so direct
// fetches from the browser fail cross-origin.
//
// The endpoint is anonymous (no API key) and rate-limited but generous —
// plenty for one-shot shortening per delivered order. On failure we fall
// back to returning the original URL so the sender still gets something.

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

  // Basic sanity check — only shorten http(s) URLs we recognise, no
  // file:// or javascript: etc. sneaking through.
  if (!/^https?:\/\/[^\s]+$/i.test(url) || url.length > 2000) {
    return NextResponse.json({ error: 'invalid_url' }, { status: 400 });
  }

  try {
    const resp = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
      { method: 'GET', cache: 'no-store' },
    );
    if (!resp.ok) throw new Error(`tinyurl_${resp.status}`);
    const short = (await resp.text()).trim();
    if (!/^https:\/\/tinyurl\.com\/[A-Za-z0-9_-]+$/.test(short)) {
      throw new Error('unexpected_response');
    }
    return NextResponse.json({ short, original: url });
  } catch (err) {
    // Return the original URL so callers can fall back seamlessly; log
    // the failure so we know when TinyURL is having a bad day.
    console.warn('[shorten] tinyurl call failed:', err);
    return NextResponse.json({ short: url, original: url, fallback: true });
  }
}
