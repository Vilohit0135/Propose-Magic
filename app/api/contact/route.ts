import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/mailer';

// POST /api/contact — visitor contact-form submission. Validates the
// input, emails it to the team inbox via Resend, and (whatever the
// email outcome) logs the full query so it's never lost if Resend is
// mis-configured / sandboxed. Mirrors the shape of /api/refund/request.
//
// Body: { name, email, message }
// Response: { ok: true } | { error: <code> }

function str(v: unknown, max = 200): string {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const name = str(body.name, 100);
  const email = str(body.email, 200);
  const message = str(body.message, 4000);

  if (!name) {
    return NextResponse.json({ error: 'missing_name' }, { status: 400 });
  }
  if (!email.includes('@') || email.length < 5) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }
  if (message.length < 5) {
    return NextResponse.json({ error: 'message_too_short' }, { status: 400 });
  }

  // Always log the full query first — if Resend is in sandbox mode or
  // the domain isn't verified, the email send below will fail, and the
  // server log is then the only record. Don't lose a customer query to
  // an email-infra hiccup.
  console.log('[contact] new query', { name, email, message });

  const result = await sendContactEmail({ name, email, message });
  if (!result.ok) {
    console.error('[contact] email delivery failed:', result.error);
    // Still return ok — the visitor did nothing wrong, and the query
    // is preserved in the log above. Surfacing an error would just
    // push them to retry a submission that did, in fact, register.
  }

  return NextResponse.json({ ok: true });
}
