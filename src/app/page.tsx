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
  const mapsQuery =
    process.env.NEXT_PUBLIC_MAPS_QUERY ||
    "Tio Bar e Restaurante, Av. Professor Celestino Bourroul, 1068 - Limão, São Paulo";
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
            No final de 2008, por conta de uma necessidade, tive a ideia de
            empreender com cachorro-quente — o dinheiro era muito curto. Comecei
            com R$ 1.500,00, o suficiente para comprar o carrinho de inox e os
            insumos.
          </p>
          <p>
            Depois de 3 meses comprei uma Towner e, a partir dali, minha história
            começou a mudar.
          </p>
          <p>
            Cinco anos depois tive a oportunidade de conhecer o chef Edu Guedes,
            um divisor de águas na minha vida. Com a ajuda dele consegui montar
            uma Kombi e, com isso, foi possível crescer ainda mais o negócio.
          </p>
          <p>
            Passados outros 5 anos, montei o food truck dos sonhos. Quando pensei
            que tinha chegado ao máximo, 4 anos depois abri meu restaurante: o
            Tio Bar e Restaurante.
          </p>
          <p>
            Minha maior satisfação é ter reconhecimento no bairro — tanto como
            Tio do Dog quanto como Tio Bar e Restaurante. Meu agradecimento ao
            bairro do Limão e à Zona Norte por terem mudado a minha vida.
          </p>
        </div>
        {menu.configured && menu.categories.length > 0 ? (
          <TornDivider position="bottom" variant="layered" />
        ) : null}
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
        <TornDivider position="top" variant="layered" ramp="gold" />
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
      <section id="mapa" className="map-band">
        <div className="map-inner">
          <p className="eyebrow">Onde ficamos</p>
          <h2 className="display">Venha nos visitar</h2>
          <p className="venue-tagline">Comida gostosa com preço justo.</p>
          <ul className="venue-info">
            <li>
              <span>Endereço</span>
              Av. Professor Celestino Bourroul, 1068 — Limão, São Paulo · 02710-001
            </li>
            <li>
              <span>Horário</span>
              Todos os dias, das 11h30 à meia-noite
            </li>
            <li>
              <span>Estacionamento</span>
              Para clientes — Travessa Cápua, 96
            </li>
          </ul>
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
