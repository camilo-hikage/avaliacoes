"use client";

import { Modal } from "./Modal";
import { InstagramCarousel } from "./InstagramCarousel";
import type { InstagramPost } from "@/lib/instagram";

const IG_PATH =
  "M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.9 4.9 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122s-.013 3.056-.06 4.122c-.05 1.065-.218 1.79-.465 2.428a4.9 4.9 0 0 1-1.153 1.772 4.9 4.9 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06s-3.056-.013-4.122-.06c-1.065-.05-1.79-.218-2.428-.465a4.9 4.9 0 0 1-1.772-1.153 4.9 4.9 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12s.01-3.056.06-4.122c.05-1.066.217-1.79.465-2.428a4.9 4.9 0 0 1 1.153-1.772A4.9 4.9 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.8c-2.67 0-2.987.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.054-.058 1.37-.058 4.041 0 2.67.01 2.986.058 4.04.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.858.344 1.053.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.399 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.858.048-1.053.058-1.37.058-4.04 0-2.67-.01-2.987-.058-4.04-.045-.976-.207-1.505-.344-1.858a3.1 3.1 0 0 0-.748-1.15 3.1 3.1 0 0 0-1.15-.748c-.353-.137-.882-.3-1.858-.344-1.053-.048-1.37-.058-4.04-.058zm0 3.064a5.136 5.136 0 1 1 0 10.272 5.136 5.136 0 0 1 0-10.272zm0 8.47a3.334 3.334 0 1 0 0-6.668 3.334 3.334 0 0 0 0 6.668zm6.538-8.673a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z";

export function InstagramModal({
  url,
  username,
  posts,
}: {
  url: string;
  username: string;
  posts: InstagramPost[];
}) {
  return (
    <Modal
      title={`Instagram · @${username}`}
      headerAction={
        <a className="site-modal-open" href={url} target="_blank" rel="noreferrer">
          <span>abrir perfil </span>↗
        </a>
      }
      trigger={(open) => (
        <button
          type="button"
          className="footer-social"
          onClick={open}
          aria-label={`Instagram @${username}`}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
            <path fill="currentColor" d={IG_PATH} />
          </svg>
          <span>@{username}</span>
        </button>
      )}
    >
      <div className="insta-modal-body">
        {posts.length > 0 ? (
          <InstagramCarousel posts={posts} />
        ) : (
          <p className="muted">
            Siga o Tio no Instagram pra ver os pratos do dia, a música ao vivo e as novidades.
          </p>
        )}
        <a className="btn" href={url} target="_blank" rel="noreferrer">
          Abrir no Instagram
        </a>
      </div>
    </Modal>
  );
}
