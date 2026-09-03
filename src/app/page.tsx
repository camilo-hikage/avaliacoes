import { fetchGoogleReviews } from "@/lib/google";
import { fetchInstagramPosts } from "@/lib/instagram";
import { fetchMenu } from "@/lib/menu";
import { ReviewsWall, type WallItem } from "@/components/ReviewsWall";
import { MenuWall } from "@/components/MenuWall";
import { MenuModal } from "@/components/MenuModal";
import { InstagramCarousel } from "@/components/InstagramCarousel";
import { StarRating } from "@/components/StarRating";
import { TornDivider } from "@/components/TornDivider";

export default async function Home() {
  const [{ configured, rating, total, mapsUri, reviews }, insta, menu] = await Promise.all([
    fetchGoogleReviews(),
    fetchInstagramPosts(),
    fetchMenu(),
  ]);

  // --- Mapa (sem chave: embed público do Google Maps) ---
  const mapsQuery = process.env.NEXT_PUBLIC_MAPS_QUERY || "Tio Bar e Restaurante";
  const mapsPlaceId = process.env.NEXT_PUBLIC_MAPS_PLACE_ID || "";
  const mapsEmbedUrl =
    process.env.NEXT_PUBLIC_MAPS_EMBED_URL ||
    `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&z=16&output=embed`;
  const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    mapsQuery,
  )}${mapsPlaceId ? `&destination_place_id=${mapsPlaceId}` : ""}`;

  const items: WallItem[] = reviews.map((r) => ({
    key: `g-${r.id}`,
    author: r.author,
    authorPhoto: r.authorPhoto,
    rating: r.rating,
    text: r.text,
    meta: r.relativeTime,
    badge: "Google",
  }));

  return (
    <main>
      {/* ---------------- NOSSA HISTÓRIA ---------------- */}
      <section id="historia" className="story-band">
        <div className="section-head">
          <p className="eyebrow">Nossa história</p>
          <h2 className="display">Onde tudo começou</h2>
        </div>
        <div className="story-inner">
          <p>
            O Tio nasceu de uma vontade simples: ter um canto de bairro onde todo
            mundo é recebido como gente da família. Começou pequeno — poucas
            mesas, o fogão sempre aceso e uma vitrola tocando ao fundo.
          </p>
          <p>
            Com o tempo, a clientela virou vizinhança e a vizinhança virou amiga.
            O cardápio cresceu ao redor das receitas de casa, a cerveja ficou
            mais gelada e a música ganhou palco. O que não mudou foi o
            essencial: comida caseira feita na hora, preço honesto e conversa boa
            até tarde.
          </p>
          <p>
            Hoje o Tio é ponto de encontro de quem trabalha ali perto, de família
            no fim de semana e de quem só queria um lugar pra chamar de seu. Puxa
            uma cadeira — a casa é sua.
          </p>
        </div>
      </section>

      {/* ---------------- CARDÁPIO ---------------- */}
      {menu.configured && menu.categories.length > 0 ? (
        <section id="cardapio" className="menu-band">
          <div className="section-head">
            <p className="eyebrow">Cardápio</p>
            <h2 className="display">Direto do fogão</h2>
          </div>
          <MenuWall menu={menu} />
          <div className="menu-cta">
            <MenuModal
              url={`https://app.cardapioweb.com/${process.env.CARDAPIOWEB_SLUG || "tio_bar_e_restaurante"}`}
            />
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

      {/* ---------------- CHAMADA ---------------- */}
      <section id="avaliar" className="cta-band">
        <div className="cta-inner">
          <p className="eyebrow">Sua vez</p>
          <h2 className="display">Gostou? Conta pro Google</h2>
          <p className="cta-lead">
            Sua avaliação ajuda mais gente a conhecer o Tio — e leva menos de um minuto.
          </p>
          {mapsUri ? (
            <a className="btn" href={mapsUri} target="_blank" rel="noreferrer">
              Avaliar no Google
            </a>
          ) : null}
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
