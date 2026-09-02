import { StarRating } from "./StarRating";

export function ReviewCard({
  author,
  rating,
  text,
  meta,
  badge,
}: {
  author: string;
  rating: number;
  text: string;
  meta?: string;
  badge?: string;
}) {
  return (
    <article className="card">
      <div className="card-head">
        <strong>{author}</strong>
        {badge ? <span className="badge">{badge}</span> : null}
      </div>
      <StarRating value={rating} />
      <p>{text}</p>
      {meta ? <small>{meta}</small> : null}
    </article>
  );
}
