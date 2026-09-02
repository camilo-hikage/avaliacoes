"use client";

import { ReviewCard } from "./ReviewCard";

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
  if (items.length === 0) {
    return <p className="muted">Seja o primeiro a deixar uma avaliação!</p>;
  }

  // só faz o loop automático se houver cards suficientes para "encher" a altura
  const looping = items.length >= 4;
  const seconds = Math.max(28, items.length * 5);

  const grid = (dup: boolean) => (
    <div className="reviews-grid" aria-hidden={dup || undefined}>
      {items.map((it) => (
        <ReviewCard
          key={dup ? `${it.key}-dup` : it.key}
          author={it.author}
          authorPhoto={it.authorPhoto}
          rating={it.rating}
          text={it.text}
          meta={it.meta}
          badge={it.badge}
          photo={it.photo}
        />
      ))}
    </div>
  );

  return (
    <div className={`reviews-wall${looping ? " is-looping" : ""}`}>
      <div
        className="reviews-wall-track"
        style={looping ? { animationDuration: `${seconds}s` } : undefined}
      >
        {grid(false)}
        {looping ? grid(true) : null}
      </div>
    </div>
  );
}
