import { fetchGoogleReviews } from "@/lib/google";
import { fetchInstagramPosts } from "@/lib/instagram";
import { createClient } from "@/lib/supabase/server";
import { ReviewsWall, type WallItem } from "@/components/ReviewsWall";
import { InstagramCarousel } from "@/components/InstagramCarousel";
import { TestimonialForm } from "@/components/TestimonialForm";
import { StarRating } from "@/components/StarRating";
import { TornDivider } from "@/components/TornDivider";

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

  const [{ configured, rating, total, mapsUri, reviews }, insta, hiddenRes, testimonialsRes] =
    await Promise.all([
      fetchGoogleReviews(),
      fetchInstagramPosts(),
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
    badge: t.featured ? "Destaque" : "Cliente",
  });

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
      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">Tio Bar e Restaurante</p>
          <h1 className="display">O que dizem por aí</h1>
          {configured && rating != null ? (
            <p className="hero-rating">
              <StarRating value={rating} />
              <span>
                <strong>{rating.toFixed(1)}</strong> · {total} avaliações no Google
              </span>
              {mapsUri ? (
                <a href={mapsUri} target="_blank" rel="noreferrer">
                  ver no Google
                </a>
              ) : null}
            </p>
          ) : null}
        </div>
        <TornDivider position="bottom" tone="paper" variant="wave" />
      </section>

      {/* ---------------- INSTAGRAM ---------------- */}
      {insta.configured && insta.posts.length > 0 ? (
        <section className="insta-band">
          <div className="section-head">
            <p className="eyebrow">
              No Instagram{insta.username ? ` · @${insta.username}` : ""}
            </p>
            <h2 className="display">Últimos momentos no Tio</h2>
          </div>
          <InstagramCarousel posts={insta.posts} />
        </section>
      ) : null}

      {/* ---------------- MURAL DE AVALIAÇÕES ---------------- */}
      <section className="reviews-band">
        <div className="section-head">
          <p className="eyebrow">Avaliações</p>
          <h2 className="display">Palavra de quem já veio</h2>
        </div>
        <ReviewsWall items={items} />
        <TornDivider position="bottom" tone="ink" />
      </section>

      {/* ---------------- CHAMADA / FORMULÁRIO ---------------- */}
      <section id="avaliar" className="cta-band">
        <div className="cta-inner">
          <p className="eyebrow">Sua vez</p>
          <h2 className="display">Deixe a sua avaliação</h2>
          <p className="cta-lead">
            Comeu, bebeu, curtiu a música? Conta pra gente — depois de aprovada, sua avaliação
            aparece aqui no mural.
          </p>
          <TestimonialForm />
        </div>
      </section>
    </main>
  );
}
