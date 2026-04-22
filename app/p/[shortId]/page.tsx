import { notFound } from 'next/navigation';
import { getOrderByShortId } from '@/lib/db';
import { orderToState } from '@/lib/order-to-state';
import { getExample } from '@/lib/examples';
import { ReceiverPageClient } from './receiver-page-client';
import { NotReadyYet } from './not-ready-yet';

export const dynamic = 'force-dynamic';

export default async function ReceiverPage(props: PageProps<'/p/[shortId]'>) {
  const { shortId } = await props.params;

  // Examples gallery: stable slugs like `ex-rose-proposal` render from a hardcoded
  // demo state without touching the order store.
  if (shortId.startsWith('ex-')) {
    const example = getExample(shortId);
    if (!example) notFound();
    return <ReceiverPageClient state={example.state} />;
  }

  const order = await getOrderByShortId(shortId);
  if (!order) notFound();

  if (order.status !== 'COMPLETED') {
    return <NotReadyYet shortId={shortId} status={order.status} />;
  }

  const state = orderToState(order);
  return <ReceiverPageClient state={state} />;
}
