'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type { RevealContent, RevealStyle } from '@/lib/types';

const DEFAULT_CLUES = [
  'We met somewhere it was raining',
  'You once laughed so hard you cried',
  "I've held your hand more than once",
];

const DEFAULT_DECOYS = ['Rohan', 'Kabir', 'Aryan'];

export function defaultContentFor(
  style: RevealStyle,
  fromName: string,
): RevealContent | null {
  if (style === 'three_clues') {
    return {
      style: 'three_clues',
      clues: [...DEFAULT_CLUES],
      decoys: DEFAULT_DECOYS.filter((d) => d !== fromName).slice(0, 3),
    };
  }
  return null;
}

export function QuizEditorModal({
  style,
  current,
  fromName,
  onSave,
  onClose,
}: {
  style: RevealStyle;
  current: RevealContent | null;
  fromName: string;
  onSave: (next: RevealContent | null) => void;
  onClose: () => void;
}) {
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
          maxWidth: 440,
          maxHeight: '90vh',
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
                  : 'Sensory unlock'}
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

        {style === 'three_clues' && (
          <ThreeCluesEditor
            current={current}
            fromName={fromName}
            onSave={onSave}
            onClose={onClose}
          />
        )}
        {style === 'trivia' && <NotYetEditable onClose={onClose} styleName="trivia" />}
        {style === 'sensory' && (
          <NotYetEditable onClose={onClose} styleName="sensory" />
        )}
      </motion.div>
    </motion.div>
  );
}

function ThreeCluesEditor({
  current,
  fromName,
  onSave,
  onClose,
}: {
  current: RevealContent | null;
  fromName: string;
  onSave: (next: RevealContent | null) => void;
  onClose: () => void;
}) {
  const initial = useMemo(() => {
    if (current && current.style === 'three_clues') return current.clues;
    return [...DEFAULT_CLUES];
  }, [current]);

  const [clues, setClues] = useState<string[]>(initial);

  const save = () => {
    const trimmed = clues.map((c) => c.trim()).filter((c) => c.length > 0);
    if (trimmed.length === 0) {
      onSave(null);
    } else {
      const padded = [...trimmed];
      while (padded.length < 3) padded.push(DEFAULT_CLUES[padded.length]);
      onSave({
        style: 'three_clues',
        clues: padded.slice(0, 3),
        decoys: DEFAULT_DECOYS.filter((d) => d !== fromName).slice(0, 3),
      });
    }
    onClose();
  };

  const resetDefaults = () => {
    setClues([...DEFAULT_CLUES]);
  };

  return (
    <div>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 14, lineHeight: 1.5 }}>
        Write three hints only she would recognize. She&apos;ll see them one by one,
        then pick your name from four options. Leave blank to use the default.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {clues.map((clue, i) => (
          <div key={i}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#6b5b8a',
                letterSpacing: 0.6,
                textTransform: 'uppercase',
              }}
            >
              Clue {i + 1}
            </label>
            <input
              value={clue}
              onChange={(e) =>
                setClues((prev) => prev.map((c, j) => (j === i ? e.target.value : c)))
              }
              placeholder={DEFAULT_CLUES[i]}
              maxLength={120}
              style={{
                width: '100%',
                marginTop: 6,
                padding: 12,
                borderRadius: 10,
                border: '1px solid #e4dbf5',
                fontSize: 14,
                fontFamily: 'inherit',
                background: '#faf7ff',
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: '#aaa', marginTop: 14 }}>
        Decoy names (the three wrong options she&apos;ll see alongside yours) stay as
        the defaults for now — Rohan · Kabir · Aryan.
      </div>

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
          Save clues →
        </button>
      </div>
    </div>
  );
}

function NotYetEditable({
  onClose,
  styleName,
}: {
  onClose: () => void;
  styleName: string;
}) {
  return (
    <div>
      <div
        style={{
          padding: 16,
          borderRadius: 12,
          background: '#faf7ff',
          border: '1px dashed #d9c9ff',
          fontSize: 13,
          color: '#555',
          lineHeight: 1.6,
        }}
      >
        Custom {styleName} questions are coming soon. For now the quiz uses the default
        {styleName === 'sensory'
          ? ' sensory prompts — any answer she picks is accepted, so it still feels personal.'
          : ' trivia pack. Pick three-clues if you want to write her experience yourself.'}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
        <button
          onClick={onClose}
          style={{
            padding: '10px 18px',
            borderRadius: 99,
            border: 'none',
            background: '#1a1a1a',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Okay
        </button>
      </div>
    </div>
  );
}
