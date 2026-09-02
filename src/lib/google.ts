export type GoogleReview = {
  id: string; // resource name da review, ex: "places/ChIJ.../reviews/abc"
  author: string;
  authorPhoto: string | null;
  authorUrl: string | null;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
};

export type GooglePlaceReviews = {
  rating: number | null;
  total: number | null;
  mapsUri: string | null;
  reviews: GoogleReview[];
  error: string | null;
};

type PlacesApiResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: Array<{
    name: string;
    rating: number;
    text?: { text?: string };
    originalText?: { text?: string };
    relativePublishTimeDescription?: string;
    publishTime?: string;
    authorAttribution?: {
      displayName?: string;
      photoUri?: string;
      uri?: string;
    };
  }>;
};

const EMPTY: GooglePlaceReviews = {
  rating: null,
  total: null,
  mapsUri: null,
  reviews: [],
  error: null,
};

/**
 * Busca as avaliações do local na Places API (New).
 * A API retorna no máximo 5 reviews e não é paginável.
 * Resultado fica em cache (Data Cache do Next) por 12h — não gravamos em banco.
 */
export async function fetchGoogleReviews(): Promise<GooglePlaceReviews> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!key || !placeId) {
    return { ...EMPTY, error: "GOOGLE_MAPS_API_KEY ou GOOGLE_PLACE_ID não configurados." };
  }

  let res: Response;
  try {
    res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: 43_200, tags: ["google-reviews"] },
    });
  } catch {
    return { ...EMPTY, error: "Falha de rede ao contatar a Places API." };
  }

  if (!res.ok) {
    return { ...EMPTY, error: `Places API respondeu ${res.status}.` };
  }

  const data = (await res.json()) as PlacesApiResponse;

  const reviews: GoogleReview[] = (data.reviews ?? []).map((r) => ({
    id: r.name,
    author: r.authorAttribution?.displayName ?? "Usuário do Google",
    authorPhoto: r.authorAttribution?.photoUri ?? null,
    authorUrl: r.authorAttribution?.uri ?? null,
    rating: r.rating ?? 0,
    text: r.text?.text ?? r.originalText?.text ?? "",
    relativeTime: r.relativePublishTimeDescription ?? "",
    publishTime: r.publishTime ?? "",
  }));

  return {
    rating: data.rating ?? null,
    total: data.userRatingCount ?? null,
    mapsUri: data.googleMapsUri ?? null,
    reviews,
    error: null,
  };
}
