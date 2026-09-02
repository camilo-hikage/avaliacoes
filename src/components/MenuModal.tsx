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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
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
          onClick={() => setOpen(false)}
        >
          <div className="menu-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="menu-modal-bar">
              <span>Cardápio completo</span>
              <div>
                <a href={url} target="_blank" rel="noreferrer">
                  abrir em nova aba ↗
                </a>
                <button type="button" aria-label="Fechar" onClick={() => setOpen(false)}>
                  ✕
                </button>
              </div>
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
