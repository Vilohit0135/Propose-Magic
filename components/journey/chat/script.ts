import { DEMO_PHOTOS } from '@/lib/tokens';
import { getMessage } from '@/lib/mock-data';
import type { OrderState, PhotoLayoutId, VideoTreatmentId } from '@/lib/types';

export type ChatSection =
  | 'hello'
  | 'memories'
  | 'letter'
  | 'tension'
  | 'question';

type Base = {
  id: string;
  section: ChatSection;
  from: 'them' | 'system';
  typingMs: number;
  gapAfterMs: number;
};

export type ChatMessage =
  | (Base & { kind: 'text'; text: string; italic?: boolean; emphasis?: boolean })
  | (Base & { kind: 'photo'; url: string })
  | (Base & { kind: 'chapter-title'; text: string })
  | (Base & { kind: 'gallery'; urls: string[]; layout: PhotoLayoutId })
  | (Base & { kind: 'video'; url: string; treatment: VideoTreatmentId })
  | (Base & {
      kind: 'letter';
      text: string;
      signatureName: string;
      anonSignature: boolean;
    })
  | (Base & { kind: 'contact-card'; title: string; subtitle: string });

const typingFor = (chars: number) => Math.min(2500, Math.max(600, chars * 22));

export function buildScript(state: OrderState): ChatMessage[] {
  const msgs: ChatMessage[] = [];
  const hasMemories = state.package !== 'basic';
  const hasVideo = state.package === 'photos_video';
  const first = firstName(state.toName);

  // --- A. Hello ---
  msgs.push(text('hello-1', 'hello', `Hey ${first}`, 1000));
  msgs.push(
    text(
      'hello-2',
      'hello',
      state.isAnonymous
        ? "You don't know it's me yet. That's the point."
        : "I've been sitting on something for a while…",
      1100,
    ),
  );
  msgs.push(text('hello-3', 'hello', 'Can I show you something?', 0));

  // --- B. Memories ---
  // Flow: "Remember this?" → hero photo → (if anon: reveal gate inlined here,
  // tap the contact card to unlock identity) → "Where it all began" chapter
  // title → gallery (sender's chosen layout). The chapter-title and gallery
  // are silent (no typing indicator) and animate in with motion.
  if (hasMemories) {
    const pool = state.photos.length ? state.photos : DEMO_PHOTOS;
    const hero = pool[0];
    const album = pool.length > 1 ? pool.slice(1, 7) : pool;

    msgs.push(text('mem-1', 'memories', 'Remember this?', 1400));
    msgs.push(photo('mem-2', 'memories', hero, 2200));

    if (state.isAnonymous) {
      msgs.push(text('mem-reveal-1', 'memories', 'Before I show you more…', 1100));
      msgs.push(
        text('mem-reveal-2', 'memories', 'You need to prove you know me.', 1200),
      );
      msgs.push({
        kind: 'contact-card',
        id: 'mem-reveal-card',
        section: 'memories',
        from: 'system',
        title: 'Unknown contact',
        subtitle: 'Tap to verify identity',
        typingMs: 600,
        gapAfterMs: 0,
      });
    }

    msgs.push({
      kind: 'chapter-title',
      id: 'mem-title',
      section: 'memories',
      from: 'system',
      text: 'Where it all began',
      typingMs: 400,
      gapAfterMs: 900,
    });
    msgs.push({
      kind: 'gallery',
      id: 'mem-gallery',
      section: 'memories',
      from: 'system',
      urls: album,
      layout: state.photoLayout || 'polaroid',
      typingMs: 0,
      gapAfterMs: 0,
    });
  }

  // --- C. Letter (popup — chat pauses, letter typing renders in overlay) ---
  const raw = state.generatedMessage ?? getMessage(state.subFlow, state.tone, state.isAnonymous);
  msgs.push({
    kind: 'letter',
    id: 'letter-1',
    section: 'letter',
    from: 'them',
    text: raw,
    signatureName: state.fromName,
    anonSignature: state.isAnonymous,
    typingMs: 2500,
    gapAfterMs: 0,
  });

  if (hasVideo) {
    const videoStill = state.photos[2] || state.photos[0] || DEMO_PHOTOS[3];
    msgs.push({
      kind: 'video',
      id: 'video-1',
      section: 'letter',
      from: 'them',
      url: videoStill,
      treatment: state.videoTreatment || 'letterbox',
      typingMs: 800,
      gapAfterMs: 0,
    });
  }

  // --- D. Tension build — runs for both anon and non-anon now that the
  // reveal gate has moved into the memories section.
  msgs.push(text('tension-1', 'tension', "I don't want anything to change.", 1300));
  msgs.push(text('tension-2', 'tension', 'I love how we are right now.', 1400));
  msgs.push(text('tension-3', 'tension', "But I can't wait any longer.", 0));

  // --- E. Question entry beat (chat exits after this) ---
  msgs.push({
    kind: 'text',
    id: 'q-1',
    section: 'question',
    from: 'them',
    text: `${first}…`,
    italic: true,
    emphasis: true,
    typingMs: 3000,
    gapAfterMs: 0,
  });

  return msgs;
}

export function sectionsFor(state: OrderState): ChatSection[] {
  const out: ChatSection[] = ['hello'];
  if (state.package !== 'basic') out.push('memories');
  out.push('letter', 'tension', 'question');
  return out;
}

// Messages that render their own entrance (motion-driven) and shouldn't be
// preceded by a chat typing indicator. The letter is NOT silent — typing dots
// for its ~2.5s typingMs give the popup an anticipatory beat before it opens.
export function isSilentKind(kind: ChatMessage['kind'] | undefined): boolean {
  return kind === 'chapter-title' || kind === 'gallery';
}

function text(
  id: string,
  section: ChatSection,
  body: string,
  gap: number,
): ChatMessage {
  return {
    kind: 'text',
    id,
    section,
    from: 'them',
    text: body,
    typingMs: typingFor(body.length),
    gapAfterMs: gap,
  };
}

function photo(
  id: string,
  section: ChatSection,
  url: string,
  gap: number,
): ChatMessage {
  return {
    kind: 'photo',
    id,
    section,
    from: 'them',
    url,
    typingMs: 900,
    gapAfterMs: gap,
  };
}

function firstName(full: string): string {
  const trimmed = full.trim();
  if (!trimmed) return 'you';
  return trimmed.split(/\s+/)[0];
}
