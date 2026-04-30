import { NextResponse } from 'next/server';

// Quick diagnostic endpoint — pings Resend with a test email and returns
// whatever Resend says (including 4xx errors). Lets you verify the
// API key + sandbox restriction independently from the proposal flow.
//
// Usage:
//   curl -X POST 'https://your-app.vercel.app/api/test/email?to=you@example.com'
//
// In dev:
//   curl -X POST 'http://localhost:3000/api/test/email?to=you@example.com'
//
// If sandbox-restricted you'll see a message like:
//   "You can only send testing emails to your own email address (xxx)."
// → fix by either using your Resend signup email as `to`, or by
// verifying a custom domain and setting RESEND_FROM_EMAIL.

export async function POST(req: Request) {
  const url = new URL(req.url);
  const to = url.searchParams.get('to') || '';
  if (!to.includes('@')) {
    return NextResponse.json(
      { error: 'invalid_to', hint: 'pass ?to=you@example.com' },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'no_api_key', hint: 'set RESEND_API_KEY in env' },
      { status: 503 },
    );
  }

  const from =
    process.env.RESEND_FROM_EMAIL || 'ProposeMagic <onboarding@resend.dev>';

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'ProposeMagic test ping',
      html: '<p>Resend is wired up correctly. ✅</p>',
      text: 'Resend is wired up correctly.',
    }),
  });
  const data = await resp.json().catch(() => ({}));
  return NextResponse.json(
    { status: resp.status, from, to, response: data },
    { status: resp.ok ? 200 : 500 },
  );
}

// GET version for browser-friendly testing.
export async function GET(req: Request) {
  return POST(req);
}
