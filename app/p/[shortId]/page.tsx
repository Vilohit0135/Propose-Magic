import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { expireOrder, getOrderByShortId, isExpired } from '@/lib/db';
import { orderToState } from '@/lib/order-to-state';
import { getExample } from '@/lib/examples';
import { ReceiverPageClient } from './receiver-page-client';
import { NotReadyYet } from './not-ready-yet';
import { ExpiredPage } from './expired';

export const dynamic = 'force-dynamic';

// Override the root layout's "ProposeMagic" branding for individual
// receiver links. WhatsApp / iMessage / Telegram fetch these OG tags
// when a link is pasted and render them as the preview card — so the
// sender sees a personalized teaser instead of our app name.
//
// We deliberately omit og:site_name so link previews don't show
// "ProposeMagic" as the source. The raw domain still appears in the
// URL text (only a new domain fixes that), but the headline/subtitle
// of the preview card is fully ours to control.
export async function generateMetadata(
  props: PageProps<'/p/[shortId]'>,
): Promise<Metadata> {
  const { shortId } = await props.params;

  // Fallback copy before any per-order personalization — used when the
  // DB lookup fails, the link is expired, or the shortId belongs to the
  // examples gallery.
  const fallback: Metadata = {
    title: 'A little something for you',
    description: 'Tap to open it when you have a quiet moment ♥',
    openGraph: {
      title: 'A little something for you',
      description: 'Tap to open it when you have a quiet moment ♥',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'A little something for you',
      description: 'Tap to open it when you have a quiet moment ♥',
    },
    robots: { index: false, follow: false },
  };

  if (shortId.startsWith('ex-')) return fallback;

  try {
    const order = await getOrderByShortId(shortId);
    if (!order || order.status === 'EXPIRED' || isExpired(order)) {
      return fallback;
    }
    // Anonymous orders never leak the sender's name; we also keep the
    // receiver's name out of the title so if a stranger sees the link
    // in a forward, they don't learn who it was intended for.
    const firstTo = !order.is_anonymous
      ? (order.to_name || '').trim().split(/\s+/)[0]
      : '';
    const title = firstTo
      ? `A little something for ${firstTo} ♥`
      : fallback.title!;
    const description = 'Tap to open it when you have a quiet moment ♥';

    return {
      title: title as string,
      description,
      openGraph: {
        title: title as string,
        description,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: title as string,
        description,
      },
      robots: { index: false, follow: false },
    };
  } catch {
    return fallback;
  }
}

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
