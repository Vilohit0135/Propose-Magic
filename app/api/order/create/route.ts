import { NextResponse } from 'next/server';
import { createOrder, setStatus } from '@/lib/db';
import { getMessage } from '@/lib/mock-data';
import type { OrderDraft } from '@/lib/order';
import { FLOWS, PACKAGES, TEMPLATES, TONES } from '@/lib/tokens';

const ALLOWED_PACKAGES = new Set(Object.keys(PACKAGES));
const ALLOWED_FLOWS = new Set(Object.keys(FLOWS));
const ALLOWED_TONES = new Set(Object.keys(TONES));
const ALLOWED_TEMPLATES = new Set(Object.keys(TEMPLATES));
const ALLOWED_REVEAL_STYLES = new Set(['three_clues', 'trivia', 'sensory']);
const ALLOWED_REVEAL_DIFFICULTIES = new Set(['easy', 'medium', 'hard']);
const ALLOWED_PHOTO_LAYOUTS = new Set(['slideshow', 'polaroid', 'filmstrip', 'grid']);
const ALLOWED_VIDEO_TREATMENTS = new Set(['letterbox', 'dreamy', 'vintage', 'fullbleed']);

function str(v: unknown, max = 200): string {
  if (typeof v !== 'string') return '';
  return v.slice(0, max);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const from_name = str(body.from_name, 100).trim();
  const to_name = str(body.to_name, 100).trim();
  const email = str(body.email, 200).trim();
  const flow = str(body.flow, 30);
  const sub_flow = str(body.sub_flow, 50);
  const tone = str(body.tone, 30);
  const template = str(body.template, 30);
  const package_type = str(body.package_type, 20);

  if (!from_name || !to_name) {
    return NextResponse.json({ error: 'missing_names' }, { status: 400 });
  }
  if (!email.includes('@') || email.length < 5) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }
  if (!ALLOWED_FLOWS.has(flow)) {
    return NextResponse.json({ error: 'invalid_flow' }, { status: 400 });
  }
  const flowDef = FLOWS[flow as keyof typeof FLOWS];
  if (!(sub_flow in flowDef.subFlows)) {
    return NextResponse.json({ error: 'invalid_sub_flow' }, { status: 400 });
  }
  if (!ALLOWED_TONES.has(tone)) {
    return NextResponse.json({ error: 'invalid_tone' }, { status: 400 });
  }
  if (!ALLOWED_TEMPLATES.has(template)) {
    return NextResponse.json({ error: 'invalid_template' }, { status: 400 });
  }
  if (!ALLOWED_PACKAGES.has(package_type)) {
    return NextResponse.json({ error: 'invalid_package' }, { status: 400 });
  }

  const reveal_style_raw = str(body.reveal_style, 20);
  const reveal_diff_raw = str(body.reveal_difficulty, 10);
  const photo_layout_raw = str(body.photo_layout, 20);
  const video_treatment_raw = str(body.video_treatment, 30);

  const draft: OrderDraft = {
    from_name,
    to_name,
    story: str(body.story, 2000) || null,
    email,
    flow: flow as OrderDraft['flow'],
    sub_flow,
    is_anonymous: body.is_anonymous === true,
    reveal_style: ALLOWED_REVEAL_STYLES.has(reveal_style_raw)
      ? (reveal_style_raw as OrderDraft['reveal_style'])
      : null,
    reveal_difficulty: ALLOWED_REVEAL_DIFFICULTIES.has(reveal_diff_raw)
      ? (reveal_diff_raw as OrderDraft['reveal_difficulty'])
      : null,
    reveal_content: null,
    package_type: package_type as OrderDraft['package_type'],
    tone: tone as OrderDraft['tone'],
    template: template as OrderDraft['template'],
    photo_urls: Array.isArray(body.photo_urls)
      ? (body.photo_urls as unknown[])
          .filter((u): u is string => typeof u === 'string')
          .slice(0, 10)
      : [],
    photo_captions: Array.isArray(body.photo_captions)
      ? (body.photo_captions as unknown[])
          .filter((u): u is string => typeof u === 'string')
          .slice(0, 10)
      : [],
    photo_layout: ALLOWED_PHOTO_LAYOUTS.has(photo_layout_raw)
      ? (photo_layout_raw as OrderDraft['photo_layout'])
      : null,
    scratch_photo_index:
      typeof body.scratch_photo_index === 'number' ? body.scratch_photo_index : null,
    video_treatment: ALLOWED_VIDEO_TREATMENTS.has(video_treatment_raw)
      ? (video_treatment_raw as OrderDraft['video_treatment'])
      : null,
  };

  const order = await createOrder(draft);

  // No payment gate for now — kick off generation immediately.
  // Run asynchronously so the client sees GENERATING, then COMPLETED on poll.
  await setStatus(order.id, 'GENERATING');
  setTimeout(() => {
    try {
      const message = getMessage(order.sub_flow, order.tone, order.is_anonymous);
      void setStatus(order.id, 'COMPLETED', { generated_message: message });
    } catch {
      void setStatus(order.id, 'FAILED');
    }
  }, 2500);

  return NextResponse.json({
    id: order.id,
    short_id: order.short_id,
    status: 'GENERATING',
  });
}
