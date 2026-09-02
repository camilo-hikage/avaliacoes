import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

/**
 * Chamado pelo cron da Vercel (ver vercel.json) 1x/dia para renovar o cache
 * das avaliações do Google. A Vercel envia automaticamente o header
 * "Authorization: Bearer <CRON_SECRET>" quando a env CRON_SECRET existe.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  revalidateTag("google-reviews");
  revalidateTag("menu");
  revalidateTag("instagram");
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
