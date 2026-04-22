import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Signed-upload endpoint: returns a one-time signature the client uses to
// upload directly to Cloudinary. The API secret never leaves the server.
//
// Flow:
//   1. Client → POST /api/cloudinary/sign → {cloudName, apiKey, timestamp, folder, signature}
//   2. Client → POST https://api.cloudinary.com/v1_1/{cloudName}/image/upload
//      with the file + returned fields → Cloudinary returns {secure_url, ...}
//   3. Client stores secure_url in state.photos
export async function POST() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'cloudinary_not_configured' },
      { status: 503 },
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'proposemagic/orders';

  // Signs ONLY the params we lock down — folder + timestamp. Any additional
  // param the client sends unsigned will be rejected by Cloudinary.
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    apiSecret,
  );

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature,
  });
}
