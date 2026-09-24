import {pages} from "@/content/pages";
export function GET() { return new Response(pages.index, {headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"}}); }
