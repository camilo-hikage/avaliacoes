"use client";

import { useEffect, useState } from "react";

export function MenuModal({
  url,
  label = "Ver cardápio completo",
}: {
  url: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [topOffset, setTopOffset] = useState(96);

  useEffect(() => {
    if (!open) return;

    const measure = () => {
      const header = document.querySelector<HTMLElement>(".site-header");
      const badge = document.querySelector<HTMLElement>(".brand-badge");
      const headerBottom = header?.getBoundingClientRect().bottom ?? 72;
      const badgeBottom = badge?.getBoundingClientRect().bottom ?? headerBottom;
      setTopOffset(Math.max(headerBottom, badgeBottom) + 12);
    };
    measure();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", measure);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", measure);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button type="button" className="btn" onClick={() => setOpen(true)}>
        {label}
      </button>

      {open ? (
        <div
          className="menu-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Cardápio completo"
          style={{ paddingTop: topOffset }}
          onClick={() => setOpen(false)}
        >
          <div className="menu-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="menu-modal-bar">
              <span className="menu-modal-title">Cardápio completo</span>
              <a className="menu-modal-open" href={url} target="_blank" rel="noreferrer">
                <span>abrir em nova aba </span>↗
              </a>
              <button
                type="button"
                className="menu-modal-close"
                aria-label="Fechar"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            <iframe
              src={url}
              title="Cardápio completo — Tio Bar e Restaurante"
              loading="lazy"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
