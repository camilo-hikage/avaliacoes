import { createClient } from "@/lib/supabase/server";

export type Testimonial = {
  id: string;
  author: string;
  rating: number;
  text: string;
  photo_url: string | null;
  created_at: string;
  featured: boolean;
};

/**
 * Lê o que a home precisa do Supabase. Se o Supabase não estiver
 * configurado ou fora do ar, retorna listas vazias em vez de quebrar
 * a página inteira — o mural do Google e o cardápio continuam funcionando.
 */
export async function fetchHomeSupabaseData(): Promise<{
  hiddenReviewIds: string[];
  approvedTestimonials: Testimonial[];
}> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { hiddenReviewIds: [], approvedTestimonials: [] };
  }

  try {
    const supabase = await createClient();
    const [hiddenRes, testimonialsRes] = await Promise.all([
      supabase.from("hidden_google_reviews").select("review_id"),
      supabase
        .from("testimonials")
        .select("id, author, rating, text, photo_url, created_at, featured")
        .eq("status", "approved")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false }),
    ]);

    return {
      hiddenReviewIds: (hiddenRes.data ?? []).map((h) => h.review_id as string),
      approvedTestimonials: (testimonialsRes.data ?? []) as Testimonial[],
    };
  } catch (err) {
    // não engolir sinais internos do Next (ex.: rota dinâmica)
    if (err && typeof err === "object" && "digest" in err) throw err;
    console.error("Supabase indisponível na home:", err);
    return { hiddenReviewIds: [], approvedTestimonials: [] };
  }
}
