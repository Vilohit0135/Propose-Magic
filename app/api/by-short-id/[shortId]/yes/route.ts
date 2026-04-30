import { NextResponse } from 'next/server';
import { getOrderByShortId, updateOrder } from '@/lib/db';
import { sendYesEmail } from '@/lib/resend';
import { sendYesWhatsapp } from '@/lib/whatsapp';
import { FLOWS } from '@/lib/tokens';

// Called by the YesCard the moment the receiver taps YES. Records the
// click on the order, then fires email + WhatsApp notifications to the
// sender. Both notifications are best-effort and run in parallel — if
// either provider fails, the click is still recorded and the receiver's
// celebration UI continues.

export async function POST(
  req: Request,
  ctx: RouteContext<'/api/by-short-id/[shortId]/yes'>,
) {
  const { shortId } = await ctx.params;

  let body: { hearts?: number; reactions?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    // Body is optional.
  }
  const hearts = typeof body.hearts === 'number' ? body.hearts : 0;
  const reactions = Array.isArray(body.reactions)
    ? (body.reactions as unknown[])
        .filter((r): r is string => typeof r === 'string')
        .slice(0, 10)
    : [];

  const order = await getOrderByShortId(shortId);
  if (!order) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  if (order.status === 'EXPIRED') {
    return NextResponse.json({ error: 'expired' }, { status: 410 });
  }

  // Record the YES once. If the receiver re-mounts the YesCard (page
  // reload during celebration) we don't double-fire notifications.
  if (!order.yes_clicked) {
    const yesAt = new Date();
    const yesAfterSeconds = Math.max(
      1,
      Math.round((yesAt.getTime() - Date.parse(order.created_at)) / 1000),
    );
    await updateOrder(order.id, {
      yes_clicked: true,
      yes_clicked_at: yesAt.toISOString(),
      yes_time_seconds: yesAfterSeconds,
      love_taps: Math.max(order.love_taps, hearts),
      reactions: dedupe([...order.reactions, ...reactions]),
    });

    // Look up the particle emoji for the sub-flow ('💍', '💛', etc.).
    const flowDef = FLOWS[order.flow];
    const sub = flowDef?.subFlows[order.sub_flow];
    const particle = sub?.particle || '♥';

    // Origin for the link in the message — we prefer Vercel's deployment
    // URL when this hits production, then fall back to the request URL
    // for local/dev.
    const origin =
      (req.headers.get('x-forwarded-host')
        ? `${req.headers.get('x-forwarded-proto') || 'https'}://${req.headers.get('x-forwarded-host')}`
        : null) ||
      new URL(req.url).origin;

    // Fire and forget — both notifications run in parallel and we don't
    // make the receiver's UI wait on either provider.
    void Promise.allSettled([
      sendYesEmail({
        toEmail: order.email,
        fromName: order.from_name,
        receiverName: order.to_name,
        particle,
        shortId: order.short_id,
        origin,
        hearts,
        reactions,
        yesAfterSeconds,
      }).then((res) => {
        if (!res.ok) console.warn('[yes] email failed:', res.error);
      }),
      order.from_phone
        ? sendYesWhatsapp({
            toPhone: order.from_phone,
            fromName: order.from_name,
            receiverName: order.to_name,
            particle,
            shortId: order.short_id,
            origin,
          }).then((res) => {
            if (!res.ok) console.warn('[yes] whatsapp failed:', res.error);
          })
        : Promise.resolve(),
    ]);
  }

  return NextResponse.json({ ok: true });
}

function dedupe(arr: string[]): string[] {
  return Array.from(new Set(arr));
}
