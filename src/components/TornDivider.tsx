import { WAVE_D, WAVE_VIEWBOX } from "@/lib/shapes";

/**
 * Divisória entre seções.
 * variant "torn" = papel rasgado; "wave" = a onda compartilhada (WAVE_D).
 * `tone` = cor que "invade" a seção de baixo.
 */
export function TornDivider({
  position,
  tone = "paper",
  variant = "torn",
  fill: fillProp,
  stroke = "accent",
}: {
  position: "top" | "bottom";
  tone?: "paper" | "ink";
  variant?: "torn" | "wave";
  /** cor sólida da onda; sobrepõe `tone` quando informada */
  fill?: string;
  /** cor do traço da onda: dourado padrão ou degradê marrom */
  stroke?: "accent" | "brown";
}) {
  const fill = fillProp ?? (tone === "ink" ? "var(--ink)" : "var(--paper)");

  if (variant === "wave") {
    const gradId = "wave-stroke-brown";
    const strokeValue = stroke === "brown" ? `url(#${gradId})` : "var(--accent)";
    return (
      <div className={`torn torn-${position} torn-wave`} aria-hidden="true">
        <svg viewBox={WAVE_VIEWBOX} preserveAspectRatio="none" focusable="false">
          {stroke === "brown" ? (
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#5a3c1f" />
                <stop offset="0.5" stopColor="#c88f52" />
                <stop offset="1" stopColor="#5a3c1f" />
              </linearGradient>
            </defs>
          ) : null}
          <path d={`${WAVE_D} L1200,26 L0,26 Z`} fill={fill} />
          <path
            d={WAVE_D}
            fill="none"
            stroke={strokeValue}
            strokeWidth={stroke === "brown" ? "4" : "2.5"}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    );
  }

  const torn =
    "M0,44 L0,22 L28,13 L52,26 L78,9 L104,22 L128,7 L158,24 L186,12 L214,27 " +
    "L244,15 L276,5 L306,21 L338,11 L372,25 L402,9 L436,21 L470,13 L504,27 " +
    "L536,11 L572,21 L604,7 L640,23 L672,13 L708,25 L740,9 L774,21 L806,13 " +
    "L840,27 L872,11 L906,21 L938,7 L972,23 L1004,13 L1040,25 L1070,9 " +
    "L1104,21 L1134,11 L1166,23 L1200,15 L1200,44 Z";

  return (
    <div className={`torn torn-${position} torn-torn`} aria-hidden="true">
      <svg viewBox="0 0 1200 44" preserveAspectRatio="none" focusable="false">
        <path fill={fill} d={torn} />
      </svg>
    </div>
  );
}
