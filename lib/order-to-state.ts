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
    videoTreatment: o.video_treatment ?? 'letterbox',
    scratchIndex: o.scratch_photo_index,
    isAnonymous: o.is_anonymous,
    revealStyle: o.reveal_style ?? 'three_clues',
    revealDifficulty: o.reveal_difficulty ?? 'easy',
    revealContent: o.reveal_content,
    generatedMessage: o.generated_message,
  };
}
