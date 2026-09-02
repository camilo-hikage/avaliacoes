export type InstagramPost = {
  id: string;
  image: string;
  permalink: string;
  caption: string;
  isVideo: boolean;
};

export type InstagramFeed = {
  configured: boolean;
  username: string | null;
  posts: InstagramPost[];
  error: string | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Busca os últimos posts do Instagram via Behold.so (plano gratuito).
 * Painel do Behold -> conecta o Instagram -> copia o Feed ID.
 * Endpoint: https://feeds.behold.so/<feedId>  (JSON, sem auth)
 * Deixe BEHOLD_FEED_ID vazio para esconder a seção.
 */
export async function fetchInstagramPosts(): Promise<InstagramFeed> {
  const feedId = process.env.BEHOLD_FEED_ID;
  if (!feedId) {
    return { configured: false, username: null, posts: [], error: null };
  }

  let res: Response;
  try {
    res = await fetch(`https://feeds.behold.so/${feedId}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600, tags: ["instagram"] },
    });
  } catch {
    return { configured: true, username: null, posts: [], error: "Falha de rede ao contatar o Behold." };
  }

  if (!res.ok) {
    return { configured: true, username: null, posts: [], error: `Behold respondeu ${res.status}.` };
  }

  const data = (await res.json()) as any;
  const raw: any[] = Array.isArray(data?.posts) ? data.posts : [];

  const posts: InstagramPost[] = raw
    .slice(0, 20)
    .map((p) => {
      const sizes = p.sizes ?? {};
      const image =
        sizes.medium?.mediaUrl ??
        sizes.small?.mediaUrl ??
        p.thumbnailUrl ??
        p.mediaUrl ??
        "";
      return {
        id: String(p.id ?? p.permalink ?? image),
        image,
        permalink: p.permalink ?? "#",
        caption: String(p.prunedCaption ?? p.caption ?? "").slice(0, 140),
        isVideo: String(p.mediaType ?? "").toUpperCase() === "VIDEO",
      };
    })
    .filter((p) => p.image);

  return {
    configured: true,
    username: data?.username ?? data?.profile?.username ?? null,
    posts,
    error: null,
  };
}
