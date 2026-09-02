import { fetchGoogleReviews } from "@/lib/google";
import { fetchInstagramPosts } from "@/lib/instagram";
import { fetchMenu } from "@/lib/menu";
import { fetchHomeSupabaseData, type Testimonial } from "@/lib/testimonials";
import { ReviewsWall, type WallItem } from "@/components/ReviewsWall";
import { MenuWall } from "@/components/MenuWall";
import { InstagramCarousel } from "@/components/InstagramCarousel";
import { TestimonialForm } from "@/components/TestimonialForm";
import { StarRating } from "@/components/StarRating";
import { TornDivider } from "@/components/TornDivider";

// a home lê a sessão/depoimentos do Supabase -> render por request
export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ configured, rating, total, mapsUri, reviews }, insta, menu, supa] = await Promise.all([
    fetchGoogleReviews(),
    fetchInstagramPosts(),
    fetchMenu(),
    fetchHomeSupabaseData(),
  ]);

  const hidden = new Set(supa.hiddenReviewIds);
  const googleReviews = reviews.filter((r) => !hidden.has(r.id));
  const testimonials: Testimonial[] = supa.approvedTestimonials;

  // --- Mapa (sem chave: embed público do Google Maps) ---
  const mapsQuery = process.env.NEXT_PUBLIC_MAPS_QUERY || "Tio Bar e Restaurante";
  const mapsPlaceId = process.env.NEXT_PUBLIC_MAPS_PLACE_ID || "";
  const mapsEmbedUrl =
    process.env.NEXT_PUBLIC_MAPS_EMBED_URL ||
    `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&z=16&output=embed`;
  const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    mapsQuery,
  )}${mapsPlaceId ? `&destination_place_id=${mapsPlaceId}` : ""}`;

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
      {/* ---------------- CARDÁPIO ---------------- */}
      {menu.configured && menu.categories.length > 0 ? (
        <section id="cardapio" className="menu-band">
          <div className="section-head">
            <p className="eyebrow">Cardápio</p>
            <h2 className="display">Direto do fogão</h2>
          </div>
          <MenuWall menu={menu} />
          <div className="menu-cta">
            <a
              className="btn"
              href="https://app.cardapioweb.com/tio_bar_e_restaurante"
              target="_blank"
              rel="noreferrer"
            >
              Ver cardápio completo
            </a>
          </div>
        </section>
      ) : null}

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

      {/* ---------------- HERO / INTRO DAS AVALIAÇÕES ---------------- */}
      <section className="hero">
        <TornDivider position="top" tone="paper" variant="wave" />
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

      {/* ---------------- MURAL DE AVALIAÇÕES ---------------- */}
      <section className="reviews-band">
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

      {/* ---------------- MAPA ---------------- */}
      <section className="map-band">
        <div className="map-inner">
          <p className="eyebrow">Onde ficamos</p>
          <h2 className="display">Venha nos visitar</h2>
          <a className="btn" href={mapsDirectionsUrl} target="_blank" rel="noreferrer">
            Como chegar
          </a>
        </div>
        <div className="map-frame">
          <iframe
            src={mapsEmbedUrl}
            title="Mapa — Tio Bar e Restaurante"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </main>
  );
}
