import { DEMO_PHOTOS } from './tokens';
import { getMessage } from './mock-data';
import type { OrderState, TemplateId } from './types';

export type Example = {
  slug: string;
  label: string;
  blurb: string;
  template: TemplateId;
  state: OrderState;
};

function makeState(overrides: Partial<OrderState>): OrderState {
  const base: OrderState = {
    fromName: 'Arjun',
    fromGender: 'he',
    toName: 'Priya',
    story: '',
    email: 'demo@proposemagic.in',
    flow: 'propose',
    subFlow: 'marriage',
    tone: 'romantic',
    template: 'rose_dark',
    package: 'photos',
    photos: DEMO_PHOTOS.slice(0, 6),
    photoLayout: 'polaroid',
    videos: [],
    videoUrl: null,
    videoTreatment: 'letterbox',
    musicUrl: '',
    musicVideoId: null,
    musicStartSeconds: null,
    scratchIndex: 0,
    isAnonymous: false,
    revealStyle: 'three_clues',
    revealDifficulty: 'easy',
    revealContent: null,
    generatedMessage: null,
  };
  const merged = { ...base, ...overrides };
  merged.generatedMessage = getMessage(merged.subFlow, merged.tone, merged.isAnonymous);
  return merged;
}

export const EXAMPLES: Example[] = [
  {
    slug: 'ex-rose-proposal',
    label: 'Marriage Proposal',
    blurb: 'Deeply romantic · Rose Dark · Named',
    template: 'rose_dark',
    state: makeState({
      fromName: 'Arjun',
      toName: 'Priya',
      flow: 'propose',
      subFlow: 'marriage',
      template: 'rose_dark',
      tone: 'romantic',
      package: 'photos',
    }),
  },
  {
    slug: 'ex-midnight-anon-birthday',
    label: 'Anonymous Birthday',
    blurb: 'Cosmic · Midnight · Quiz reveal',
    template: 'midnight',
    state: makeState({
      fromName: 'Aditi',
      toName: 'Kabir',
      flow: 'birthday',
      subFlow: 'anonymous',
      template: 'midnight',
      tone: 'poetic',
      package: 'photos',
      isAnonymous: true,
      revealStyle: 'three_clues',
      revealDifficulty: 'easy',
    }),
  },
  {
    slug: 'ex-ocean-anniversary',
    label: '10th Anniversary',
    blurb: 'Calm · Ocean · A decade together',
    template: 'ocean',
    state: makeState({
      fromName: 'Ravi',
      toName: 'Meera',
      flow: 'anniversary',
      subFlow: 'y10',
      template: 'ocean',
      tone: 'poetic',
      package: 'photos_video',
    }),
  },
  {
    slug: 'ex-sakura-teddy',
    label: 'Teddy Day',
    blurb: 'Gentle · Sakura · Valentine’s week',
    template: 'sakura',
    state: makeState({
      fromName: 'Nikhil',
      toName: 'Ishaani',
      flow: 'valentines',
      subFlow: 'teddy',
      template: 'sakura',
      tone: 'funny',
      package: 'basic',
    }),
  },
  {
    slug: 'ex-cinematic-vday',
    label: "Valentine's Day",
    blurb: 'Dramatic · Cinematic · Letterbox',
    template: 'cinematic',
    state: makeState({
      fromName: 'Dev',
      toName: 'Ananya',
      flow: 'valentines',
      subFlow: 'vday',
      template: 'cinematic',
      tone: 'cinematic',
      package: 'photos_video',
    }),
  },
  {
    slug: 'ex-golden-anniversary-5',
    label: '5th Anniversary',
    blurb: 'Warm · Golden Hour · Sunset',
    template: 'golden_hour',
    state: makeState({
      fromName: 'Vikram',
      toName: 'Sanya',
      flow: 'anniversary',
      subFlow: 'y5',
      template: 'golden_hour',
      tone: 'romantic',
      package: 'photos',
    }),
  },
];

export function getExample(slug: string): Example | undefined {
  return EXAMPLES.find((e) => e.slug === slug);
}
