"use client";

import { Modal } from "./Modal";

export function MenuModal({
  url,
  label = "Ver cardápio completo",
}: {
  url: string;
  label?: string;
}) {
  return (
    <Modal
      title="Cardápio completo"
      headerAction={
        <a className="site-modal-open" href={url} target="_blank" rel="noreferrer">
          <span>abrir em nova aba </span>↗
        </a>
      }
      trigger={(open) => (
        <button type="button" className="btn" onClick={open}>
          {label}
        </button>
      )}
    >
      <iframe src={url} title="Cardápio completo — Tio Bar e Restaurante" loading="lazy" />
    </Modal>
  );
}
