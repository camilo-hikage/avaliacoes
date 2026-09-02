import { WAVE_D, WAVE_VIEWBOX } from "@/lib/shapes";

/**
 * Borda inferior do cabeçalho: a mesma onda (WAVE_D) usada na divisória
 * da seção de avaliações, preservando o traço dourado da borda.
 */
export function HeaderEdge() {
  return (
    <span className="header-edge" aria-hidden="true">
      <svg viewBox={WAVE_VIEWBOX} preserveAspectRatio="none" focusable="false">
        {/* preenchimento escuro descendo do header até a onda */}
        <path d={`${WAVE_D} L1200,0 L0,0 Z`} fill="var(--ink)" />
        {/* traço dourado acompanhando a onda */}
        <path
          d={WAVE_D}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}
