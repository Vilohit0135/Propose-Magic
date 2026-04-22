import type {
  FlowId,
  PackageId,
  PhotoLayoutId,
  SubFlow,
  TemplateDef,
  TemplateId,
  ToneId,
  VideoTreatmentId,
} from './types';

export const TEMPLATES: Record<TemplateId, TemplateDef> = {
  rose_dark: {
    name: 'Rose Dark',
    vibe: 'Deeply romantic',
    palette: { bg: '#1a0a12', bg2: '#2a0e1c', accent: '#d4a574', accent2: '#8b1538', text: '#fbeae1', muted: '#c9a2a0' },
    fonts: { display: '"Playfair Display", serif', body: '"DM Sans", sans-serif' },
    particle: '🌹',
  },
  sakura: {
    name: 'Sakura',
    vibe: 'Gentle, pastel, Japanese',
    palette: { bg: '#fdf2f4', bg2: '#f9d9e0', accent: '#c9748a', accent2: '#d4a574', text: '#5a2a38', muted: '#a06275' },
    fonts: { display: '"Cormorant Garamond", serif', body: '"Inter", sans-serif' },
    particle: '🌸',
  },
  ocean: {
    name: 'Ocean',
    vibe: 'Calm, expansive',
    palette: { bg: '#0a1f2e', bg2: '#123a52', accent: '#6ec7d2', accent2: '#a0d8e8', text: '#e4f1f6', muted: '#8fb4c4' },
    fonts: { display: '"Lora", serif', body: '"DM Sans", sans-serif' },
    particle: '💙',
  },
  midnight: {
    name: 'Midnight',
    vibe: 'Cosmic, mysterious',
    palette: { bg: '#0a0620', bg2: '#1a103a', accent: '#c0a7ff', accent2: '#e8dfff', text: '#ece6ff', muted: '#8a7fb8' },
    fonts: { display: '"Cinzel", serif', body: '"Inter", sans-serif' },
    particle: '✨',
  },
  cinematic: {
    name: 'Cinematic',
    vibe: 'Film-noir, dramatic',
    palette: { bg: '#0a0a0a', bg2: '#1a1a1a', accent: '#e8e8e8', accent2: '#b8b8b8', text: '#fafafa', muted: '#8a8a8a' },
    fonts: { display: '"Bodoni Moda", serif', body: '"Work Sans", sans-serif' },
    particle: '🎬',
  },
  golden_hour: {
    name: 'Golden Hour',
    vibe: 'Sunset, emotional, warm',
    palette: { bg: '#2a140a', bg2: '#4a2a14', accent: '#f4a261', accent2: '#fcd9a8', text: '#fff3e6', muted: '#d4a07a' },
    fonts: { display: '"Playfair Display", serif', body: '"Inter", sans-serif' },
    particle: '🌅',
  },
};

export const FLOWS: Record<
  FlowId,
  { name: string; icon: string; subFlows: Record<string, SubFlow> }
> = {
  propose: {
    name: 'Propose',
    icon: '💍',
    subFlows: {
      marriage: { name: 'Marriage Proposal', question: 'Will you marry me?', particle: '💍', defaultTemplate: 'rose_dark', anonymous: false },
      love: { name: 'Love Proposal', question: 'Will you be mine?', particle: '💕', defaultTemplate: 'rose_dark', anonymous: true },
    },
  },
  birthday: {
    name: 'Birthday',
    icon: '🎂',
    subFlows: {
      named: { name: 'Named Birthday', question: 'Happy Birthday!', moment: 'Make a Wish 🎂', particle: '🎂', defaultTemplate: 'golden_hour', anonymous: false },
      anonymous: { name: 'Anonymous Birthday', question: 'Happy Birthday!', moment: 'Make a Wish 🎂', particle: '🎂', defaultTemplate: 'midnight', anonymous: true },
    },
  },
  valentines: {
    name: "Valentine's",
    icon: '🌹',
    subFlows: {
      rose: { name: 'Rose Day (Feb 7)', question: 'A rose for you 🌹', particle: '🌹', defaultTemplate: 'rose_dark', anonymous: false },
      propose_day: { name: 'Propose Day (Feb 8)', question: 'Will you be mine?', particle: '💕', defaultTemplate: 'rose_dark', anonymous: false },
      chocolate: { name: 'Chocolate Day (Feb 9)', question: 'Sweet as you are 🍫', particle: '🍫', defaultTemplate: 'golden_hour', anonymous: false },
      teddy: { name: 'Teddy Day (Feb 10)', question: 'A hug from me 🧸', particle: '🧸', defaultTemplate: 'sakura', anonymous: false },
      promise: { name: 'Promise Day (Feb 11)', question: 'I promise you 🤞', particle: '🤞', defaultTemplate: 'ocean', anonymous: false },
      hug: { name: 'Hug Day (Feb 12)', question: 'Hold me close 🤗', particle: '🤗', defaultTemplate: 'sakura', anonymous: false },
      kiss: { name: 'Kiss Day (Feb 13)', question: 'One kiss 💋', particle: '💋', defaultTemplate: 'rose_dark', anonymous: false },
      vday: { name: "Valentine's Day (Feb 14)", question: 'Be my Valentine?', particle: '🌹', defaultTemplate: 'rose_dark', anonymous: false },
    },
  },
  anniversary: {
    name: 'Anniversary',
    icon: '✨',
    subFlows: {
      y1: { name: '1st Anniversary', question: 'One year with you ♥', particle: '🎂', defaultTemplate: 'golden_hour', anonymous: false },
      y3: { name: '3rd Anniversary', question: 'Three beautiful years', particle: '✨', defaultTemplate: 'golden_hour', anonymous: false },
      y5: { name: '5th Anniversary', question: 'Five years of us', particle: '🥂', defaultTemplate: 'ocean', anonymous: false },
      y10: { name: '10th Anniversary', question: 'A decade of love', particle: '💫', defaultTemplate: 'midnight', anonymous: false },
      y25: { name: '25th Silver', question: '25 years together', particle: '🥈', defaultTemplate: 'ocean', anonymous: false },
      y50: { name: '50th Golden', question: 'Golden years with you', particle: '🥇', defaultTemplate: 'golden_hour', anonymous: false },
    },
  },
};

export const PACKAGES: Record<
  PackageId,
  { name: string; price: number; tagline: string; features: string[] }
> = {
  basic: { name: 'Basic', price: 49, tagline: 'Text journey', features: ['Full 7-scene journey', '6 templates', 'Gamification layer', 'AI-written message'] },
  photos: { name: 'Photos', price: 99, tagline: 'Photos + Journey', features: ['Up to 10 photos', '4 photo layouts', 'Scratch-to-reveal', 'Everything in Basic'] },
  photos_video: { name: 'Photos + Video', price: 199, tagline: 'Full cinematic', features: ['Video moments', '4 video treatments', 'Up to 5 clips / 5 min', 'Everything in Photos'] },
};

export const TONES: Record<ToneId, string> = {
  romantic: 'Deeply romantic, emotional',
  poetic: 'Poetic, dreamy, metaphorical',
  funny: 'Cute, warm, playful',
  cinematic: 'Cinematic, dramatic, intense',
  simple: 'Simple, sincere, heartfelt',
};

export const PHOTO_LAYOUTS: Record<PhotoLayoutId, { name: string; desc: string }> = {
  slideshow: { name: 'Slideshow', desc: 'One photo at a time, gentle crossfade' },
  polaroid: { name: 'Polaroid Stack', desc: 'Stacked at angles, tap to spread' },
  filmstrip: { name: 'Filmstrip', desc: 'Horizontal swipe, warm filter' },
  grid: { name: 'Fade Grid', desc: '2-column grid, tap to expand' },
};

export const VIDEO_TREATMENTS: Record<VideoTreatmentId, { name: string; desc: string }> = {
  letterbox: { name: 'Cinematic Letterbox', desc: '2.35:1 bars, film grain' },
  dreamy: { name: 'Dreamy Blur', desc: 'Soft edges, warm-shifted' },
  vintage: { name: 'Vintage Film', desc: 'Heavy grain, teal-orange' },
  fullbleed: { name: 'Full Bleed', desc: 'No treatment, edge-to-edge' },
};

export const DEMO_PHOTOS: string[] = [
  'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&auto=format&q=75',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&q=75',
  'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=600&auto=format&q=75',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&auto=format&q=75',
  'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600&auto=format&q=75',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&auto=format&q=75',
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&auto=format&q=75',
  'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=600&auto=format&q=75',
];
