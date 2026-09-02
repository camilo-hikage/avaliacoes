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
 *  Endpoint público: GET https://featurable.com/api/v1/widgets/:widgetId
 *  A curadoria (quais avaliações sincronizar) é feita no painel do
 *  Featurable; aqui ainda dá para OCULTAR outras na tela /admin.
 * ------------------------------------------------------------------ */

type FeaturableReviewRaw = {
  reviewId?: string;
  id?: string;
  reviewer?: {
    displayName?: string;
    profilePhotoUrl?: string;
    isAnonymous?: boolean;
  };
  author?: string;
  profilePhotoUrl?: string;
  starRating?: number | string;
  rating?: number;
  comment?: string;
  text?: string;
  createTime?: string;
  updateTime?: string;
  relativeTimeDescription?: string;
};

type FeaturableResponse = {
  success?: boolean;
  reviews?: FeaturableReviewRaw[];
  averageRating?: number;
  totalReviewCount?: number;
  totalReviews?: number;
  profileUrl?: string;
  googleMapsUrl?: string;
};

const STAR_WORDS: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

function toRating(v: number | string | undefined): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return STAR_WORDS[v.toUpperCase()] ?? (Number(v) || 0);
  return 0;
}

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
    res = await fetch(`https://featurable.com/api/v1/widgets/${widgetId}`, {
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
  const rawList = Array.isArray(data.reviews) ? data.reviews : [];

  const reviews: GoogleReview[] = rawList.map((r, i) => ({
    id: r.reviewId ?? r.id ?? `featurable-${i}`,
    author: r.reviewer?.displayName ?? r.author ?? "Usuário do Google",
    authorPhoto: r.reviewer?.profilePhotoUrl ?? r.profilePhotoUrl ?? null,
    authorUrl: null,
    rating: toRating(r.starRating ?? r.rating),
    text: r.comment ?? r.text ?? "",
    relativeTime: r.relativeTimeDescription ?? relativeTime(r.createTime ?? r.updateTime),
    publishTime: r.createTime ?? r.updateTime ?? "",
  }));

  return {
    configured: true,
    rating: data.averageRating ?? null,
    total: data.totalReviewCount ?? data.totalReviews ?? null,
    mapsUri: data.googleMapsUrl ?? data.profileUrl ?? null,
    reviews,
    error: null,
  };
}
