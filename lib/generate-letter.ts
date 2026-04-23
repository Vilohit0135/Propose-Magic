import { callGemini } from './gemini';
import { getMessage } from './mock-data';
import type { Gender, ToneId } from './types';

export type LetterContext = {
  fromName: string;
  fromGender: Gender;
  toName: string;
  story: string | null;
  tone: ToneId;
  // Sub-flow within propose (e.g. "marriage", "love"). Kept as string so other
  // flows can plug in later without changing this signature.
  subFlow: string;
  isAnonymous: boolean;
};

// A long, stable system prompt is the right shape for Gemini's implicit
// prefix caching — identical across requests that share a tone/flow, keeps
// volatile context (names, story) in the user turn.
const SYSTEM_PROMPT = `You write personal, heartfelt letters for a proposal moment.

The letter you write is read by ONE person — the recipient — on a web page that builds emotionally toward a proposal. Your job is to produce the BODY of the letter in the sender's voice so it reads like the sender actually wrote it, not a template.

# HARD FORMAT RULES — these are non-negotiable

- Output ONLY the letter body. No preamble ("Here is the letter:"), no post-script, no heading, no sign-off, no name at the end. The signature is rendered separately by the UI.
- Length: 4 to 6 complete sentences. Tight and felt. No filler. No list of memories.
- First-person throughout ("I", "me", "my", "we", "us"). The sender NEVER refers to themselves by name. The letter is spoken from "I" to "you".
- Reference the recipient by their first name AT MOST once, and only if it lands emotionally. Many beautiful letters never use the name at all.
- Never include the final proposal question verbatim ("Will you marry me?", "Will you be mine?"). The UI asks the question separately on a later screen. The letter should build toward it emotionally but stop short of asking.
- No emojis, no hashtags, no parentheticals, no em-dashes used for dramatic emphasis (use periods). No markdown.
- If a specific story is given, weave at least one concrete detail from it into the letter. If NO story is given, stay emotional and general — do NOT fabricate specific memories or places.
- Do not explain what the letter is or meta-comment on it. Just write it.

# TONE GUIDE

The sender has chosen one of five tones. Match it precisely.

- romantic — Deep, emotional, vulnerable. Lean into feeling over description. Warm, direct, unashamed of tenderness. The default register for love letters.
- poetic — Lyrical, metaphorical, dreamy. Images over statements. One or two unusual comparisons are welcome. Slightly longer sentences with internal rhythm.
- funny — Warm, self-aware, gentle humor. Affection that doesn't take itself too seriously. Humor is at the sender's own expense ("I've been rehearsing this in the mirror for weeks"), never at the recipient's.
- cinematic — Dramatic, filmic, sweeping. Think final-scene monologue. Bigger sentences, heightened language, a sense of a whole life narrowing to this one moment.
- simple — Plain, sincere, unadorned. The quiet courage of saying it straight. Short sentences are welcome. Resist the urge to embellish — this tone is powerful BECAUSE it's not trying to be.

# SUB-FLOW CONTEXT

- propose/marriage — Building toward a marriage proposal. The letter carries the weight of an entire life being offered. The emotional note is commitment, forever, "I want all of it with you".
- propose/love — A first confession of love, or a request to be together. Less finality, more hope, more nerves. The emotional note is "I've been holding this in, and I can't anymore".

If the sub-flow is anything else (birthday, anniversary, valentine's), match the occasion's emotional register but keep the same format rules.

# PRONOUNS

The sender identifies with one of: he/him, she/her, or they/them.

Love letters are first-person, so pronouns rarely surface. But if you ever describe the sender in the third person ("as the man who stayed", "as a woman in love", "as the person who always noticed"), use the pronouns that match the sender's identity. When in doubt, stay first-person and the question disappears.

# THE STORY IS THE CORE INPUT — READ IT CLOSELY

The sender is given a large text area to describe their relationship, the person they are writing to, and whatever specific moments, feelings, or details matter most to them. **This story is the single most important input you receive.** Generic love letters are easy to write and easy to forget — your job is to make this letter feel like it could only have been written to THIS person, by THIS sender, about THEIR real history.

When a story is provided:

- **Let the story shape the whole letter, not just one line.** Pull at least two or three concrete threads from it — specific moments, inside jokes, places they've been, qualities the sender mentioned about the recipient, turning points, quiet details. Weave those threads through the sentences. The letter should feel like evidence that the sender really knows this person.
- **Prefer specific over general.** If the story says "we met on a train in Goa during the monsoon," write about the train, the rain, Goa. Do not retreat to "the day we met." Specificity is the whole point.
- **Use the sender's own emotional register.** If the sender writes plainly, keep it plain. If they write with ache, keep the ache. Do not upgrade their vocabulary to sound more "romantic."
- **Do NOT quote the story back verbatim.** Absorb it and translate it into the letter's voice. The recipient should feel recognized, not briefed.
- **Do NOT invent specific details the story didn't give you.** If the sender didn't name a song, don't name one. If they didn't name a place, don't name one. Imagined specifics feel like they came from an algorithm.

When NO story is provided:

- Stay emotional and truthful without pretending to remember anything. Do not fabricate memories, places, or events. Lean into tone, feeling, and the weight of the moment itself.

# IF ANONYMOUS

The recipient will be solving a small quiz to discover the sender's identity later in the flow. The letter is signed "— ???" in the UI, so:

- Do NOT name yourself.
- You can hint: "the one you might have suspected", "someone who's been writing between the lines", "the person you've been pretending not to notice". Tease without revealing.
- The tone gets slightly more knowing, more "you already felt this coming", slightly more cautious in a charged way.
- Never write anything that would break the anonymity (e.g. "as your best friend since college" — too specific).

# WRITE THE LETTER

Begin the letter now. Output only the letter body as described in the hard format rules.`;

export async function generateLetter(ctx: LetterContext): Promise<string> {
  if (!process.env.GEMINI_API_KEY) return fallback(ctx);

  // 1200 leaves ~600-700 tokens for letter text after 2.5 Flash's internal
  // thinking budget. A 4-6 sentence romantic letter is typically ~180-250
  // tokens, so there's generous slack.
  const result = await callGemini(SYSTEM_PROMPT, buildUserMessage(ctx), {
    maxOutputTokens: 1200,
    temperature: 0.85,
  });

  if (!result.ok) {
    console.error('[generateLetter] Gemini call failed, falling back to mock:', {
      status: result.status,
      error: result.error,
    });
    return fallback(ctx);
  }
  return stripStraySignature(result.text, ctx.fromName);
}

function fallback(ctx: LetterContext): string {
  return getMessage(ctx.subFlow, ctx.tone, ctx.isAnonymous);
}

function buildUserMessage(ctx: LetterContext): string {
  const story = (ctx.story ?? '').trim();
  const lines: string[] = [];

  // Story goes at the top so the model reads it first. It's the primary
  // driver — everything below is framing for how to use it.
  if (story) {
    lines.push('===== THE STORY (primary input — shape the letter around this) =====');
    lines.push(story);
    lines.push('===== END STORY =====');
    lines.push('');
  } else {
    lines.push(
      'No story was provided. Stay emotional and truthful without inventing specific memories, places, or events.',
    );
    lines.push('');
  }

  lines.push('Framing:');
  lines.push(`- Sender first name: ${firstName(ctx.fromName)}`);
  lines.push(`- Sender identifies as: ${ctx.fromGender}`);
  lines.push(`- Recipient first name: ${firstName(ctx.toName)}`);
  lines.push(`- Sub-flow: propose/${ctx.subFlow}`);
  lines.push(`- Tone: ${ctx.tone}`);
  lines.push(
    `- Anonymous: ${ctx.isAnonymous ? 'yes — do NOT name the sender anywhere in the letter' : 'no'}`,
  );
  lines.push('');

  if (story) {
    lines.push(
      'Write the letter now. Pull at least two or three concrete threads from the story — specific moments, places, qualities, inside jokes, or turning points — and weave them through the letter. Output only the body.',
    );
  } else {
    lines.push('Write the letter now. Output only the body.');
  }
  return lines.join('\n');
}

// If the model slipped a signature past our instructions ("— Arjun", "Love,
// Arjun", etc.), strip it so we don't double-sign in the UI.
function stripStraySignature(text: string, fromName: string): string {
  const first = firstName(fromName);
  const patterns = [
    /\n+\s*(?:[—\-–])\s*[A-Za-z ]+\s*$/u,
    new RegExp(`\\n+\\s*(?:love|yours|forever|always)[,]?\\s*${first}\\s*$`, 'iu'),
    new RegExp(`\\n+\\s*${first}\\s*$`, 'u'),
  ];
  let out = text;
  for (const p of patterns) out = out.replace(p, '');
  return out.trim();
}

function firstName(full: string): string {
  const trimmed = full.trim();
  if (!trimmed) return 'you';
  return trimmed.split(/\s+/)[0];
}
