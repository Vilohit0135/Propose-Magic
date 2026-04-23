export type FlowId = 'propose' | 'birthday' | 'valentines' | 'anniversary';
export type PackageId = 'basic' | 'photos' | 'photos_video';
export type TemplateId =
  | 'rose_dark'
  | 'sakura'
  | 'ocean'
  | 'midnight'
  | 'cinematic'
  | 'golden_hour';
export type ToneId = 'romantic' | 'poetic' | 'funny' | 'cinematic' | 'simple';
export type PhotoLayoutId = 'slideshow' | 'polaroid' | 'filmstrip' | 'grid';
export type VideoTreatmentId = 'letterbox' | 'dreamy' | 'vintage' | 'fullbleed';
export type RevealStyle = 'three_clues' | 'trivia' | 'sensory';
export type RevealDifficulty = 'easy' | 'medium' | 'hard';
export type Gender = 'he' | 'she' | 'they';

export type RevealQuestion = {
  q: string;
  choices: string[];
  correct: number;
};

export type RevealContent =
  | { style: 'three_clues'; clues: string[]; decoys: string[] }
  | { style: 'trivia'; questions: RevealQuestion[] }
  | { style: 'sensory'; questions: RevealQuestion[] };

export type OrderState = {
  fromName: string;
  fromGender: Gender;
  toName: string;
  story: string;
  email: string;
  flow: FlowId;
  subFlow: string;
  tone: ToneId;
  template: TemplateId;
  package: PackageId;
  photos: string[];
  photoLayout: PhotoLayoutId;
  // Up to 5 short clips (each ≤ 50MB). First one is used by legacy single-
  // video code paths that still read videoUrl. New reel popup plays them in
  // sequence with Instagram-style chrome.
  videos: string[];
  videoUrl: string | null;
  videoTreatment: VideoTreatmentId;
  // Background song. `musicUrl` is what the sender typed (stored only during
  // creation for UX persistence across step navigation). `musicVideoId` is
  // what actually gets sent to the server and played on the receiver.
  musicUrl: string;
  musicVideoId: string | null;
  // Seconds into the song to start the first play. Subsequent loops always
  // restart from 0 (YouTube default loop behavior).
  musicStartSeconds: number | null;
  scratchIndex: number | null;
  isAnonymous: boolean;
  revealStyle: RevealStyle;
  revealDifficulty: RevealDifficulty;
  revealContent: RevealContent | null;
  generatedMessage?: string | null;
};

export type SubFlow = {
  name: string;
  question: string;
  particle: string;
  defaultTemplate: TemplateId;
  anonymous: boolean;
  moment?: string;
};

export type TemplateDef = {
  name: string;
  vibe: string;
  palette: {
    bg: string;
    bg2: string;
    accent: string;
    accent2: string;
    text: string;
    muted: string;
  };
  fonts: { display: string; body: string };
  particle: string;
};
