"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SubmitState = { ok: boolean; error: string };

export async function submitTestimonial(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const author = String(formData.get("author") ?? "").trim();
  const rating = Number(formData.get("rating"));
  const text = String(formData.get("text") ?? "").trim();
  const honeypot = String(formData.get("website") ?? "").trim(); // anti-bot

  if (honeypot) return { ok: true, error: "" }; // engana o bot, não grava nada
  if (author.length < 2 || author.length > 80) return { ok: false, error: "Informe um nome válido." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return { ok: false, error: "Selecione uma nota de 1 a 5." };
  if (text.length < 10 || text.length > 2000)
    return { ok: false, error: "A avaliação deve ter entre 10 e 2000 caracteres." };

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({ author, rating, text });

  if (error) {
    return { ok: false, error: "Não foi possível enviar agora. Tente novamente em instantes." };
  }

  revalidatePath("/");
  return { ok: true, error: "" };
}
