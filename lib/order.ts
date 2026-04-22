import type {
  FlowId,
  Gender,
  PackageId,
  PhotoLayoutId,
  RevealDifficulty,
  RevealStyle,
  TemplateId,
  ToneId,
  VideoTreatmentId,
} from './types';

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'GENERATING'
  | 'COMPLETED'
  | 'FAILED';

export type RevealContent =
  | { style: 'three_clues'; clues: string[]; decoys: string[] }
  | { style: 'trivia'; questions: { q: string; choices: string[]; correct: number }[] }
  | { style: 'sensory' };

export type Order = {
  id: string;
  short_id: string;
  status: OrderStatus;

  from_name: string;
  from_gender: Gender;
  to_name: string;
  story: string | null;
  email: string;

  flow: FlowId;
  sub_flow: string;

  is_anonymous: boolean;
  reveal_style: RevealStyle | null;
  reveal_difficulty: RevealDifficulty | null;
  reveal_content: RevealContent | null;
  reveal_attempts: number;
  reveal_solved: boolean;
  reveal_solved_at: string | null;

  package_type: PackageId;
  tone: ToneId;
  generated_message: string | null;
  template: TemplateId;

  photo_urls: string[];
  photo_captions: string[];
  photo_layout: PhotoLayoutId | null;
  scratch_photo_index: number | null;
  video_url: string | null;
  video_clip_urls: string[];
  video_timestamps: Record<string, number> | null;
  video_treatment: VideoTreatmentId | null;

  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  amount_paid: number | null;

  s3_url: string | null;
  cloudfront_url: string | null;

  love_taps: number;
  reactions: string[];
  quiz_score: number | null;
  yes_time_seconds: number | null;

  yes_clicked: boolean;
  yes_clicked_at: string | null;

  referral_short_id: string | null;
  ref_source: string | null;

  created_at: string;
  completed_at: string | null;
};

export type OrderDraft = Pick<
  Order,
  | 'from_name'
  | 'from_gender'
  | 'to_name'
  | 'story'
  | 'email'
  | 'flow'
  | 'sub_flow'
  | 'is_anonymous'
  | 'reveal_style'
  | 'reveal_difficulty'
  | 'reveal_content'
  | 'package_type'
  | 'tone'
  | 'template'
  | 'photo_urls'
  | 'photo_captions'
  | 'photo_layout'
  | 'scratch_photo_index'
  | 'video_treatment'
>;

export function amountPaiseFor(pkg: PackageId): number {
  if (pkg === 'basic') return 4900;
  if (pkg === 'photos') return 9900;
  return 19900;
}
