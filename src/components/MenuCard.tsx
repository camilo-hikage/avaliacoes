export function MenuCard({
  name,
  description,
  price,
  image,
  category,
}: {
  name: string;
  description: string;
  price: number | null;
  image: string;
  category?: string;
}) {
  return (
    <article className="menu-card">
      <div className="menu-card-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={name} loading="lazy" />
        {category ? <span className="menu-card-tag">{category}</span> : null}
      </div>
      <div className="menu-card-body">
        <h4>{name}</h4>
        {description ? <p>{description}</p> : null}
        {price != null ? (
          <span className="menu-price">R$ {price.toFixed(2).replace(".", ",")}</span>
        ) : null}
      </div>
    </article>
  );
}
