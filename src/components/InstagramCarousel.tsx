"use client";

import { useRef } from "react";
import type { InstagramPost } from "@/lib/instagram";

export function InstagramCarousel({ posts }: { posts: InstagramPost[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="insta-carousel">
      <button
        type="button"
        className="insta-nav insta-prev"
        onClick={() => scroll(-1)}
        aria-label="Ver anteriores"
      >
        ‹
      </button>

      <div className="insta-track" ref={trackRef}>
        {posts.map((p) => (
          <a
            key={p.id}
            className="insta-item"
            href={p.permalink}
            target="_blank"
            rel="noreferrer"
            title={p.caption || "Ver no Instagram"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.caption || "Post do Instagram"} loading="lazy" />
            {p.isVideo ? (
              <span className="insta-video" aria-hidden="true">
                ▶
              </span>
            ) : null}
          </a>
        ))}
      </div>

      <button
        type="button"
        className="insta-nav insta-next"
        onClick={() => scroll(1)}
        aria-label="Ver próximos"
      >
        ›
      </button>
    </div>
  );
}
