// Client-side video compression using HTMLVideoElement → Canvas → MediaRecorder.
// Plays the source video, draws each frame to a downscaled canvas, captures
// the canvas (plus the original audio track) as a MediaStream, and re-encodes
// via MediaRecorder at a low bitrate.
//
// Typical savings: a 30MB / 1080p phone clip → ~6-8MB / 720p webm.
//
// Known limitations:
//   - Runs in real-time (a 60s clip takes ~60s to compress). We surface
//     progress via onProgress so the UI can show a bar instead of
//     freezing.
//   - iOS Safari MediaRecorder + captureStream support is patchy on
//     older iOS versions. We feature-detect and fall back to uploading
//     the original file when unsupported.
//   - Re-encoded output is typically WebM (VP8/VP9 + Opus). Cloudinary
//     happily ingests WebM and transcodes for delivery.

export type CompressResult = {
  file: File;
  compressed: boolean;
  originalBytes: number;
  finalBytes: number;
};

const MAX_SHORT_EDGE = 720;
const VIDEO_BITRATE = 1_500_000; // 1.5 Mbps
const AUDIO_BITRATE = 96_000;
const SKIP_IF_UNDER = 3 * 1024 * 1024; // 3MB — not worth the processing time

// Accept a File (or Blob), return compressed File (or original on fallback).
// The onProgress callback receives 0-100 as the video plays through.
export async function compressVideo(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<CompressResult> {
  const origBytes = file.size;

  if (file.size < SKIP_IF_UNDER) {
    return { file, compressed: false, originalBytes: origBytes, finalBytes: origBytes };
  }

  if (typeof MediaRecorder === 'undefined') {
    return { file, compressed: false, originalBytes: origBytes, finalBytes: origBytes };
  }

  const mime = pickMime();
  if (!mime) {
    return { file, compressed: false, originalBytes: origBytes, finalBytes: origBytes };
  }

  let objectUrl: string | null = null;
  let audioCtx: AudioContext | null = null;
  const video = document.createElement('video');
  video.preload = 'auto';
  // Triple-silenced: muted attribute + volume:0 + audio piped through a
  // Web Audio destination that's NEVER connected to ctx.destination, so
  // even though playback is happening (we need it to drive the draw loop
  // and the audio capture), nothing reaches the speakers.
  video.muted = true;
  video.volume = 0;
  video.playsInline = true;
  video.crossOrigin = 'anonymous';

  try {
    objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    await loadMetadata(video);

    const { width, height } = fitDimensions(video.videoWidth, video.videoHeight);
    if (!width || !height) throw new Error('bad_dimensions');

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no_canvas_ctx');

    if (typeof canvas.captureStream !== 'function') {
      throw new Error('no_canvas_capturestream');
    }
    const canvasStream = canvas.captureStream(30);

    // Grab the audio track via Web Audio API instead of HTMLVideoElement
    // captureStream. The Web Audio path lets us tap the audio data
    // *without* routing it to the speakers — `source.connect(destination)`
    // sends to the MediaStream, but we never call connect(audioCtx.destination)
    // so the user doesn't hear the video while it processes.
    const audioCapture = createSilentAudioCapture(video);
    audioCtx = audioCapture?.ctx ?? null;

    const combined = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...(audioCapture?.tracks ?? []),
    ]);

    const recorder = new MediaRecorder(combined, {
      mimeType: mime,
      videoBitsPerSecond: VIDEO_BITRATE,
      audioBitsPerSecond: AUDIO_BITRATE,
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };

    const finished = new Promise<Blob>((resolve, reject) => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: mime }));
      recorder.onerror = (e) => reject(e);
    });

    recorder.start(250); // flush to ondataavailable every 250ms

    // Drive a draw loop synced to video playback. Not requestVideoFrameCallback
    // because Safari support is still spotty — RAF at 30fps is sufficient.
    let rafId = 0;
    const draw = () => {
      if (video.paused || video.ended) return;
      ctx.drawImage(video, 0, 0, width, height);
      const duration = video.duration || 0;
      if (duration > 0 && onProgress) {
        onProgress(Math.min(99, Math.round((video.currentTime / duration) * 100)));
      }
      rafId = requestAnimationFrame(draw);
    };

    await video.play();
    draw();

    await waitForEnd(video);

    cancelAnimationFrame(rafId);
    recorder.stop();
    const blob = await finished;
    onProgress?.(100);

    // Sometimes re-encoding actually makes already-compressed files
    // BIGGER (old codecs → VP8 can grow). Skip in that case.
    if (blob.size >= Math.floor(file.size * 0.95)) {
      return {
        file,
        compressed: false,
        originalBytes: origBytes,
        finalBytes: origBytes,
      };
    }

    const ext = mime.includes('mp4') ? '.mp4' : '.webm';
    const newName = file.name.replace(/\.[^.]+$/, '') + ext;
    const out = new File([blob], newName, { type: mime });

    return {
      file: out,
      compressed: true,
      originalBytes: origBytes,
      finalBytes: out.size,
    };
  } catch (err) {
    console.warn('[video-compress] failed, using original:', err);
    return { file, compressed: false, originalBytes: origBytes, finalBytes: origBytes };
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    try {
      video.pause();
      video.removeAttribute('src');
      video.load();
    } catch {
      // ignored
    }
    try {
      void audioCtx?.close();
    } catch {
      // ignored
    }
  }
}

function pickMime(): string {
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];
  for (const m of candidates) {
    if (MediaRecorder.isTypeSupported(m)) return m;
  }
  return '';
}

function fitDimensions(
  sw: number,
  sh: number,
): { width: number; height: number } {
  if (!sw || !sh) return { width: 0, height: 0 };
  const shortSide = Math.min(sw, sh);
  const scale = shortSide > MAX_SHORT_EDGE ? MAX_SHORT_EDGE / shortSide : 1;
  // Round to even for codec compatibility.
  const width = Math.max(2, Math.round(sw * scale) & ~1);
  const height = Math.max(2, Math.round(sh * scale) & ~1);
  return { width, height };
}

function loadMetadata(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener('loadedmetadata', ok);
      video.removeEventListener('error', fail);
    };
    const ok = () => {
      cleanup();
      resolve();
    };
    const fail = () => {
      cleanup();
      reject(new Error('metadata_load_failed'));
    };
    video.addEventListener('loadedmetadata', ok);
    video.addEventListener('error', fail);
    // Safety timeout — bad codecs or corrupt files sometimes hang.
    window.setTimeout(() => {
      cleanup();
      reject(new Error('metadata_timeout'));
    }, 12000);
  });
}

function waitForEnd(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    const on = () => {
      video.removeEventListener('ended', on);
      resolve();
    };
    video.addEventListener('ended', on);
  });
}

// Pipes the video's audio through Web Audio so we can capture the
// stream WITHOUT routing it to the speakers. Connecting source →
// destinationNode is the "tap" — and crucially we never call
// `source.connect(audioCtx.destination)`, which is the only path that
// would make audio audible. Net result: the recorder gets clean audio
// frames while the user hears nothing during compression.
function createSilentAudioCapture(
  video: HTMLVideoElement,
): { ctx: AudioContext; tracks: MediaStreamTrack[] } | null {
  try {
    const Ctor =
      typeof window !== 'undefined'
        ? (window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext })
              .webkitAudioContext)
        : null;
    if (!Ctor) return null;
    const ctx = new Ctor();
    const source = ctx.createMediaElementSource(video);
    const destination = ctx.createMediaStreamDestination();
    source.connect(destination);
    // Intentionally NOT connecting source to ctx.destination — that's
    // what would send audio to the user's speakers.
    return { ctx, tracks: destination.stream.getAudioTracks() };
  } catch {
    // createMediaElementSource throws if called twice on the same video,
    // or in environments without Web Audio. We've created a fresh video
    // element so the former shouldn't happen, but the catch keeps the
    // rest of the compressor working without audio in degenerate cases.
    return null;
  }
}
