import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return bad("Requisição inválida.");
  }

  const author = String(form.get("author") ?? "").trim();
  const rating = Number(form.get("rating"));
  const text = String(form.get("text") ?? "").trim();
  const honeypot = String(form.get("website") ?? "").trim();
  const photo = form.get("photo");

  if (honeypot) return NextResponse.json({ ok: true }); // bot: finge sucesso
  if (author.length < 2 || author.length > 80) return bad("Informe um nome válido.");
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return bad("Selecione uma nota de 1 a 5.");
  if (text.length < 10 || text.length > 2000)
    return bad("A avaliação deve ter entre 10 e 2000 caracteres.");

  const admin = createAdminClient();
  let photoUrl: string | null = null;

  if (photo instanceof File && photo.size > 0) {
    if (!ALLOWED_MIME.has(photo.type)) return bad("A foto deve ser JPG, PNG ou WebP.");
    if (photo.size > MAX_PHOTO_BYTES) return bad("A foto pode ter no máximo 5 MB.");

    const path = `${crypto.randomUUID()}.${EXT[photo.type]}`;
    const { error: upErr } = await admin.storage
      .from("testimonials")
      .upload(path, photo, { contentType: photo.type, upsert: false });

    if (upErr) return bad("Não foi possível enviar a foto. Tente novamente.", 502);

    photoUrl = admin.storage.from("testimonials").getPublicUrl(path).data.publicUrl;
  }

  const { error } = await admin.from("testimonials").insert({
    author,
    rating,
    text,
    photo_url: photoUrl,
    status: "pending",
    featured: false,
  });

  if (error) return bad("Não foi possível enviar agora. Tente novamente em instantes.", 502);

  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
