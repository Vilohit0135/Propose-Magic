import { NextResponse } from 'next/server';
import { getOrderById } from '@/lib/db';

export async function GET(_req: Request, ctx: RouteContext<'/api/order/[id]/status'>) {
  const { id } = await ctx.params;
  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json({
    id: order.id,
    short_id: order.short_id,
    status: order.status,
    has_message: !!order.generated_message,
    completed_at: order.completed_at,
  });
}
