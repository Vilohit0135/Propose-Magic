// Thin Resend wrapper. We use it for transactional emails like the
// "they said YES" notification to the sender. No SDK dependency — the
// REST API is two fields and a JSON body, not worth pulling in
// `resend` npm package. Returns ok flags so callers can decide whether
// to log/retry without throwing on routine cases like missing key.

type SendResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

const RESEND_FROM =
  process.env.RESEND_FROM_EMAIL || 'ProposeMagic <onboarding@resend.dev>';

async function send(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: 'resend_not_configured' };
  if (!opts.to.includes('@')) return { ok: false, error: 'invalid_to' };

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        ...(opts.text ? { text: opts.text } : {}),
      }),
    });
    const data = (await resp.json()) as {
      id?: string;
      message?: string;
      name?: string;
    };
    if (!resp.ok) {
      // Surface the full Resend error in logs so we can tell sandbox
      // restrictions from key issues from invalid recipients. Most
      // common in dev:
      //   - "You can only send testing emails to your own email
      //     address" → onboarding@resend.dev sandbox restriction.
      //   - "The from address must be a verified domain" → custom
      //     RESEND_FROM_EMAIL set without verifying the domain in
      //     Resend dashboard.
      console.error('[resend] send failed', {
        status: resp.status,
        from: RESEND_FROM,
        to: opts.to,
        body: data,
      });
      return {
        ok: false,
        error: data.message || data.name || `http_${resp.status}`,
      };
    }
    console.log('[resend] sent', { to: opts.to, id: data.id });
    return { ok: true, id: data.id ?? 'unknown' };
  } catch (err) {
    console.error('[resend] network error', err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'network_error',
    };
  }
}

export type YesEmailContext = {
  toEmail: string; // sender's email — we're notifying THEM
  fromName: string; // sender's name (greeting addressee)
  receiverName: string; // who said yes
  particle: string; // emoji from the sub-flow ('💍', '💛', etc.)
  shortId: string; // for the link back to the page
  origin: string; // base URL for the link
  hearts: number;
  reactions: string[];
  yesAfterSeconds: number;
};

export async function sendYesEmail(ctx: YesEmailContext): Promise<SendResult> {
  const firstFrom = ctx.fromName.trim().split(/\s+/)[0] || 'you';
  const firstTo = ctx.receiverName.trim().split(/\s+/)[0] || 'they';
  const subject = `${firstTo} said YES ${ctx.particle}`;

  const minutes = Math.max(1, Math.round(ctx.yesAfterSeconds / 60));
  const reactionLine = ctx.reactions.length
    ? `<p style="margin:0 0 14px;color:#5b4858;font-size:15px;">She reacted with ${[
        ...new Set(ctx.reactions),
      ].join(' ')}.</p>`
    : '';

  const link = `${ctx.origin}/p/${ctx.shortId}`;

  const html = `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#fafaf7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafaf7;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;background:linear-gradient(165deg,#2a0e1c 0%,#1a0a12 100%);border-radius:18px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,0.18);">
        <tr><td style="padding:42px 32px 36px;text-align:center;color:#fbeae1;">
          <div style="font-size:46px;line-height:1;margin-bottom:14px;">${ctx.particle}</div>
          <div style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:30px;line-height:1.2;color:#fff;margin-bottom:8px;">
            ${escapeHtml(firstTo)} said YES.
          </div>
          <div style="font-size:13px;color:#c9a2a0;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:24px;">
            for ${escapeHtml(firstFrom)}
          </div>
          <div style="height:1px;width:42px;background:#d4a574;margin:0 auto 22px;opacity:0.7;"></div>
          <p style="margin:0 0 14px;color:#e8d2c8;font-size:15px;line-height:1.6;">
            She made it through the whole letter. After ${minutes} minute${minutes === 1 ? '' : 's'},
            ${ctx.hearts > 0 ? `${ctx.hearts} heart${ctx.hearts === 1 ? '' : 's'}, ` : ''}and one quiet breath
            before the question, she said yes.
          </p>
          ${reactionLine.replace(/color:#5b4858/g, 'color:#c9a2a0').replace(/font-size:15px/g, 'font-size:14px')}
          <p style="margin:0 0 28px;color:#fbeae1;font-style:italic;font-family:'Playfair Display',Georgia,serif;font-size:17px;">
            You did the brave thing, ${escapeHtml(firstFrom)}. ♥
          </p>
          <a href="${escapeAttr(link)}" style="display:inline-block;padding:14px 28px;border-radius:99px;background:linear-gradient(90deg,#d4a574,#f4c6a8);color:#2a0e1c;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.6px;">
            Open the page she saw →
          </a>
        </td></tr>
      </table>
      <p style="margin:18px 0 0;font-size:11px;color:#8b7682;letter-spacing:0.4px;">
        This page lives for 48h, then everything is wiped for privacy.
      </p>
    </td></tr>
  </table>
</body></html>`.trim();

  const text = [
    `${firstTo} said YES ${ctx.particle}`,
    '',
    `She made it through the whole letter. After ${minutes} minute${minutes === 1 ? '' : 's'}, ${ctx.hearts > 0 ? `${ctx.hearts} heart${ctx.hearts === 1 ? '' : 's'}, and ` : ''}one quiet breath before the question, she said yes.`,
    ctx.reactions.length
      ? `She reacted with ${[...new Set(ctx.reactions)].join(' ')}.`
      : '',
    '',
    `You did the brave thing, ${firstFrom}.`,
    '',
    `Open the page she saw: ${link}`,
    '',
    'This page lives for 48h, then everything is wiped for privacy.',
  ]
    .filter(Boolean)
    .join('\n');

  return send({ to: ctx.toEmail, subject, html, text });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}
