'use client';

import React, { useState } from 'react';
import {
  DEMO_PHOTOS,
  FLOWS,
  PACKAGES,
  PHOTO_LAYOUTS,
  TEMPLATES,
  VIDEO_TREATMENTS,
} from '@/lib/tokens';
import type { OrderState, PackageId, PhotoLayoutId, VideoTreatmentId } from '@/lib/types';
import { cardBtn, Field, SectionLabel } from './creation-flow';
import { TemplateThumbnail } from './step2';
import { LayoutPreviewModal } from './layout-preview-modal';
import { MusicUrlInput } from './music-url-input';

type SetState = React.Dispatch<React.SetStateAction<OrderState>>;

export function Step3({ state, setState }: { state: OrderState; setState: SetState }) {
  if (state.package === 'basic') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 28,
              fontWeight: 500,
              lineHeight: 1.15,
            }}
          >
            Choose your package
          </div>
          <div style={{ fontSize: 14, color: '#888', marginTop: 6 }}>
            Every package gets the full 7-scene journey. Media makes it richer.
          </div>
        </div>
        <PackagePicker state={state} setState={setState} />
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <div
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.15,
          }}
        >
          Add your media
        </div>
        <div style={{ fontSize: 14, color: '#888', marginTop: 6 }}>
          Drag to reorder. Tap any photo for caption.
        </div>
      </div>
      <PackagePicker state={state} setState={setState} compact />
      <MusicUrlInput state={state} setState={setState} />
      <PhotoUploadGrid state={state} setState={setState} />
      {/* Layout */}
      <LayoutSection state={state} setState={setState} />
      {state.package === 'photos_video' && (
        <>
          <VideoUploadSection state={state} setState={setState} />
          <VideoTreatmentSection state={state} setState={setState} />
        </>
      )}
    </div>
  );
}

function PackagePicker({
  state,
  setState,
  compact,
}: {
  state: OrderState;
  setState: SetState;
  compact?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(Object.entries(PACKAGES) as [PackageId, (typeof PACKAGES)[PackageId]][]).map(
        ([id, pkg]) => (
          <button
            key={id}
            onClick={() => {
              // Keep any photos she already uploaded when she switches packages
              // (up/downgrade); only zero them out on basic.
              const photos = id === 'basic' ? [] : state.photos;
              setState((s) => ({
                ...s,
                package: id,
                photos,
                scratchIndex: photos.length > 0 ? 0 : null,
              }));
            }}
            style={{
              padding: compact ? 12 : 18,
              borderRadius: 14,
              border: '1px solid',
              borderColor: state.package === id ? '#c9748a' : '#e0e0e0',
              background: state.package === id ? '#fff5f7' : '#fff',
              color: '#1a1a1a',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontWeight: 600, fontSize: compact ? 14 : 16 }}>{pkg.name}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{pkg.tagline}</div>
              </div>
              {!compact && (
                <div style={{ marginTop: 6, fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                  {pkg.features.slice(0, 2).map((f) => (
                    <div key={f}>· {f}</div>
                  ))}
                </div>
              )}
            </div>
            <div
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: compact ? 20 : 26,
                fontWeight: 500,
              }}
            >
              ₹{pkg.price}
            </div>
          </button>
        )
      )}
    </div>
  );
}

export function Step4({ state, setState }: { state: OrderState; setState: SetState }) {
  const flow = FLOWS[state.flow];
  const sub = flow?.subFlows[state.subFlow];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.15,
          }}
        >
          Review &amp; generate
        </div>
        <div style={{ fontSize: 14, color: '#888', marginTop: 6 }}>
          One last look before we build their moment.
        </div>
      </div>
      <div
        style={{
          borderRadius: 14,
          border: '1px solid #eee',
          background: '#fff',
          overflow: 'hidden',
        }}
      >
        <TemplateThumbnail template={state.template} toName={state.toName} />
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ReviewRow
            label="From"
            value={state.isAnonymous ? `${state.fromName} (hidden)` : state.fromName}
          />
          <ReviewRow label="To" value={state.toName} />
          <ReviewRow label="Flow" value={sub?.name ?? ''} />
          <ReviewRow label="Tone" value={state.tone} />
          <ReviewRow label="Template" value={TEMPLATES[state.template]?.name ?? ''} />
          <ReviewRow
            label="Package"
            value={`${PACKAGES[state.package]?.name} · ₹${PACKAGES[state.package]?.price}`}
          />
          {state.isAnonymous && (
            <ReviewRow label="Reveal" value={`${state.revealStyle} · ${state.revealDifficulty}`} />
          )}
          {state.photos.length > 0 && (
            <ReviewRow label="Photos" value={`${state.photos.length} uploaded`} />
          )}
        </div>
      </div>
      <Field
        label="Delivery email"
        value={state.email}
        onChange={(v) => setState((s) => ({ ...s, email: v }))}
        placeholder="you@example.com"
      />
      <Field
        label="Your WhatsApp (optional)"
        value={state.fromPhone}
        onChange={(v) => setState((s) => ({ ...s, fromPhone: v }))}
        placeholder="+91 9876543210"
      />
      <div
        style={{
          fontSize: 11,
          color: '#888',
          lineHeight: 1.5,
          marginTop: -8,
          marginBottom: 8,
        }}
      >
        We&apos;ll WhatsApp you the moment {state.toName || 'they'} say&apos;s yes.
      </div>
      <div
        style={{
          background: '#f9f9f9',
          borderRadius: 12,
          padding: 14,
          fontSize: 12,
          color: '#666',
          lineHeight: 1.6,
        }}
      >
        <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>How it works</div>
        1. We generate your page in seconds · 2. You get a shareable link · 3. Send it to{' '}
        {state.toName || 'them'} on WhatsApp
      </div>
    </div>
  );
}

function PhotoUploadGrid({
  state,
  setState,
}: {
  state: OrderState;
  setState: SetState;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number }>({
    done: 0,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Lazily imports the compressor only when the first photo upload runs —
  // keeps it out of the main bundle for senders who never reach this step.
  const compressImage = async (file: File): Promise<File> => {
    // Files under 500KB are already small enough that re-encoding won't
    // save meaningful bandwidth and may actually *increase* size via
    // JPEG re-encoding overhead. Skip.
    if (file.size < 500 * 1024) return file;
    try {
      const { default: imageCompression } = await import('browser-image-compression');
      const compressed = await imageCompression(file, {
        // Target: ~1.2MB per photo. At 2400px longest edge + JPEG q=0.82
        // this keeps retina-quality for the chat bubbles while typically
        // trimming 4MB camera rolls down to 600-900KB.
        maxSizeMB: 1.2,
        maxWidthOrHeight: 2400,
        useWebWorker: true,
        fileType: 'image/jpeg',
        initialQuality: 0.82,
      });
      return compressed as File;
    } catch (err) {
      // HEIC from older Android browsers or any weird format → let the
      // raw file through so the upload still succeeds. Cloudinary's own
      // pipeline can usually convert it.
      console.warn('[photo compress] falling back to raw file:', err);
      return file;
    }
  };

  const uploadOne = async (file: File): Promise<string> => {
    const compressed = await compressImage(file);
    const signResp = await fetch('/api/cloudinary/sign', { method: 'POST' });
    if (!signResp.ok) {
      if (signResp.status === 503) {
        throw new Error(
          'Cloudinary is not configured yet. Ask the developer to set the keys.',
        );
      }
      throw new Error('sign_failed');
    }
    const sign = (await signResp.json()) as {
      cloudName: string;
      apiKey: string;
      timestamp: number;
      folder: string;
      signature: string;
    };

    const form = new FormData();
    form.append('file', compressed);
    form.append('api_key', sign.apiKey);
    form.append('timestamp', String(sign.timestamp));
    form.append('folder', sign.folder);
    form.append('signature', sign.signature);

    const uploadResp = await fetch(
      `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
      { method: 'POST', body: form },
    );
    if (!uploadResp.ok) throw new Error('upload_failed');
    const data = (await uploadResp.json()) as { secure_url?: string };
    if (!data.secure_url) throw new Error('no_url');
    return data.secure_url;
  };

  const handleFiles = async (files: FileList) => {
    setError(null);
    const remaining = Math.max(0, 10 - state.photos.length);
    if (remaining === 0) {
      setError('You already have 10 photos. Remove one to add another.');
      return;
    }

    const asArray = Array.from(files);
    const skippedTooLarge: string[] = [];
    const skippedWrongType: string[] = [];

    const valid: File[] = asArray.filter((f) => {
      if (!f.type.startsWith('image/')) {
        skippedWrongType.push(f.name);
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        skippedTooLarge.push(f.name);
        return false;
      }
      return true;
    });

    const clipped = valid.slice(0, remaining);
    const overflow = valid.length - clipped.length;

    if (clipped.length === 0) {
      if (skippedTooLarge.length)
        setError(`${skippedTooLarge.length} photo(s) were over 10MB.`);
      else if (skippedWrongType.length)
        setError(`${skippedWrongType.length} file(s) were not images.`);
      else setError('Nothing to upload.');
      return;
    }

    setUploading(true);
    setProgress({ done: 0, total: clipped.length });

    const uploadedUrls: string[] = [];
    let firstFailureMessage: string | null = null;

    for (const file of clipped) {
      try {
        const url = await uploadOne(file);
        uploadedUrls.push(url);
        // Commit each upload as it completes so partial failures keep whatever
        // did land — user doesn't lose earlier work if a later one fails.
        setState((s) => ({
          ...s,
          photos: [...s.photos, url],
          scratchIndex: s.scratchIndex ?? 0,
        }));
      } catch (err) {
        console.error('[photo upload]', err);
        if (!firstFailureMessage) {
          firstFailureMessage =
            err instanceof Error && err.message.includes('Cloudinary')
              ? err.message
              : 'One or more photos failed to upload.';
        }
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }

    setUploading(false);
    setProgress({ done: 0, total: 0 });

    const problems: string[] = [];
    if (firstFailureMessage) problems.push(firstFailureMessage);
    if (skippedTooLarge.length)
      problems.push(`${skippedTooLarge.length} skipped (over 10MB)`);
    if (skippedWrongType.length)
      problems.push(`${skippedWrongType.length} skipped (not an image)`);
    if (overflow > 0)
      problems.push(`${overflow} skipped (hit 10-photo limit)`);
    if (problems.length) setError(problems.join(' · '));
  };

  return (
    <div>
      <SectionLabel>Photos ({state.photos.length}/10)</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {state.photos.map((src, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: 10,
              overflow: 'hidden',
              border:
                state.scratchIndex === i ? '2px solid #c9748a' : '1px solid #eee',
              cursor: 'pointer',
            }}
            onClick={() => setState((s) => ({ ...s, scratchIndex: i }))}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              alt=""
            />
            {state.scratchIndex === i && (
              <div
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  background: '#c9748a',
                  color: '#fff',
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 99,
                  fontWeight: 600,
                }}
              >
                scratch
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setState((s) => ({
                  ...s,
                  photos: s.photos.filter((_, j) => j !== i),
                  scratchIndex:
                    s.scratchIndex === i
                      ? s.photos.length > 1
                        ? 0
                        : null
                      : s.scratchIndex,
                }));
              }}
              aria-label="Remove photo"
              style={{
                position: 'absolute',
                top: 4,
                left: 4,
                width: 20,
                height: 20,
                borderRadius: 99,
                border: 'none',
                background: 'rgba(0,0,0,0.55)',
                color: '#fff',
                fontSize: 12,
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        ))}
        {state.photos.length < 10 && (
          <>
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              style={{
                aspectRatio: '1',
                border: '2px dashed #c9748a',
                borderRadius: 10,
                background: uploading ? '#f9e5eb' : '#fff5f7',
                fontSize: 22,
                color: '#c9748a',
                cursor: uploading ? 'wait' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}>
                {uploading ? '…' : '+'}
              </span>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.5 }}>
                {uploading
                  ? `${progress.done}/${progress.total}`
                  : 'ADD PHOTOS'}
              </span>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  void handleFiles(e.target.files);
                }
                e.target.value = '';
              }}
            />
          </>
        )}
      </div>
      {error && (
        <div
          style={{
            marginTop: 8,
            padding: 10,
            borderRadius: 8,
            background: '#fff3f3',
            border: '1px solid #ffd0d0',
            color: '#a33',
            fontSize: 12,
          }}
        >
          {error}
        </div>
      )}
      <div style={{ fontSize: 11, color: '#888', marginTop: 6 }}>
        Tap + to pick one or many photos at once. Max 10 · 10MB each · tap a
        photo to mark as scratch-to-reveal.
      </div>
    </div>
  );
}

function LayoutSection({
  state,
  setState,
}: {
  state: OrderState;
  setState: SetState;
}) {
  const [previewLayout, setPreviewLayout] = useState<PhotoLayoutId | null>(null);
  const previewPhotos =
    state.photos.length > 0 ? state.photos : DEMO_PHOTOS.slice(0, 6);

  return (
    <div>
      <SectionLabel>Photo Layout</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {(
          Object.entries(PHOTO_LAYOUTS) as [
            PhotoLayoutId,
            (typeof PHOTO_LAYOUTS)[PhotoLayoutId],
          ][]
        ).map(([id, L]) => {
          const active = state.photoLayout === id;
          const thumbPhotos =
            state.photos.length > 0 ? state.photos : DEMO_PHOTOS.slice(0, 4);
          return (
            <div
              key={id}
              style={{
                position: 'relative',
                borderRadius: 14,
                border: '2px solid',
                borderColor: active ? '#1a1a1a' : '#e0e0e0',
                background: '#fff',
                overflow: 'hidden',
                transition: 'all 0.15s',
              }}
            >
              <button
                onClick={() => setState((s) => ({ ...s, photoLayout: id }))}
                style={{
                  width: '100%',
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  display: 'block',
                }}
              >
                <LayoutPreview layout={id} photos={thumbPhotos} />
                <div style={{ padding: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
                    {L.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#888',
                      lineHeight: 1.4,
                      marginTop: 2,
                    }}
                  >
                    {L.desc}
                  </div>
                </div>
              </button>
              <button
                onClick={() => setPreviewLayout(id)}
                aria-label={`Preview ${L.name} live`}
                title="See it live"
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 30,
                  height: 30,
                  borderRadius: 99,
                  border: '1px solid rgba(255,255,255,0.35)',
                  background: 'rgba(0,0,0,0.55)',
                  color: '#fff',
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                }}
              >
                ↗
              </button>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 11, color: '#aaa', marginTop: 8 }}>
        Tap the card to select · Tap the ↗ to preview it live.
      </div>
      {previewLayout && (
        <LayoutPreviewModal
          layout={previewLayout}
          photos={previewPhotos}
          onClose={() => setPreviewLayout(null)}
        />
      )}
    </div>
  );
}

function VideoUploadSection({
  state,
  setState,
}: {
  state: OrderState;
  setState: SetState;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
    pct: number;
    phase: 'compress' | 'upload';
  }>({
    current: 0,
    total: 0,
    pct: 0,
    phase: 'compress',
  });
  const [error, setError] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const MAX_CLIPS = 5;
  const MAX_MB_PER_CLIP = 50;
  const MAX_BYTES_PER_CLIP = MAX_MB_PER_CLIP * 1024 * 1024;

  const uploadOne = async (
    file: File,
    sign: {
      cloudName: string;
      apiKey: string;
      timestamp: number;
      folder: string;
      signature: string;
    },
    onProgress: (pct: number) => void,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${sign.cloudName}/video/upload`);
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) onProgress(Math.round((ev.loaded / ev.total) * 100));
      };
      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error(`upload_failed_${xhr.status}`));
          return;
        }
        try {
          const data = JSON.parse(xhr.responseText) as { secure_url?: string };
          if (!data.secure_url) {
            reject(new Error('no_url'));
            return;
          }
          resolve(data.secure_url);
        } catch {
          reject(new Error('bad_response'));
        }
      };
      xhr.onerror = () => reject(new Error('network_error'));

      const form = new FormData();
      form.append('file', file);
      form.append('api_key', sign.apiKey);
      form.append('timestamp', String(sign.timestamp));
      form.append('folder', sign.folder);
      form.append('signature', sign.signature);
      xhr.send(form);
    });
  };

  const handleFiles = async (rawFiles: FileList) => {
    setError(null);
    const already = state.videos.length;
    const remainingSlots = MAX_CLIPS - already;
    if (remainingSlots <= 0) {
      setError(`You already have ${MAX_CLIPS} clips — remove one to add another.`);
      return;
    }
    const files = Array.from(rawFiles).slice(0, remainingSlots);

    // Pre-validate before we start uploading. Doing both the type and size
    // check up front means we fail the whole batch cleanly instead of
    // landing 2 clips and erroring on the 3rd.
    for (const f of files) {
      if (!f.type.startsWith('video/')) {
        setError(`"${f.name}" isn't a video.`);
        return;
      }
      if (f.size > MAX_BYTES_PER_CLIP) {
        const mb = Math.round(f.size / (1024 * 1024));
        setError(
          `"${f.name}" is ${mb}MB — each clip must be under ${MAX_MB_PER_CLIP}MB.`,
        );
        return;
      }
    }

    setUploading(true);
    setProgress({ current: 0, total: files.length, pct: 0, phase: 'compress' });
    try {
      const signResp = await fetch('/api/cloudinary/sign', { method: 'POST' });
      if (!signResp.ok) {
        if (signResp.status === 503) {
          throw new Error(
            'Cloudinary is not configured yet. Ask the developer to set the keys.',
          );
        }
        throw new Error('sign_failed');
      }
      const sign = (await signResp.json()) as {
        cloudName: string;
        apiKey: string;
        timestamp: number;
        folder: string;
        signature: string;
      };

      const uploaded: string[] = [];
      for (let i = 0; i < files.length; i += 1) {
        // Phase 1: compress client-side to ~720p + 1.5Mbps webm.
        // Shrinks typical 25-45MB phone clips down to 5-10MB each,
        // saving both upload bandwidth and Cloudinary storage.
        setProgress({
          current: i + 1,
          total: files.length,
          pct: 0,
          phase: 'compress',
        });
        const { compressVideo } = await import('@/lib/video-compress');
        const { file: prepped } = await compressVideo(files[i], (pct) =>
          setProgress({
            current: i + 1,
            total: files.length,
            pct,
            phase: 'compress',
          }),
        );

        // Phase 2: upload the compressed clip to Cloudinary.
        setProgress({
          current: i + 1,
          total: files.length,
          pct: 0,
          phase: 'upload',
        });
        const url = await uploadOne(prepped, sign, (pct) =>
          setProgress({
            current: i + 1,
            total: files.length,
            pct,
            phase: 'upload',
          }),
        );
        uploaded.push(url);
      }

      setState((s) => ({
        ...s,
        videos: [...s.videos, ...uploaded].slice(0, MAX_CLIPS),
      }));
    } catch (err) {
      console.error('[video upload]', err);
      setError(
        err instanceof Error && err.message.includes('Cloudinary')
          ? err.message
          : 'Upload failed. Please try again.',
      );
    } finally {
      setUploading(false);
      setProgress({ current: 0, total: 0, pct: 0, phase: 'compress' });
    }
  };

  const removeClip = (idx: number) => {
    setState((s) => ({
      ...s,
      videos: s.videos.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div>
      <SectionLabel>Your Video reel</SectionLabel>
      <VideoTemplateHint state={state} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 8,
          marginTop: 4,
        }}
      >
        {state.videos.map((url, i) => (
          <div
            key={url + i}
            style={{
              position: 'relative',
              aspectRatio: '9 / 16',
              borderRadius: 10,
              overflow: 'hidden',
              background: '#000',
              border: '1px solid #eee',
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={url}
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              onMouseEnter={(e) => void (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
              onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
            />
            <div
              style={{
                position: 'absolute',
                top: 6,
                left: 6,
                padding: '2px 6px',
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 99,
                background: 'rgba(0,0,0,0.55)',
                color: '#fff',
                backdropFilter: 'blur(4px)',
              }}
            >
              {i + 1}
            </div>
            <button
              onClick={() => removeClip(i)}
              aria-label={`Remove clip ${i + 1}`}
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 24,
                height: 24,
                borderRadius: 99,
                border: 'none',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                fontSize: 12,
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
              }}
            >
              ×
            </button>
          </div>
        ))}

        {state.videos.length < MAX_CLIPS && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{
              aspectRatio: '9 / 16',
              border: '2px dashed #c9748a',
              borderRadius: 10,
              background: uploading ? '#f9e5eb' : '#fff5f7',
              color: '#c9748a',
              cursor: uploading ? 'wait' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              fontFamily: 'inherit',
              position: 'relative',
              overflow: 'hidden',
              padding: 8,
              textAlign: 'center',
            }}
          >
            {uploading ? (
              <>
                <div style={{ fontSize: 18 }}>…</div>
                <div style={{ fontSize: 10, fontWeight: 600, lineHeight: 1.3 }}>
                  {progress.total > 1
                    ? `Clip ${progress.current} / ${progress.total}`
                    : progress.phase === 'compress'
                      ? 'Compressing'
                      : 'Uploading'}
                  <br />
                  {progress.phase === 'compress' ? 'Compressing' : 'Uploading'}{' '}
                  {progress.pct}%
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    height: 3,
                    width: `${progress.pct}%`,
                    background:
                      progress.phase === 'compress' ? '#8b5cf6' : '#c9748a',
                    transition: 'width 0.2s',
                  }}
                />
              </>
            ) : (
              <>
                <div style={{ fontSize: 22 }}>＋</div>
                <div style={{ fontSize: 11, fontWeight: 700 }}>
                  {state.videos.length === 0 ? 'ADD VIDEOS' : 'ADD MORE'}
                </div>
                <div style={{ fontSize: 9, opacity: 0.75, lineHeight: 1.3 }}>
                  up to {MAX_CLIPS} clips
                  <br />
                  ≤{MAX_MB_PER_CLIP}MB each
                </div>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length) {
            void handleFiles(e.target.files);
          }
          e.target.value = '';
        }}
      />

      <div
        style={{
          marginTop: 8,
          fontSize: 11,
          color: '#888',
          lineHeight: 1.5,
        }}
      >
        She&apos;ll see them as a little reel — stacked vertically, auto-playing
        in order, with your names on the handle. Up to {MAX_CLIPS} clips, each
        under {MAX_MB_PER_CLIP}MB.
      </div>

      {error && (
        <div
          style={{
            marginTop: 8,
            padding: 10,
            borderRadius: 8,
            background: '#fff3f3',
            border: '1px solid #ffd0d0',
            color: '#a33',
            fontSize: 12,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

function VideoTemplateHint({ state }: { state: OrderState }) {
  const tmpl = TEMPLATES[state.template];
  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        padding: 12,
        marginBottom: 10,
        borderRadius: 12,
        background: '#faf7f2',
        border: '1px solid #ece6db',
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 96,
          height: 54,
          borderRadius: 8,
          background: `linear-gradient(160deg, ${tmpl.palette.bg2}, ${tmpl.palette.bg})`,
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${tmpl.palette.accent}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 99,
            background: 'rgba(0,0,0,0.45)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            border: '1px solid rgba(255,255,255,0.25)',
          }}
        >
          ▶
        </div>
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: 6,
            fontSize: 7,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: tmpl.palette.accent,
            fontWeight: 700,
          }}
        >
          In chat
        </div>
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
          How your video shows up
        </div>
        <div
          style={{
            fontSize: 12,
            color: '#666',
            marginTop: 3,
            lineHeight: 1.5,
          }}
        >
          Arrives mid-chat as a chat bubble she can tap to play. One long clip
          works best (under 60 seconds). Style of frame set by the treatment
          you pick below.
        </div>
      </div>
    </div>
  );
}

function VideoTreatmentSection({
  state,
  setState,
}: {
  state: OrderState;
  setState: SetState;
}) {
  const preview =
    state.photos.length > 0 ? state.photos : DEMO_PHOTOS.slice(0, 1);
  return (
    <div>
      <SectionLabel>Video Treatment</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {(
          Object.entries(VIDEO_TREATMENTS) as [
            VideoTreatmentId,
            (typeof VIDEO_TREATMENTS)[VideoTreatmentId],
          ][]
        ).map(([id, V]) => {
          const active = state.videoTreatment === id;
          return (
            <button
              key={id}
              onClick={() => setState((s) => ({ ...s, videoTreatment: id }))}
              aria-pressed={active}
              style={{
                position: 'relative',
                padding: 0,
                borderRadius: 12,
                border: '2px solid',
                borderColor: active ? '#8b5cf6' : '#e0e0e0',
                background: active ? '#f7f3ff' : '#fff',
                cursor: 'pointer',
                overflow: 'hidden',
                fontFamily: 'inherit',
                textAlign: 'left',
                transition: 'all 0.15s',
                boxShadow: active
                  ? '0 0 0 3px rgba(139, 92, 246, 0.18), 0 8px 20px rgba(139, 92, 246, 0.22)'
                  : 'none',
              }}
            >
              <TreatmentPreview id={id} still={preview[0]} />
              <div style={{ padding: 10 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: active ? '#5b21b6' : '#1a1a1a',
                  }}
                >
                  {V.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: '#888',
                    lineHeight: 1.4,
                    marginTop: 2,
                  }}
                >
                  {V.desc}
                </div>
              </div>
              {active && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 22,
                    height: 22,
                    borderRadius: 99,
                    background: '#8b5cf6',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.5)',
                  }}
                >
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TreatmentPreview({
  id,
  still,
}: {
  id: VideoTreatmentId;
  still: string;
}) {
  const filter =
    id === 'vintage'
      ? 'sepia(0.4) contrast(1.1)'
      : id === 'dreamy'
        ? 'blur(2px) brightness(1.1)'
        : id === 'fullbleed'
          ? 'none'
          : 'brightness(0.85)';
  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: '16 / 9',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={still}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter,
          display: 'block',
        }}
      />
      {id === 'letterbox' && (
        <>
          <div style={letterboxBar(true)} />
          <div style={letterboxBar(false)} />
        </>
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 99,
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          ▶
        </div>
      </div>
    </div>
  );
}

function letterboxBar(top: boolean): React.CSSProperties {
  return {
    position: 'absolute',
    left: 0,
    right: 0,
    [top ? 'top' : 'bottom']: 0,
    height: '15%',
    background: '#000',
  };
}

function LayoutPreview({
  layout,
  photos,
}: {
  layout: PhotoLayoutId;
  photos: string[];
}) {
  const palette = TEMPLATES.rose_dark.palette;
  return (
    <div
      style={{
        position: 'relative',
        height: 110,
        background: `linear-gradient(160deg, ${palette.bg2}, ${palette.bg})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        overflow: 'hidden',
      }}
    >
      {layout === 'polaroid' && <PolaroidPreview photos={photos} />}
      {layout === 'slideshow' && <SlideshowPreview photos={photos} />}
      {layout === 'filmstrip' && <FilmstripPreview photos={photos} />}
      {layout === 'grid' && <GridPreview photos={photos} />}
    </div>
  );
}

function PolaroidPreview({ photos }: { photos: string[] }) {
  const row = photos.slice(0, 3);
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
      {row.map((p, i) => (
        <div
          key={i}
          style={{
            width: 42,
            height: 54,
            background: '#fff',
            padding: 3,
            paddingBottom: 9,
            boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
            transform: `rotate(${(i - 1) * 5}deg)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
}

function SlideshowPreview({ photos }: { photos: string[] }) {
  const hero = photos[0];
  return (
    <div
      style={{
        width: 70,
        height: 88,
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
      }}
    >
      {hero && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={hero}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  );
}

function FilmstripPreview({ photos }: { photos: string[] }) {
  const row = photos.slice(0, 4);
  return (
    <div
      style={{
        display: 'flex',
        gap: 3,
        padding: '4px 0',
        borderTop: '1.5px dashed rgba(201,167,122,0.5)',
        borderBottom: '1.5px dashed rgba(201,167,122,0.5)',
        background: '#1a0a05',
      }}
    >
      {row.map((p, i) => (
        <div key={i} style={{ width: 26, height: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'sepia(0.25) saturate(1.1)',
            }}
          />
        </div>
      ))}
    </div>
  );
}

function GridPreview({ photos }: { photos: string[] }) {
  const row = photos.slice(0, 4);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 3,
        width: 76,
      }}
    >
      {row.map((p, i) => (
        <div key={i} style={{ aspectRatio: '1', borderRadius: 3, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
      <span
        style={{
          color: '#888',
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: '#1a1a1a',
          fontWeight: 500,
          textAlign: 'right',
          textTransform: 'capitalize',
        }}
      >
        {value}
      </span>
    </div>
  );
}
