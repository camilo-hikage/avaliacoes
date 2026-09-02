"use client";

import { useEffect, useRef, useState } from "react";
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

function columnCount(width: number) {
  if (width < 620) return 1;
  if (width < 940) return 2;
  if (width < 1280) return 3;
  return 4;
}

export function ReviewsWall({ items }: { items: WallItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setCols(columnCount(el.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (items.length === 0) {
    return <p className="muted">Seja o primeiro a deixar uma avaliação!</p>;
  }

  const looping = items.length >= cols * 2;
  const seconds = Math.max(28, items.length * 5);

  // distribui os cards em colunas (round-robin) — cada card mantém a própria altura
  const buckets: WallItem[][] = Array.from({ length: cols }, () => []);
  items.forEach((it, i) => buckets[i % cols].push(it));

  const masonry = (dup: boolean) => (
    <div
      className="reviews-masonry"
      aria-hidden={dup || undefined}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {buckets.map((col, ci) => (
        <div className="rev-col" key={ci}>
          {col.map((it) => (
            <ReviewCard
              key={dup ? `${it.key}-d` : it.key}
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
      ))}
    </div>
  );

  return (
    <div className={`reviews-wall${looping ? " is-looping" : ""}`} ref={ref}>
      <div
        className="reviews-wall-track"
        style={looping ? { animationDuration: `${seconds}s` } : undefined}
      >
        {masonry(false)}
        {looping ? masonry(true) : null}
      </div>
    </div>
  );
}
