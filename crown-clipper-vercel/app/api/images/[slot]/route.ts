import { PHOTO_ORIGIN, PHOTO_SLOTS } from '@/lib/photo-source';

export const runtime = 'nodejs';
type Context = { params: Promise<{ slot: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { slot } = await params;
  if (!PHOTO_SLOTS.includes(slot as typeof PHOTO_SLOTS[number])) return Response.json({ error: 'Unknown photo' }, { status: 404 });
  try {
    const response = await fetch(`${PHOTO_ORIGIN}/api/images/${slot}`, { cache: 'no-store' });
    if (!response.ok || !response.body) return Response.json({ error: 'Photo unavailable' }, { status: response.status || 503 });
    return new Response(response.body, { headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=300' } });
  } catch (error) {
    console.error('Unable to load managed photo', error);
    return Response.json({ error: 'Photo unavailable' }, { status: 503 });
  }
}
