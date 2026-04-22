'use client';

import React from 'react';
import { motion } from 'motion/react';
import { PHOTO_LAYOUTS, TEMPLATES } from '@/lib/tokens';
import type { PhotoLayoutId } from '@/lib/types';
import {
  FilmstripLayout,
  GridLayout,
  PolaroidLayout,
  SlideshowLayout,
} from '../journey/scenes-1-4';

export function LayoutPreviewModal({
  layout,
  photos,
  onClose,
}: {
  layout: PhotoLayoutId;
  photos: string[];
  onClose: () => void;
}) {
  const L = PHOTO_LAYOUTS[layout];
  const palette = TEMPLATES.rose_dark.palette;
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
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
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.1 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 440,
          maxHeight: '90vh',
          borderRadius: 24,
          overflow: 'hidden',
          background: '#fff',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '20px 24px 14px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: '#c9748a',
                fontWeight: 600,
              }}
            >
              Layout preview
            </div>
            <div
              style={{
                fontFamily: '"Playfair Display", serif',
                fontStyle: 'italic',
                fontSize: 22,
                color: '#1a1a1a',
                marginTop: 2,
              }}
            >
              {L.name}
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{L.desc}</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              flexShrink: 0,
              width: 34,
              height: 34,
              borderRadius: 99,
              border: 'none',
              background: '#f2f0eb',
              color: '#555',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            background: `radial-gradient(ellipse at top, ${palette.bg2} 0%, ${palette.bg} 90%)`,
            padding: '28px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 360,
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {layout === 'polaroid' && <PolaroidLayout photos={photos} />}
            {layout === 'slideshow' && <SlideshowLayout photos={photos} />}
            {layout === 'filmstrip' && <FilmstripLayout photos={photos} />}
            {layout === 'grid' && <GridLayout photos={photos} />}
          </div>
        </div>

        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid #eee',
            background: '#fafaf7',
            fontSize: 11,
            color: '#888',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          This is how {L.name.toLowerCase()} renders on their page. Tap outside to close.
        </div>
      </motion.div>
    </motion.div>
  );
}
