import { StarRating } from "./StarRating";
import { Avatar } from "./Avatar";

export function ReviewCard({
  author,
  authorPhoto,
  rating,
  text,
  meta,
  badge,
  photo,
}: {
  author: string;
  authorPhoto?: string | null;
  rating: number;
  text: string;
  meta?: string;
  badge?: string;
  photo?: string | null;
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
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="review-photo" src={photo} alt={`Foto enviada por ${author}`} loading="lazy" />
      ) : null}
      {meta ? <small>{meta}</small> : null}
    </article>
  );
}
