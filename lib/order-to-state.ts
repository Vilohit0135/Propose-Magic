import type { Order } from './order';
import type { OrderState } from './types';

export function orderToState(o: Order): OrderState {
  return {
    fromName: o.from_name,
    fromGender: o.from_gender ?? 'they',
    toName: o.to_name,
    story: o.story ?? '',
    email: o.email,
    flow: o.flow,
    subFlow: o.sub_flow,
    tone: o.tone,
    template: o.template,
    package: o.package_type,
    photos: o.photo_urls ?? [],
    photoLayout: o.photo_layout ?? 'polaroid',
    // videos[] is the canonical multi-clip list stored in video_clip_urls.
    // Legacy single videoUrl is kept as videos[0] (or null) for any code
    // path that still reads it.
    videos: o.video_clip_urls?.length
      ? o.video_clip_urls
      : o.video_url
        ? [o.video_url]
        : [],
    videoUrl: o.video_clip_urls?.[0] ?? o.video_url,
    videoTreatment: o.video_treatment ?? 'letterbox',
    musicUrl: o.music_video_id
      ? `https://www.youtube.com/watch?v=${o.music_video_id}${
          o.music_start_seconds ? `&t=${o.music_start_seconds}` : ''
        }`
      : '',
    musicVideoId: o.music_video_id,
    musicStartSeconds: o.music_start_seconds,
    scratchIndex: o.scratch_photo_index,
    isAnonymous: o.is_anonymous,
    revealStyle: o.reveal_style ?? 'three_clues',
    revealDifficulty: o.reveal_difficulty ?? 'easy',
    revealContent: o.reveal_content,
    generatedMessage: o.generated_message,
  };
}
