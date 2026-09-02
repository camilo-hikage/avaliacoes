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
  photo?: string | null;
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
        photo={it.photo}
      />
    ),
  }));

  return <ScrollingWall cards={cards} emptyText="Seja o primeiro a deixar uma avaliação!" />;
}
