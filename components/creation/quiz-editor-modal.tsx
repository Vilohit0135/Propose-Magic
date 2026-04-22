'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type { RevealContent, RevealQuestion, RevealStyle } from '@/lib/types';

const DEFAULT_CLUES = [
  'We met somewhere it was raining',
  'You once laughed so hard you cried',
  "I've held your hand more than once",
];

const DEFAULT_DECOYS = ['Rohan', 'Kabir', 'Aryan'];

const DEFAULT_TRIVIA: RevealQuestion[] = [
  {
    q: 'What did I wear the first time we met?',
    choices: ['Blue shirt', 'Black hoodie', 'White tee', 'A smile'],
    correct: 3,
  },
  {
    q: 'Our favourite song starts with…',
    choices: ['A piano', 'A guitar riff', 'Silence', 'Rain'],
    correct: 0,
  },
  {
    q: "What do I call you when nobody's listening?",
    choices: ['Cutie', 'Jaan', 'Love', 'Nonsense'],
    correct: 1,
  },
];

const DEFAULT_SENSORY: RevealQuestion[] = [
  {
    q: 'Pick a colour that reminds you of love',
    choices: ['Deep red', 'Warm amber', 'Soft lavender', 'Cream'],
    correct: 0,
  },
  {
    q: 'Pick a song that fits this moment',
    choices: ['🎹 slow piano', '🎸 soft strum', '🌧️ rain sounds', '🎻 strings'],
    correct: 0,
  },
  {
    q: 'First memory that comes to mind?',
    choices: [
      'a late-night drive',
      'the first hug',
      'laughing too hard',
      'walking in the rain',
    ],
    correct: 0,
  },
];

export function defaultContentFor(
  style: RevealStyle,
  fromName: string,
): RevealContent {
  if (style === 'three_clues') {
    return {
      style: 'three_clues',
      clues: [...DEFAULT_CLUES],
      decoys: DEFAULT_DECOYS.filter((d) => d !== fromName).slice(0, 3),
    };
  }
  if (style === 'trivia') {
    return { style: 'trivia', questions: DEFAULT_TRIVIA.map((q) => ({ ...q, choices: [...q.choices] })) };
  }
  return { style: 'sensory', questions: DEFAULT_SENSORY.map((q) => ({ ...q, choices: [...q.choices] })) };
}

export function QuizEditorModal({
  style,
  current,
  fromName,
  story,
  onSave,
  onClose,
}: {
  style: RevealStyle;
  current: RevealContent | null;
  fromName: string;
  story: string;
  onSave: (next: RevealContent | null) => void;
  onClose: () => void;
}) {
  const [content, setContent] = useState<RevealContent>(() => {
    if (current && current.style === style) return current;
    return defaultContentFor(style, fromName);
  });
  const [genStatus, setGenStatus] = useState<
    { type: 'idle' } | { type: 'loading' } | { type: 'error'; reason: string }
  >({ type: 'idle' });

  const storyHasContent = (story || '').trim().length > 30;

  const generateFromStory = async () => {
    if (!storyHasContent) return;
    setGenStatus({ type: 'loading' });
    try {
      const resp = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story, style, from_name: fromName }),
      });
      const data = (await resp.json()) as
        | { status: 'ok'; content: RevealContent }
        | { status: 'insufficient'; reason: string }
        | { error: string };

      if ('error' in data) {
        const reason =
          data.error === 'anthropic_not_configured'
            ? 'The AI is not connected yet — ANTHROPIC_API_KEY is missing on the server.'
            : data.error === 'anthropic_auth'
              ? "Your Anthropic API key was rejected. Check .env — the key may be corrupted or revoked. Grab a fresh one from console.anthropic.com, paste it into .env, and restart the dev server."
              : data.error === 'anthropic_rate_limit'
                ? 'You hit Anthropic’s rate limit. Wait a minute and try again.'
                : 'Generation failed. Try again or fill it in below.';
        setGenStatus({ type: 'error', reason });
        return;
      }
      if (data.status === 'insufficient') {
        setGenStatus({ type: 'error', reason: data.reason });
        return;
      }
      if (data.content.style !== style) {
        setGenStatus({
          type: 'error',
          reason: 'Got an unexpected shape back. Try again.',
        });
        return;
      }
      setContent(data.content);
      setGenStatus({ type: 'idle' });
    } catch {
      setGenStatus({
        type: 'error',
        reason: 'Could not reach the AI. Fill it in below instead.',
      });
    }
  };

  const save = () => {
    onSave(content);
    onClose();
  };

  const resetDefaults = () => {
    setContent(defaultContentFor(style, fromName));
    setGenStatus({ type: 'idle' });
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 210,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.08 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 520,
          maxHeight: '92vh',
          overflow: 'auto',
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          padding: '22px 22px 18px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: '#8b5cf6',
                fontWeight: 700,
              }}
            >
              Customize quiz
            </div>
            <div
              style={{
                fontFamily: '"Playfair Display", serif',
                fontStyle: 'italic',
                fontSize: 22,
                marginTop: 2,
              }}
            >
              {style === 'three_clues'
                ? 'Your three clues'
                : style === 'trivia'
                  ? 'Your trivia questions'
                  : 'Your sensory prompts'}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              flexShrink: 0,
              width: 30,
              height: 30,
              borderRadius: 99,
              border: 'none',
              background: '#f2f0eb',
              color: '#555',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <GenerateFromStoryCard
          storyHasContent={storyHasContent}
          status={genStatus}
          onGenerate={generateFromStory}
        />

        <div
          style={{
            marginTop: 14,
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{ flex: 1, height: 1, background: '#eee' }} />
          <div
            style={{
              fontSize: 10,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: '#aaa',
              fontWeight: 600,
            }}
          >
            or edit directly
          </div>
          <div style={{ flex: 1, height: 1, background: '#eee' }} />
        </div>

        {content.style === 'three_clues' && (
          <ThreeCluesEditor
            content={content}
            onChange={setContent}
            fromName={fromName}
          />
        )}
        {content.style === 'trivia' && (
          <QuestionsEditor
            kind="trivia"
            content={content}
            onChange={setContent}
          />
        )}
        {content.style === 'sensory' && (
          <QuestionsEditor
            kind="sensory"
            content={content}
            onChange={setContent}
          />
        )}

        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 18,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            onClick={resetDefaults}
            style={{
              padding: '10px 14px',
              borderRadius: 99,
              border: '1px solid #e0e0e0',
              background: '#fff',
              color: '#666',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Reset to defaults
          </button>
          <button
            onClick={save}
            style={{
              padding: '12px 20px',
              borderRadius: 99,
              border: 'none',
              background: '#8b5cf6',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Save →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GenerateFromStoryCard({
  storyHasContent,
  status,
  onGenerate,
}: {
  storyHasContent: boolean;
  status:
    | { type: 'idle' }
    | { type: 'loading' }
    | { type: 'error'; reason: string };
  onGenerate: () => void;
}) {
  if (!storyHasContent) {
    return (
      <div
        style={{
          padding: 14,
          borderRadius: 12,
          background: '#fafafa',
          border: '1px dashed #e0e0e0',
          fontSize: 12,
          color: '#888',
          lineHeight: 1.55,
        }}
      >
        <strong style={{ color: '#555' }}>Generate from your story:</strong> write a
        story in Step 1 and this panel will let the AI build your quiz from it
        automatically.
      </div>
    );
  }
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 12,
        background: 'linear-gradient(135deg, #faf4ff, #f0e9ff)',
        border: '1px solid #d9c9ff',
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
        Generate from your story ✨
      </div>
      <div style={{ fontSize: 12, color: '#6b5b8a', marginTop: 3, lineHeight: 1.5 }}>
        The AI reads the story you wrote and builds a quiz around real details.
        If there isn&apos;t enough to go on, it&apos;ll tell you what to add.
      </div>
      <button
        onClick={onGenerate}
        disabled={status.type === 'loading'}
        style={{
          marginTop: 10,
          padding: '10px 16px',
          borderRadius: 99,
          border: 'none',
          background: '#8b5cf6',
          color: '#fff',
          fontSize: 12,
          fontWeight: 600,
          cursor: status.type === 'loading' ? 'wait' : 'pointer',
          fontFamily: 'inherit',
          opacity: status.type === 'loading' ? 0.7 : 1,
        }}
      >
        {status.type === 'loading' ? 'Generating…' : 'Generate questions →'}
      </button>
      {status.type === 'error' && (
        <div
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 8,
            background: '#fff3f3',
            border: '1px solid #ffd0d0',
            fontSize: 12,
            color: '#a33',
            lineHeight: 1.5,
          }}
        >
          {status.reason}
        </div>
      )}
    </div>
  );
}

function ThreeCluesEditor({
  content,
  onChange,
  fromName,
}: {
  content: Extract<RevealContent, { style: 'three_clues' }>;
  onChange: (next: RevealContent) => void;
  fromName: string;
}) {
  const updateClue = (i: number, v: string) => {
    const clues = [...content.clues];
    clues[i] = v;
    onChange({ ...content, clues });
  };
  const updateDecoy = (i: number, v: string) => {
    const decoys = [...content.decoys];
    decoys[i] = v;
    onChange({ ...content, decoys });
  };

  return (
    <div>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 14, lineHeight: 1.5 }}>
        Three hints only she would recognize, plus three decoy names she&apos;ll
        see alongside yours when she guesses.
      </div>

      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.6,
          color: '#6b5b8a',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        Clues
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#888',
                letterSpacing: 0.4,
              }}
            >
              Clue {i + 1}
            </label>
            <input
              value={content.clues[i] || ''}
              onChange={(e) => updateClue(i, e.target.value)}
              placeholder={DEFAULT_CLUES[i]}
              maxLength={200}
              style={editorInputStyle}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.6,
          color: '#6b5b8a',
          textTransform: 'uppercase',
          marginTop: 18,
          marginBottom: 8,
        }}
      >
        Decoy names (3 wrong answers alongside {fromName || 'you'})
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <input
            key={i}
            value={content.decoys[i] || ''}
            onChange={(e) => updateDecoy(i, e.target.value)}
            placeholder={DEFAULT_DECOYS[i]}
            maxLength={40}
            style={editorInputStyle}
          />
        ))}
      </div>
    </div>
  );
}

function QuestionsEditor({
  kind,
  content,
  onChange,
}: {
  kind: 'trivia' | 'sensory';
  content: Extract<RevealContent, { style: 'trivia' | 'sensory' }>;
  onChange: (next: RevealContent) => void;
}) {
  const defaultPool = kind === 'trivia' ? DEFAULT_TRIVIA : DEFAULT_SENSORY;

  const updateQ = (i: number, patch: Partial<RevealQuestion>) => {
    const questions = content.questions.map((q, j) =>
      j === i ? { ...q, ...patch } : q,
    );
    onChange({ ...content, questions } as RevealContent);
  };

  const updateChoice = (qi: number, ci: number, v: string) => {
    const q = content.questions[qi];
    const choices = [...q.choices];
    choices[ci] = v;
    updateQ(qi, { choices });
  };

  const description =
    kind === 'trivia'
      ? '3 questions only she would know. Mark the right answer — she taps to guess.'
      : '3 softer, evocative prompts about your relationship. Mark the one that fits best — the others are plausible but slightly off.';

  return (
    <div>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 14, lineHeight: 1.5 }}>
        {description}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {content.questions.map((q, qi) => {
          const placeholder = defaultPool[qi] ?? defaultPool[0];
          return (
            <div
              key={qi}
              style={{
                padding: 14,
                background: '#faf7ff',
                border: '1px solid #e4dbf5',
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: '#6b5b8a',
                  marginBottom: 6,
                }}
              >
                Question {qi + 1}
              </div>
              <input
                value={q.q}
                onChange={(e) => updateQ(qi, { q: e.target.value })}
                placeholder={placeholder.q}
                maxLength={200}
                style={{ ...editorInputStyle, background: '#fff' }}
              />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 6,
                  marginTop: 10,
                }}
              >
                {[0, 1, 2, 3].map((ci) => {
                  const isCorrect = q.correct === ci;
                  return (
                    <div
                      key={ci}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => updateQ(qi, { correct: ci })}
                        aria-label={`Mark option ${ci + 1} as correct`}
                        style={{
                          flexShrink: 0,
                          width: 22,
                          height: 22,
                          borderRadius: 99,
                          border: `1.5px solid ${isCorrect ? '#8b5cf6' : '#d6cfea'}`,
                          background: isCorrect ? '#8b5cf6' : '#fff',
                          color: '#fff',
                          fontSize: 11,
                          cursor: 'pointer',
                          marginRight: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isCorrect ? '✓' : ''}
                      </button>
                      <input
                        value={q.choices[ci] || ''}
                        onChange={(e) => updateChoice(qi, ci, e.target.value)}
                        placeholder={
                          placeholder.choices[ci] ?? `Option ${ci + 1}`
                        }
                        maxLength={120}
                        style={{
                          ...editorInputStyle,
                          flex: 1,
                          margin: 0,
                          background: '#fff',
                          borderColor: isCorrect ? '#c4b5fd' : '#e4dbf5',
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: '#aaa',
                  marginTop: 6,
                  letterSpacing: 0.3,
                }}
              >
                Tap the circle on the left to mark the correct answer.
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const editorInputStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 6,
  padding: 10,
  borderRadius: 8,
  border: '1px solid #e4dbf5',
  fontSize: 13,
  fontFamily: 'inherit',
  background: '#fff',
  boxSizing: 'border-box',
};
