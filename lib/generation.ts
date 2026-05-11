import { getOrderById, setStatus } from './db';
import { generateLetter } from './generate-letter';

// Kicks off the AI message generation for a paid order. Extracted from
// /api/order/create so both the Cashfree webhook and the verify route
// can fire it — whichever confirms payment first wins.
//
// Idempotent at the DB level: setStatus('GENERATING') is a no-op if
// the row is already past PENDING, so a duplicate call from webhook +
// verify won't trigger a double generation. (The generation work
// itself isn't quite idempotent yet — second call would re-hit Gemini
// and overwrite generated_message — but the gate below stops that.)
export async function startGeneration(orderId: string): Promise<void> {
  const order = await getOrderById(orderId);
  if (!order) {
    console.warn('[generation] order not found:', orderId);
    return;
  }
  // Already generating, completed, or failed — don't re-fire.
  if (order.status !== 'PENDING' && order.status !== 'PAID') {
    return;
  }

  await setStatus(order.id, 'GENERATING');

  // Fire async, don't block the HTTP response.
  void (async () => {
    try {
      const message = await generateLetter({
        fromName: order.from_name,
        fromGender: order.from_gender,
        toName: order.to_name,
        story: order.story,
        tone: order.tone,
        subFlow: order.sub_flow,
        isAnonymous: order.is_anonymous,
      });
      await setStatus(order.id, 'COMPLETED', { generated_message: message });
    } catch (err) {
      console.error('[generation] failed for', order.id, err);
      await setStatus(order.id, 'FAILED');
    }
  })();
}
