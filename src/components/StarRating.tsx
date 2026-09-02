export function StarRating({ value }: { value: number }) {
  const full = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span className="stars" aria-label={`${full} de 5 estrelas`} role="img">
      {"★".repeat(full)}
      <span className="stars-empty">{"★".repeat(5 - full)}</span>
    </span>
  );
}
