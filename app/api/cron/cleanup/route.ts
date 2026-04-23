import { NextResponse } from 'next/server';
import { expireOrder, listExpiringOrders } from '@/lib/db';

// Vercel cron hits this on a schedule (see vercel.json). Also hittable
// manually for testing by including `authorization: Bearer <CRON_SECRET>`.
// Guards against unauthenticated abuse so nobody can trigger the wipe from
// the outside without the secret.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization') || '';
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  const expiring = await listExpiringOrders();
  const ids: string[] = [];
  for (const o of expiring) {
    await expireOrder(o.id);
    ids.push(o.id);
  }
  return NextResponse.json({ expired: ids.length, ids });
}
