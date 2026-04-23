import { v2 as cloudinary } from 'cloudinary';

// Parse the Cloudinary public_id out of a delivery URL. Shape:
//   https://res.cloudinary.com/<cloud>/image|video/upload/.../<publicId>.<ext>
// Returns null if the URL isn't ours (e.g. external hotlink) so the caller
// can skip it safely rather than attempt a destroy that would 404.
export function publicIdFromUrl(url: string): {
  publicId: string;
  resourceType: 'image' | 'video';
} | null {
  try {
    const u = new URL(url);
    if (!u.hostname.endsWith('cloudinary.com')) return null;
    const parts = u.pathname.split('/').filter(Boolean);
    const uploadIdx = parts.indexOf('upload');
    if (uploadIdx === -1) return null;
    const resourceType = parts[uploadIdx - 1];
    if (resourceType !== 'image' && resourceType !== 'video') return null;
    // Everything after `upload/` minus the version segment (`v1234`).
    const rest = parts.slice(uploadIdx + 1);
    const withoutVersion = /^v\d+$/.test(rest[0]) ? rest.slice(1) : rest;
    const joined = withoutVersion.join('/');
    const publicId = joined.replace(/\.[^.]+$/, '');
    if (!publicId) return null;
    return { publicId, resourceType };
  } catch {
    return null;
  }
}

function ensureConfigured(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return false;
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  return true;
}

// Best-effort delete — swallows per-asset errors so one missing file doesn't
// block the cleanup of the rest. Returns how many destroys succeeded.
export async function destroyAssets(urls: string[]): Promise<number> {
  if (urls.length === 0) return 0;
  if (!ensureConfigured()) return 0;
  let succeeded = 0;
  await Promise.all(
    urls.map(async (u) => {
      const parsed = publicIdFromUrl(u);
      if (!parsed) return;
      try {
        const res = await cloudinary.uploader.destroy(parsed.publicId, {
          resource_type: parsed.resourceType,
          invalidate: true,
        });
        if (res.result === 'ok' || res.result === 'not_found') succeeded += 1;
      } catch {
        // Network/credential hiccup — leave it for the next sweep.
      }
    }),
  );
  return succeeded;
}
