import { fetchGoogleReviews } from "@/lib/google";
import { createClient } from "@/lib/supabase/server";
import { ReviewsWall, type WallItem } from "@/components/ReviewsWall";
import { TestimonialForm } from "@/components/TestimonialForm";
import { StarRating } from "@/components/StarRating";

type Testimonial = {
  id: string;
  author: string;
  rating: number;
  text: string;
  photo_url: string | null;
  created_at: string;
  featured: boolean;
};

export default async function Home() {
  const supabase = await createClient();

  const [{ configured, rating, total, mapsUri, reviews }, hiddenRes, testimonialsRes] =
    await Promise.all([
      fetchGoogleReviews(),
      supabase.from("hidden_google_reviews").select("review_id"),
      supabase
        .from("testimonials")
        .select("id, author, rating, text, photo_url, created_at, featured")
        .eq("status", "approved")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false }),
    ]);

  const hidden = new Set((hiddenRes.data ?? []).map((h) => h.review_id));
  const googleReviews = reviews.filter((r) => !hidden.has(r.id));
  const testimonials = (testimonialsRes.data ?? []) as Testimonial[];

  const asWall = (t: Testimonial): WallItem => ({
    key: `t-${t.id}`,
    author: t.author,
    rating: t.rating,
    text: t.text,
    photo: t.photo_url,
    meta: new Date(t.created_at).toLocaleDateString("pt-BR"),
    badge: t.featured ? "Destaque" : undefined,
  });

  // destaques primeiro, depois Google, depois os demais depoimentos do site
  const items: WallItem[] = [
    ...testimonials.filter((t) => t.featured).map(asWall),
    ...googleReviews.map((r) => ({
      key: `g-${r.id}`,
      author: r.author,
      authorPhoto: r.authorPhoto,
      rating: r.rating,
      text: r.text,
      meta: r.relativeTime,
      badge: "Google",
    })),
    ...testimonials.filter((t) => !t.featured).map(asWall),
  ];

  return (
    <main>
      <section className="reviews-band">
        <div className="wrap reviews-band-head">
          <h1>Avaliações</h1>
          {configured && rating != null ? (
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
        </div>

        <ReviewsWall items={items} />
      </section>

      <section id="avaliar" className="wrap">
        <h2>Deixe sua avaliação</h2>
        <TestimonialForm />
      </section>
    </main>
  );
}
