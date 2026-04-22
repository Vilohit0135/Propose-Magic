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
  videoTreatment: VideoTreatmentId;
  scratchIndex: number | null;
  isAnonymous: boolean;
  revealStyle: RevealStyle;
  revealDifficulty: RevealDifficulty;
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
