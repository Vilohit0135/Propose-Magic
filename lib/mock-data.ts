import type { ToneId } from './types';

type MessageBlock = Partial<Record<ToneId, string>>;

const MOCK_MESSAGES: Record<string, MessageBlock> = {
  marriage: {
    romantic:
      "From the first moment, I knew my heart had found its home in you. Every sunrise since has been brighter because I get to wake up knowing you exist. I want to build every tomorrow with you — forever, and then some more.",
    poetic:
      "You are the quiet hymn my soul has been humming its whole life without knowing the words. In the garden of my days, you bloomed when I was not looking, and now I cannot imagine a season without your colour. Stay — as the morning stays for the sky.",
    simple:
      "I love you more than I know how to say. I want to spend the rest of my life with you. Will you marry me?",
  },
  love: {
    romantic:
      "I've been carrying this feeling quietly for longer than you know, afraid to crack it open because some things feel too precious to say out loud. But every moment near you keeps reminding me that the truest things deserve to be said. You are my favourite person in every room.",
    poetic:
      "There is a soft kind of gravity that pulls me toward you — nothing I invented, nothing I can undo. You arrive in my thoughts the way evening arrives: gently, and then everywhere. Be with me. Be mine.",
    simple:
      "I think about you all the time. I've liked you for so long and I finally want you to know. Will you be mine?",
  },
  love_anon: {
    romantic:
      "I've thought about you in a way that's grown too large to keep quiet. Every small thing about how you move through the world has stayed with me, folded into my days like a secret worth keeping. I don't know how to say this except plainly — I feel something real.",
  },
  birthday_named: {
    romantic:
      "Another year of you lighting up every room you walk into — and another year of me feeling lucky to witness it. You make ordinary days feel like they matter, and I hope today feels the same back at you. Happy birthday, my favourite person.",
    poetic:
      "The world turned one more time around the sun for you — and it's a better world because it did. May this year fold around you like warm light through a window in the afternoon. Happy birthday, beautiful soul.",
  },
  birthday_anon: {
    romantic:
      "Somewhere in the quiet corners of my life, you've been the reason I still believe soft things are possible. I hope today feels like the universe saying your name gently. Happy birthday — from someone who has thought about you more than they've ever said.",
  },
  valentines: {
    romantic:
      "This day always makes me think of all the little moments I never find the words for — how you laugh at your own jokes, how you cross streets too confidently, how I fell without noticing. You are my valentine, today and every other day I'm lucky enough to have.",
  },
  anniversary: {
    romantic:
      "A year of waking up next to the person I would choose in every version of this life. A year of small rituals and big patience and whole afternoons gone to nothing much. I would sign up for a thousand more, eyes closed, heart full.",
  },
};

export function getMessage(subFlow: string, tone: ToneId, anonymous: boolean): string {
  const key =
    anonymous && subFlow === 'love'
      ? 'love_anon'
      : anonymous && subFlow === 'anonymous'
        ? 'birthday_anon'
        : subFlow === 'named'
          ? 'birthday_named'
          : subFlow;
  const flowMsgs = MOCK_MESSAGES[key] || MOCK_MESSAGES.marriage;
  return flowMsgs[tone] || flowMsgs.romantic || Object.values(flowMsgs)[0]!;
}
