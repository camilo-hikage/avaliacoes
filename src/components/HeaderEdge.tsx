/**
 * Borda inferior do cabeçalho recortada em ondas arredondadas,
 * ecoando o contorno do chapéu de chef do logotipo.
 */
export function HeaderEdge() {
  const bumps = 26;
  const bump = "q24,26 48,0 ";
  const scallop = "M0,3 " + bump.repeat(bumps);
  const filled = `${scallop}L${48 * bumps},28 L0,28 Z`;

  return (
    <span className="header-edge" aria-hidden="true">
      <svg
        viewBox={`0 0 ${48 * bumps} 28`}
        preserveAspectRatio="none"
        focusable="false"
      >
        <path d={filled} fill="var(--ink)" />
        <path
          d={scallop}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}
