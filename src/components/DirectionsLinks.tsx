/** Endereço do restaurante — usado para gerar as rotas do Maps e do Waze. */
export const ADDRESS =
  "Av. Professor Celestino Bourroul, 1068 - Limão, São Paulo, 02710-001";

const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  ADDRESS,
)}`;
const WAZE_URL = `https://www.waze.com/ul?q=${encodeURIComponent(ADDRESS)}&navigate=yes`;

/**
 * Dois botões com ícone: abrir rota até o endereço no Google Maps ou no Waze.
 * `tone="quiet"` deixa o traço discreto (para o rodapé escuro).
 */
export function DirectionsLinks({ tone = "gold" }: { tone?: "gold" | "quiet" }) {
  return (
    <div className={`directions${tone === "quiet" ? " directions-quiet" : ""}`}>
      <a href={MAPS_URL} target="_blank" rel="noreferrer" aria-label="Traçar rota no Google Maps">
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2a7 7 0 0 0-7 7c0 4.5 5.4 11.2 6.5 12.5.26.31.74.31 1 0C13.6 20.2 19 13.5 19 9a7 7 0 0 0-7-7Zm0 4.6A2.4 2.4 0 1 0 12 11.4 2.4 2.4 0 0 0 12 6.6Z"
          />
        </svg>
        <span>Maps</span>
      </a>
      <a href={WAZE_URL} target="_blank" rel="noreferrer" aria-label="Traçar rota no Waze">
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 3.75c4.28 0 7.75 2.93 7.75 6.9 0 1.98-.9 3.66-1.85 4.74.28.98-.05 2.05-.94 2.74-.98.76-2.35.68-3.28-.12-.53.12-1.08.18-1.65.18-3.6 0-6.62-2.27-7.5-5.35a1.65 1.65 0 1 1 .28-3.15 3.6 3.6 0 0 1-.01-.29c0-3.97 2.92-6.65 7.2-6.65Zm-2.6 6.1a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Zm5.2 0a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Z"
          />
        </svg>
        <span>Waze</span>
      </a>
    </div>
  );
}
