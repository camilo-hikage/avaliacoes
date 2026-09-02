export type GoogleReview = {
  id: string;
  author: string;
  authorPhoto: string | null;
  authorUrl: string | null;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
};

export type GooglePlaceReviews = {
  configured: boolean;
  rating: number | null;
  total: number | null;
  mapsUri: string | null;
  reviews: GoogleReview[];
  error: string | null;
};

const EMPTY: GooglePlaceReviews = {
  configured: true,
  rating: null,
  total: null,
  mapsUri: null,
  reviews: [],
  error: null,
};

/* ------------------------------------------------------------------ *
 *  Fonte: Featurable (https://featurable.com) — plano gratuito.
 *  GET https://featurable.com/api/v2/widgets/:widgetId
 *  A curadoria (quais avaliações aparecem) é feita no painel do Featurable.
 * ------------------------------------------------------------------ */

type FeaturableReview = {
  id: string;
  author?: { name?: string; avatarUrl?: string | null; profileUrl?: string | null };
  text?: string;
  originalText?: string;
  rating?: { value?: number; max?: number };
  publishedAt?: string;
  updatedAt?: string;
  url?: string | null;
};

type FeaturableResponse = {
  success?: boolean;
  widget?: {
    reviews?: FeaturableReview[];
    gbpLocationSummary?: {
      reviewsCount?: number;
      rating?: number;
      writeAReviewUri?: string;
    };
  };
};

function relativeTime(iso: string | undefined): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days < 1) return "hoje";
  if (days < 30) return `há ${days} dia${days > 1 ? "s" : ""}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `há ${months} ${months > 1 ? "meses" : "mês"}`;
  const years = Math.floor(months / 12);
  return `há ${years} ano${years > 1 ? "s" : ""}`;
}

export async function fetchGoogleReviews(): Promise<GooglePlaceReviews> {
  const widgetId = process.env.FEATURABLE_WIDGET_ID;

  if (!widgetId) {
    // Bloco B desativado: sem widget, apenas os depoimentos do site aparecem.
    return { ...EMPTY, configured: false };
  }

  let res: Response;
  try {
    res = await fetch(`https://featurable.com/api/v2/widgets/${widgetId}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 43_200, tags: ["google-reviews"] },
    });
  } catch {
    return { ...EMPTY, error: "Falha de rede ao contatar o Featurable." };
  }

  if (!res.ok) {
    return { ...EMPTY, error: `Featurable respondeu ${res.status}.` };
  }

  const data = (await res.json()) as FeaturableResponse;
  const widget = data.widget ?? {};
  const rawList = Array.isArray(widget.reviews) ? widget.reviews : [];
  const summary = widget.gbpLocationSummary ?? {};

  const clip = (s: string, max = 260) =>
    s.length > max ? s.slice(0, max).trimEnd() + "…" : s;

  const reviews: GoogleReview[] = rawList
    .filter((r) => (r.originalText || r.text || "").trim().length > 0)
    .map((r, i) => ({
      id: r.id ?? `featurable-${i}`,
      author: r.author?.name ?? "Usuário do Google",
      authorPhoto: r.author?.avatarUrl ?? null,
      authorUrl: r.author?.profileUrl ?? r.url ?? null,
      rating: r.rating?.value ?? 0,
      // originalText = texto original (pt-BR); text = versão traduzida pelo Featurable
      text: clip((r.originalText || r.text || "").trim()),
      relativeTime: relativeTime(r.publishedAt ?? r.updatedAt),
      publishTime: r.publishedAt ?? r.updatedAt ?? "",
    }));

  return {
    configured: true,
    rating: summary.rating ?? null,
    total: summary.reviewsCount ?? null,
    mapsUri: summary.writeAReviewUri ?? null,
    reviews,
    error: null,
  };
}
