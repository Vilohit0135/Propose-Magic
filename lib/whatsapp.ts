// Meta WhatsApp Cloud API wrapper. Sends a single template-based outbound
// message to the sender when the receiver taps YES.
//
// Required env vars:
//   META_WHATSAPP_PHONE_NUMBER_ID   the numeric Phone Number ID from
//                                    WhatsApp Manager → API Setup.
//   META_WHATSAPP_ACCESS_TOKEN      a permanent system-user token with
//                                    `whatsapp_business_messaging` scope.
//   META_WHATSAPP_TEMPLATE_NAME     name of an APPROVED template (see
//                                    template-shape comment below).
//   META_WHATSAPP_TEMPLATE_LANG     defaults to 'en'. Must match the
//                                    language tag the template was
//                                    submitted under.
//
// IMPORTANT — WhatsApp policy:
//   Outside a 24h customer-initiated conversation window, Meta only
//   permits *template* messages registered + approved by Meta. The
//   sender hasn't conversed with our number, so we MUST use a template.
//   Free-form text would be silently dropped (or fail with code 132000).
//
// Template shape we use:
//   The template registered in WhatsApp Manager should have a BODY with
//   exactly 3 placeholders, in this order:
//       {{1}} = sender's first name (the person being notified)
//       {{2}} = receiver's first name (who said yes)
//       {{3}} = link to the celebration page
//
//   Suggested body (you craft + submit to Meta for approval):
//       "{{1}}, {{2}} said yes 💍
//
//        The world feels different now. Go to her — she's been waiting.
//
//        You are whole now.
//
//        {{3}}"
//
//   Adjust phrasing as you like. Approval typically lands in 24-48h.
//   Pick category "Utility" — cheaper per-send and faster to approve
//   than "Marketing".

type SendResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string };

export type YesWhatsappContext = {
  toPhone: string; // sender's phone in E.164 (+919876543210)
  fromName: string; // sender's name (greeting addressee — {{1}})
  receiverName: string; // who said yes — {{2}}
  particle: string; // emoji (kept for callsite parity; not used in template)
  shortId: string;
  origin: string;
};

const GRAPH_API_VERSION = 'v21.0';

export async function sendYesWhatsapp(
  ctx: YesWhatsappContext,
): Promise<SendResult> {
  const phoneId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.META_WHATSAPP_ACCESS_TOKEN;
  const templateName = process.env.META_WHATSAPP_TEMPLATE_NAME;
  const templateLang = process.env.META_WHATSAPP_TEMPLATE_LANG || 'en';

  if (!phoneId || !token || !templateName) {
    return { ok: false, error: 'meta_whatsapp_not_configured' };
  }

  // Meta Cloud API wants raw digits without the leading '+'.
  const toPhone = ctx.toPhone.replace(/^\+/, '');
  if (!/^\d{8,15}$/.test(toPhone)) {
    return { ok: false, error: 'invalid_to_phone' };
  }

  const firstFrom = ctx.fromName.trim().split(/\s+/)[0] || 'you';
  const firstTo = ctx.receiverName.trim().split(/\s+/)[0] || 'they';
  const link = `${ctx.origin}/p/${ctx.shortId}`;

  const payload = {
    messaging_product: 'whatsapp',
    to: toPhone,
    type: 'template',
    template: {
      name: templateName,
      language: { code: templateLang },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: firstFrom },
            { type: 'text', text: firstTo },
            { type: 'text', text: link },
          ],
        },
      ],
    },
  };

  try {
    const resp = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );
    const data = (await resp.json()) as {
      messages?: Array<{ id: string }>;
      error?: { code?: number; message?: string; type?: string };
    };
    if (!resp.ok) {
      const code = data.error?.code ?? resp.status;
      const msg = data.error?.message ?? 'unknown';
      return { ok: false, error: `meta_${code}: ${msg}` };
    }
    const id = data.messages?.[0]?.id ?? 'unknown';
    return { ok: true, messageId: id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'network_error',
    };
  }
}
