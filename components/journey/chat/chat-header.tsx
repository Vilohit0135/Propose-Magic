'use client';

import React from 'react';
import type { TemplateDef } from '@/lib/types';
import type { ChatSection } from './script';
import { withAlpha } from './bubbles';

const SECTION_LABELS: Record<ChatSection, string> = {
  hello: 'Hello',
  memories: 'Memories',
  letter: 'Letter',
  tension: 'Almost there',
  question: 'Question',
};

export function ChatHeader({
  displayName,
  revealed,
  sections,
  currentSection,
  t,
  onBack,
}: {
  displayName: string;
  revealed: boolean;
  sections: ChatSection[];
  currentSection: ChatSection;
  t: TemplateDef;
  onBack: () => void;
}) {
  const activeIdx = sections.indexOf(currentSection);
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: `linear-gradient(180deg, ${t.palette.bg} 0%, ${withAlpha(t.palette.bg, 0.85)} 85%, transparent 100%)`,
        backdropFilter: 'blur(14px)',
        padding: '10px 14px 8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            width: 32,
            height: 32,
            borderRadius: 99,
            background: withAlpha(t.palette.text, 0.08),
            border: 'none',
            color: t.palette.text,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          ←
        </button>
        <Avatar revealed={revealed} t={t} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: t.fonts.body,
              fontSize: 14.5,
              fontWeight: 600,
              color: t.palette.text,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              animation: revealed ? 'nameGlow 0.9s both' : undefined,
            }}
          >
            {displayName}
          </div>
          <div
            style={{
              fontSize: 11,
              color: t.palette.accent,
              marginTop: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 99,
                background: t.palette.accent,
                boxShadow: `0 0 6px ${t.palette.accent}`,
              }}
            />
            online
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginTop: 10,
        }}
      >
        {sections.map((s, i) => (
          <div
            key={s}
            aria-label={SECTION_LABELS[s]}
            style={{
              width: i === activeIdx ? 22 : 6,
              height: 6,
              borderRadius: 99,
              background:
                i <= activeIdx ? t.palette.accent : withAlpha(t.palette.text, 0.18),
              transition: 'width 0.4s, background 0.4s',
              boxShadow:
                i === activeIdx ? `0 0 8px ${withAlpha(t.palette.accent, 0.7)}` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Avatar({ revealed, t }: { revealed: boolean; t: TemplateDef }) {
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 99,
        background: `linear-gradient(135deg, ${t.palette.accent}, ${t.palette.accent2})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: t.palette.bg,
        fontFamily: t.fonts.display,
        fontStyle: 'italic',
        fontSize: 18,
        filter: revealed ? 'blur(0)' : 'blur(8px)',
        transition: 'filter 0.7s',
        border: `1px solid ${t.palette.accent}`,
      }}
    >
      {revealed ? '♥' : '?'}
    </div>
  );
}
