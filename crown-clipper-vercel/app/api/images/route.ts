import { PHOTO_ORIGIN, PHOTO_SLOTS } from '@/lib/photo-source';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const response = await fetch(`${PHOTO_ORIGIN}/api/images`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Photo listing returned ${response.status}`);
    const uploaded = await response.json() as Record<string, { position?: number; url?: string }>;
    const images: Record<string, { url: string; position: number }> = {};
    for (const slot of PHOTO_SLOTS) {
      if (!uploaded[slot]?.url) continue;
      const version = new URL(uploaded[slot].url, PHOTO_ORIGIN).searchParams.get('v');
      images[slot] = {
        url: `/api/images/${slot}${version ? `?v=${encodeURIComponent(version)}` : ''}`,
        position: Number.isFinite(uploaded[slot].position) ? Math.max(0, Math.min(100, uploaded[slot].position!)) : 50,
      };
    }
    return Response.json(images, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Unable to load managed photos', error);
    return Response.json({}, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
