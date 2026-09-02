"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Casca de modal reutilizável: backdrop translúcido, painel com barra e ✕,
 * fecha no Esc / clique fora, trava o scroll e abre abaixo da altura real
 * do header (o topo do site continua visível).
 */
export function Modal({
  title,
  trigger,
  headerAction,
  children,
}: {
  title: string;
  trigger: (open: () => void) => ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [topOffset, setTopOffset] = useState(96);

  useEffect(() => {
    if (!open) return;

    const measure = () => {
      const header = document.querySelector<HTMLElement>(".site-header");
      const badge = document.querySelector<HTMLElement>(".brand-badge");
      const hb = header?.getBoundingClientRect().bottom ?? 72;
      const bb = badge?.getBoundingClientRect().bottom ?? hb;
      setTopOffset(Math.max(hb, bb) + 12);
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
      {trigger(() => setOpen(true))}

      {open ? (
        <div
          className="site-modal"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          style={{ paddingTop: topOffset }}
          onClick={() => setOpen(false)}
        >
          <div className="site-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="site-modal-bar">
              <span className="site-modal-title">{title}</span>
              {headerAction}
              <button
                type="button"
                className="site-modal-close"
                aria-label="Fechar"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}
