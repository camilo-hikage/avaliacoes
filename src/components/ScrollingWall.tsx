"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

function columnCount(width: number) {
  if (width < 620) return 1;
  if (width < 940) return 2;
  if (width < 1280) return 3;
  return 4;
}

export type WallCard = { key: string; node: ReactNode };

/**
 * Mural de altura limitada com scroll infinito sem emenda.
 * Distribui os cards em colunas (masonry), duplica a grade e anima
 * translateY(-50%); pausa no hover. Usado nas avaliações e no cardápio.
 */
export function ScrollingWall({
  cards,
  emptyText = "Nada por aqui ainda.",
}: {
  cards: WallCard[];
  emptyText?: string;
}) {
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

  if (cards.length === 0) {
    return <p className="muted">{emptyText}</p>;
  }

  const looping = cards.length >= cols * 2;
  const seconds = Math.max(28, cards.length * 5);

  const buckets: WallCard[][] = Array.from({ length: cols }, () => []);
  cards.forEach((c, i) => buckets[i % cols].push(c));

  const masonry = (dup: boolean) => (
    <div
      className="wall-masonry"
      aria-hidden={dup || undefined}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {buckets.map((col, ci) => (
        <div className="wall-col" key={ci}>
          {col.map((c) => (
            <div key={dup ? `${c.key}-d` : c.key}>{c.node}</div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`wall${looping ? " is-looping" : ""}`} ref={ref}>
      <div
        className="wall-track"
        style={looping ? { animationDuration: `${seconds}s` } : undefined}
      >
        {masonry(false)}
        {looping ? masonry(true) : null}
      </div>
    </div>
  );
}
