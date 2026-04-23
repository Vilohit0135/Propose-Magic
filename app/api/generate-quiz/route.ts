import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import type { RevealContent, RevealStyle } from '@/lib/types';

// Generates quiz content from a sender's story via Claude. Returns either:
//   { status: 'ok', content: RevealContent }
//   { status: 'insufficient', reason: string }
//
// The client shows the returned questions in an editable form. The sender
// can tweak anything before saving.

const SYSTEM = `You generate a short romantic-gesture quiz from a sender's story about their relationship. The recipient solves the quiz to unlock the sender's identity inside an anonymous proposal flow.

Your job is to decide whether the story has enough concrete material to build the requested quiz style, and then either return the quiz in strict JSON or politely decline.

# SUFFICIENCY CHECK

Before generating, judge whether the story contains enough specific, memorable, recipient-resolvable detail to build questions only THIS recipient could answer. Required signals:
- At least two concrete facts the recipient would recognize (places, events, habits, shared rituals, inside jokes, qualities, named moments).
- Enough voice or detail to write clues that don't feel generic.

If the story is fewer than 2 concrete facts, or is very generic ("we have been together a while, I love her"), or contains ONLY feelings without anchors, it is insufficient.

# OUTPUT — ALWAYS STRICT JSON, NO PROSE

If INSUFFICIENT:
{"status":"insufficient","reason":"<one short sentence the UI will show the sender; be helpful, suggest what to add>"}

If SUFFICIENT, the shape depends on the requested style.

## three_clues
{"status":"ok","content":{"style":"three_clues","clues":[string, string, string],"decoys":[string, string, string]}}
- Each clue is ONE sentence, written in the sender's voice ("We first…", "You once…"), referencing something specific from the story. The recipient should read a clue and think "oh, of course it's them."
- clues[0] should be the gentlest hint; clues[2] the most direct. The recipient sees them one at a time.
- decoys are 3 plausible but fictional first names (NOT the sender's) that will sit alongside the sender's name as wrong answers. Indian names default, unless the story suggests otherwise.

## trivia
{"status":"ok","content":{"style":"trivia","questions":[{"q":string,"choices":[string,string,string,string],"correct":integer},{...},{...}]}}
- Exactly 3 questions. Each has exactly 4 choices. 'correct' is the 0-indexed position of the right answer.
- Every question must reference a specific detail from the story — a real memory, habit, or shared moment. The wrong answers must be plausible (not obviously silly) but distinguishable to someone who actually knows the sender.
- Vary the correct index across the three questions — do not always put the answer at position 0.

## sensory
{"status":"ok","content":{"style":"sensory","questions":[{"q":string,"choices":[string,string,string,string],"correct":integer},{...},{...}]}}
- Sensory uses the same shape as trivia but the questions are softer, more evocative: emotional impressions rather than hard facts. Correct answers are still anchored in the story — they reflect the real emotional texture of the relationship. Wrong answers are plausible but don't fit the story.

# STRICT RULES

- Output ONE JSON object. No prose, no markdown, no code fences.
- No trailing comments, no "explanation" keys.
- Never invent specifics the story didn't give you. If the story didn't name a city, don't put a city in a question. If it didn't name a song, don't name a song. When in doubt, stay abstract.
- Never name the sender. Never name the recipient in a way that would identify them beyond the given first name.
- Keep each string under 120 characters.

Begin now. Output only the JSON object.`;

function buildUser(story: string, style: RevealStyle, fromName: string): string {
  return [
    `Sender first name: ${fromName}`,
    `Reveal style requested: ${style}`,
    '',
    '===== THE STORY =====',
    story,
    '===== END STORY =====',
    '',
    'Respond with a single JSON object. No prose.',
  ].join('\n');
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'gemini_not_configured' },
      { status: 503 },
    );
  }

  const story = typeof body.story === 'string' ? body.story.slice(0, 2000).trim() : '';
  const style = typeof body.style === 'string' ? body.style : '';
  const fromName =
    typeof body.from_name === 'string' ? body.from_name.slice(0, 100).trim() : '';

  if (!story) {
    return NextResponse.json(
      { status: 'insufficient', reason: 'Share a story above first — that is what the quiz is built from.' },
      { status: 200 },
    );
  }
  if (!['three_clues', 'trivia', 'sensory'].includes(style)) {
    return NextResponse.json({ error: 'invalid_style' }, { status: 400 });
  }
  if (!fromName) {
    return NextResponse.json({ error: 'missing_from_name' }, { status: 400 });
  }

  const result = await callGemini(
    SYSTEM,
    buildUser(story, style as RevealStyle, fromName),
    { maxOutputTokens: 2000, temperature: 0.6, json: true },
  );

  if (!result.ok) {
    console.error('[generate-quiz] Gemini call failed:', result);
    if (result.status === 401 || result.status === 403) {
      return NextResponse.json({ error: 'gemini_auth' }, { status: 401 });
    }
    if (result.status === 429) {
      return NextResponse.json({ error: 'gemini_rate_limit' }, { status: 429 });
    }
    return NextResponse.json({ error: 'generation_failed' }, { status: 500 });
  }

  const parsed = safeParseJson(result.text);
  if (!parsed) {
    return NextResponse.json(
      { status: 'insufficient', reason: 'Could not read the generated response. Try again, or fill it in manually.' },
      { status: 200 },
    );
  }

  if (parsed.status === 'insufficient') {
    const reason =
      typeof parsed.reason === 'string' && parsed.reason.trim()
        ? parsed.reason.trim()
        : 'Add more specific details to your story — places, moments, inside jokes — then try again.';
    return NextResponse.json({ status: 'insufficient', reason });
  }

  if (parsed.status === 'ok' && parsed.content) {
    const content = sanitizeContent(parsed.content, style as RevealStyle);
    if (!content) {
      return NextResponse.json(
        { status: 'insufficient', reason: 'The generated quiz was incomplete. Try again, or fill it in manually.' },
        { status: 200 },
      );
    }
    return NextResponse.json({ status: 'ok', content });
  }

  return NextResponse.json(
    { status: 'insufficient', reason: 'Unexpected response shape. Try again, or fill it in manually.' },
    { status: 200 },
  );
}

function safeParseJson(raw: string): { status?: string; reason?: string; content?: unknown } | null {
  // Claude is instructed to return only JSON, but wrap defensively in case it
  // slips a sentence or a ```json fence around the payload.
  const trimmed = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Try to extract the first top-level {...} block
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function sanitizeContent(raw: unknown, style: RevealStyle): RevealContent | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

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
    if (clues.length !== 3 || decoys.length !== 3) return null;
    return { style: 'three_clues', clues, decoys };
  }

  if (style === 'trivia' || style === 'sensory') {
    const qs = Array.isArray(r.questions) ? r.questions : [];
    const sanitized = qs
      .map((q): { q: string; choices: string[]; correct: number } | null => {
        if (!q || typeof q !== 'object') return null;
        const o = q as Record<string, unknown>;
        const qText = typeof o.q === 'string' ? o.q.slice(0, 200) : null;
        const choices = Array.isArray(o.choices)
          ? o.choices
              .filter((c): c is string => typeof c === 'string')
              .map((c) => c.slice(0, 120))
          : [];
        const correct = typeof o.correct === 'number' ? Math.floor(o.correct) : -1;
        if (!qText || choices.length !== 4) return null;
        if (correct < 0 || correct > 3) return null;
        return { q: qText, choices, correct };
      })
      .filter((q): q is { q: string; choices: string[]; correct: number } => q !== null)
      .slice(0, 3);

    if (sanitized.length !== 3) return null;
    return style === 'trivia'
      ? { style: 'trivia', questions: sanitized }
      : { style: 'sensory', questions: sanitized };
  }

  return null;
}
