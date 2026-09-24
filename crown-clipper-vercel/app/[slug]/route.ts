import {pages} from "@/content/pages";
import {PHOTO_ORIGIN} from "@/lib/photo-source";
export function GET(_request: Request, {params}: {params: Promise<{slug:string}>}) { return params.then(({slug}) => slug === 'photos' ? Response.redirect(`${PHOTO_ORIGIN}/photos`, 302) : pages[slug] ? new Response(pages[slug], {headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"}}) : new Response("Not found",{status:404})); }
