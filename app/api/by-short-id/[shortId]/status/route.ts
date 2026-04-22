import { NextResponse } from 'next/server';
import { getOrderByShortId } from '@/lib/db';

export async function GET(
  _req: Request,
  ctx: RouteContext<'/api/by-short-id/[shortId]/status'>,
) {
  const { shortId } = await ctx.params;
  const order = await getOrderByShortId(shortId);
  if (!order) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({
    short_id: order.short_id,
    status: order.status,
    has_message: !!order.generated_message,
  });
}
