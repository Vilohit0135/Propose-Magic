import { NextResponse } from 'next/server';
import { createOrder, setStatus } from '@/lib/db';
import { generateLetter } from '@/lib/generate-letter';
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
const ALLOWED_GENDERS = new Set(['he', 'she', 'they']);

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
  const from_gender_raw = str(body.from_gender, 10);
  const from_gender = ALLOWED_GENDERS.has(from_gender_raw) ? from_gender_raw : 'they';
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
  const reveal_content = sanitizeRevealContent(body.reveal_content);
  const photo_layout_raw = str(body.photo_layout, 20);
  const video_treatment_raw = str(body.video_treatment, 30);

  const draft: OrderDraft = {
    from_name,
    from_gender: from_gender as OrderDraft['from_gender'],
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
    reveal_content,
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
    video_url:
      typeof body.video_url === 'string' && body.video_url.trim()
        ? body.video_url.trim().slice(0, 2000)
        : null,
    video_clip_urls: Array.isArray(body.video_clip_urls)
      ? (body.video_clip_urls as unknown[])
          .filter((u): u is string => typeof u === 'string')
          .map((u) => u.trim())
          .filter((u) => u.length > 0 && u.length <= 2000)
          .slice(0, 5)
      : [],
    video_treatment: ALLOWED_VIDEO_TREATMENTS.has(video_treatment_raw)
      ? (video_treatment_raw as OrderDraft['video_treatment'])
      : null,
    music_video_id:
      typeof body.music_video_id === 'string' &&
      /^[a-zA-Z0-9_-]{11}$/.test(body.music_video_id)
        ? body.music_video_id
        : null,
    music_start_seconds:
      typeof body.music_start_seconds === 'number' &&
      Number.isFinite(body.music_start_seconds) &&
      body.music_start_seconds >= 0 &&
      body.music_start_seconds <= 36000
        ? Math.floor(body.music_start_seconds)
        : null,
  };

  const order = await createOrder(draft);

  // No payment gate for now — kick off generation immediately.
  // Run asynchronously so the client sees GENERATING, then COMPLETED on poll.
  // generateLetter() calls Claude; it handles its own errors and falls back to
  // the hardcoded mock if ANTHROPIC_API_KEY is missing or the call fails.
  await setStatus(order.id, 'GENERATING');
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
    } catch {
      await setStatus(order.id, 'FAILED');
    }
  })();

  return NextResponse.json({
    id: order.id,
    short_id: order.short_id,
    status: 'GENERATING',
  });
}

// Accept a narrow RevealContent shape or null. Anything malformed → null,
// so the receiver falls back to built-in defaults without erroring.
function sanitizeRevealContent(
  raw: unknown,
): OrderDraft['reveal_content'] {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const style = typeof r.style === 'string' ? r.style : '';

  if (style === 'three_clues') {
    const clues = Array.isArray(r.clues)
      ? r.clues
          .filter((c): c is string => typeof c === 'string')
          .map((c) => c.slice(0, 200))
          .slice(0, 3)
      : [];
    const decoys = Array.isArray(r.decoys)
      ? r.decoys
          .filter((d): d is string => typeof d === 'string')
          .map((d) => d.slice(0, 40))
          .slice(0, 3)
      : [];
    if (clues.length === 0) return null;
    return { style: 'three_clues', clues, decoys };
  }

  if (style === 'trivia' || style === 'sensory') {
    const qs = Array.isArray(r.questions) ? r.questions : [];
    const sanitized = qs
      .filter(
        (q): q is { q: string; choices: string[]; correct: number } =>
          !!q &&
          typeof q === 'object' &&
          typeof (q as Record<string, unknown>).q === 'string' &&
          Array.isArray((q as Record<string, unknown>).choices) &&
          typeof (q as Record<string, unknown>).correct === 'number',
      )
      .slice(0, 3);
    if (sanitized.length === 0) return null;
    return style === 'trivia'
      ? { style: 'trivia', questions: sanitized }
      : { style: 'sensory', questions: sanitized };
  }
  return null;
}
