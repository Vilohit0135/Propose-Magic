import { notFound } from 'next/navigation';
import { expireOrder, getOrderByShortId, isExpired } from '@/lib/db';
import { orderToState } from '@/lib/order-to-state';
import { getExample } from '@/lib/examples';
import { ReceiverPageClient } from './receiver-page-client';
import { NotReadyYet } from './not-ready-yet';
import { ExpiredPage } from './expired';

export const dynamic = 'force-dynamic';

export default async function ReceiverPage(props: PageProps<'/p/[shortId]'>) {
  const { shortId } = await props.params;

  // Examples gallery: stable slugs like `ex-rose-proposal` render from a hardcoded
  // demo state without touching the order store. Examples never expire.
  if (shortId.startsWith('ex-')) {
    const example = getExample(shortId);
    if (!example) notFound();
    return <ReceiverPageClient state={example.state} />;
  }

  const order = await getOrderByShortId(shortId);
  if (!order) notFound();

  // Lazy expire on visit. If the cron sweep hasn't run yet but the 48h
  // window has elapsed, this turn of the page tears the media + PII down
  // before we render anything that could leak it.
  if (isExpired(order)) {
    if (order.status !== 'EXPIRED') await expireOrder(order.id);
    return <ExpiredPage />;
  }

  if (order.status !== 'COMPLETED') {
    return <NotReadyYet shortId={shortId} status={order.status} />;
  }

  const state = orderToState(order);
  return <ReceiverPageClient state={state} />;
}
