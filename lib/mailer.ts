import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// SMTP mailer (Nodemailer). Used for the contact form. Configured via
// env so the same code works for Gmail / Google Workspace app
// passwords, or any other SMTP provider, with no code change:
//
//   SMTP_HOST   default 'smtp.gmail.com'
//   SMTP_PORT   default 465  (465 = implicit TLS, 587 = STARTTLS)
//   SMTP_USER   the full sending address (the account the app
//               password belongs to)
//   SMTP_PASS   the app password
//
// CONTACT_INBOX is where contact-form queries are delivered; defaults
// to the sending address itself (send-to-self) if not set separately.

type SendResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

let cached: Transporter | null | undefined;

function getTransporter(): Transporter | null {
  if (cached !== undefined) return cached;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    cached = null;
    return null;
  }
  const port = Number(process.env.SMTP_PORT) || 465;
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465, // 465 → implicit TLS; 587 → STARTTLS
    auth: { user, pass },
  });
  return cached;
}

export function isMailerConfigured(): boolean {
  return getTransporter() !== null;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Visitor contact-form submission → delivered to the team inbox.
// `replyTo` is the visitor's address, so the team can just hit Reply.
export async function sendContactEmail(input: {
  name: string;
  email: string;
  message: string;
}): Promise<SendResult> {
  const transporter = getTransporter();
  if (!transporter) return { ok: false, error: 'mailer_not_configured' };

  const from = process.env.SMTP_USER!;
  const to = process.env.CONTACT_INBOX || from;
  const name = input.name.trim() || 'Someone';
  const safeMessage = escapeHtml(input.message).replace(/\n/g, '<br/>');

  const html = `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f2f0eb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f2f0eb;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:540px;width:100%;background:#fff;border:1px solid #e7d8dd;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px;color:#1a1a1a;">
          <div style="font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:#c9748a;font-weight:700;">
            New contact query
          </div>
          <div style="font-family:'Playfair Display',Georgia,serif;font-size:22px;margin:8px 0 20px;">
            ${escapeHtml(name)}
          </div>
          <p style="margin:0 0 6px;font-size:13px;color:#888;">From</p>
          <p style="margin:0 0 18px;font-size:15px;color:#1a1a1a;">
            <a href="mailto:${escapeHtml(input.email)}" style="color:#8b1538;">${escapeHtml(input.email)}</a>
          </p>
          <p style="margin:0 0 6px;font-size:13px;color:#888;">Message</p>
          <div style="font-size:15px;line-height:1.6;color:#1a1a1a;background:#faf7f8;border:1px solid #efe3e7;border-radius:10px;padding:14px 16px;">
            ${safeMessage}
          </div>
          <p style="margin:22px 0 0;font-size:12px;color:#aaa;">
            Hit reply to respond — it goes straight to the sender.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`.trim();

  const text = [
    `New contact query from ${name}`,
    `Email: ${input.email}`,
    '',
    input.message,
    '',
    'Reply to this email to respond to the sender.',
  ].join('\n');

  try {
    const info = await transporter.sendMail({
      from: `ProposeMagic <${from}>`,
      to,
      replyTo: input.email,
      subject: `New query from ${name}`,
      html,
      text,
    });
    console.log('[mailer] contact email sent', { to, id: info.messageId });
    return { ok: true, id: info.messageId };
  } catch (err) {
    console.error('[mailer] contact email failed', err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'send_failed',
    };
  }
}
