import { fetchGoogleReviews } from "@/lib/google";
import { createClient } from "@/lib/supabase/server";
import { ReviewCard } from "@/components/ReviewCard";
import { TestimonialForm } from "@/components/TestimonialForm";
import { StarRating } from "@/components/StarRating";

type Testimonial = {
  id: string;
  author: string;
  rating: number;
  text: string;
  created_at: string;
  featured: boolean;
};

export default async function Home() {
  const supabase = await createClient();

  const [{ rating, total, mapsUri, reviews, error }, hiddenRes, testimonialsRes] =
    await Promise.all([
      fetchGoogleReviews(),
      supabase.from("hidden_google_reviews").select("review_id"),
      supabase
        .from("testimonials")
        .select("id, author, rating, text, created_at, featured")
        .eq("status", "approved")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false }),
    ]);

  const hidden = new Set((hiddenRes.data ?? []).map((h) => h.review_id));
  const googleReviews = reviews.filter((r) => !hidden.has(r.id));
  const testimonials = (testimonialsRes.data ?? []) as Testimonial[];

  return (
    <main className="wrap">
      <h1>Avaliações</h1>

      {rating != null ? (
        <p className="summary">
          <StarRating value={rating} /> {rating.toFixed(1)} · {total} avaliações no Google
          {mapsUri ? (
            <>
              {" · "}
              <a href={mapsUri} target="_blank" rel="noreferrer">
                ver no Google
              </a>
            </>
          ) : null}
        </p>
      ) : null}

      <section>
        <h2>Do Google</h2>
        <div className="grid">
          {googleReviews.length === 0 ? (
            <p className="muted">
              {error ?? "Nenhuma avaliação do Google para exibir no momento."}
            </p>
          ) : (
            googleReviews.map((r) => (
              <ReviewCard
                key={r.id}
                author={r.author}
                rating={r.rating}
                text={r.text}
                meta={r.relativeTime}
                badge="Google"
              />
            ))
          )}
        </div>
      </section>

      <section>
        <h2>Dos nossos clientes</h2>
        <div className="grid">
          {testimonials.length === 0 ? (
            <p className="muted">Seja o primeiro a deixar uma avaliação!</p>
          ) : (
            testimonials.map((t) => (
              <ReviewCard
                key={t.id}
                author={t.author}
                rating={t.rating}
                text={t.text}
                meta={new Date(t.created_at).toLocaleDateString("pt-BR")}
                badge={t.featured ? "Destaque" : undefined}
              />
            ))
          )}
        </div>
      </section>

      <section id="avaliar">
        <h2>Deixe sua avaliação</h2>
        <TestimonialForm />
      </section>
    </main>
  );
}
