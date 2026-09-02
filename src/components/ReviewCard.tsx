import { StarRating } from "./StarRating";
import { Avatar } from "./Avatar";

export function ReviewCard({
  author,
  authorPhoto,
  rating,
  text,
  meta,
  badge,
}: {
  author: string;
  authorPhoto?: string | null;
  rating: number;
  text: string;
  meta?: string;
  badge?: string;
}) {
  return (
    <article className="card">
      <div className="card-head">
        <div className="card-author">
          <Avatar name={author} src={authorPhoto} />
          <strong>{author}</strong>
        </div>
        {badge ? <span className="badge">{badge}</span> : null}
      </div>
      <StarRating value={rating} />
      <p>{text}</p>
      {meta ? <small>{meta}</small> : null}
    </article>
  );
}
