"use client";

import { useState } from "react";

/** Botão de compartilhar (só aparece no mobile, canto superior direito). */
export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}/`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Tio Bar e Restaurante",
          text: "Tio Bar e Restaurante — comida gostosa com preço justo",
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* usuário cancelou o compartilhamento — nada a fazer */
    }
  }

  return (
    <button
      type="button"
      className="share-btn"
      onClick={share}
      aria-label="Compartilhar este site"
    >
      {copied ? (
        <span className="share-btn-copied">copiado</span>
      ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81a3 3 0 1 0-3-3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9a3 3 0 0 0 0 6c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65a2.92 2.92 0 1 0 2.92-2.92Z"
          />
        </svg>
      )}
    </button>
  );
}
