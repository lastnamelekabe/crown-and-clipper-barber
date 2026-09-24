import { PHOTO_ORIGIN } from '@/lib/photo-source';
export const runtime = 'nodejs';
export async function GET() {
  try {
    const response = await fetch(`${PHOTO_ORIGIN}/api/team`, {cache:'no-store'});
    return new Response(response.body,{status:response.status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
  } catch { return Response.json({error:'Unable to load barber names'},{status:503}); }
}
