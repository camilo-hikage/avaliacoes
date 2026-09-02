import { ReviewCard } from "./ReviewCard";
import { ScrollingWall, type WallCard } from "./ScrollingWall";

export type WallItem = {
  key: string;
  author: string;
  authorPhoto?: string | null;
  rating: number;
  text: string;
  meta?: string;
  badge?: string;
};

export function ReviewsWall({ items }: { items: WallItem[] }) {
  const cards: WallCard[] = items.map((it) => ({
    key: it.key,
    node: (
      <ReviewCard
        author={it.author}
        authorPhoto={it.authorPhoto}
        rating={it.rating}
        text={it.text}
        meta={it.meta}
        badge={it.badge}
      />
    ),
  }));

  return <ScrollingWall cards={cards} emptyText="Nenhuma avaliação para exibir." />;
}
