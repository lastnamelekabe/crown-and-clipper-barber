import { PHOTO_ORIGIN } from '@/lib/photo-source';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.text();
  if (body.length > 16_384) return Response.json({ error: 'Booking details are too long' }, { status: 413 });
  try {
    const response = await fetch(`${PHOTO_ORIGIN}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      cache: 'no-store',
    });
    return new Response(response.body, {
      status: response.status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Unable to connect to booking service', error);
    return Response.json({ error: 'Booking is temporarily unavailable. Please try again.' }, { status: 503 });
  }
}
