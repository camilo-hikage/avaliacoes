import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchGoogleReviews } from "@/lib/google";
import { getAdminUser } from "@/lib/auth";
import { StarRating } from "@/components/StarRating";
import { AdminControls } from "./AdminControls";

export const dynamic = "force-dynamic";

type Testimonial = {
  id: string;
  author: string;
  rating: number;
  text: string;
  photo_url: string | null;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  created_at: string;
};

export default async function AdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/login?next=/admin");

  const admin = createAdminClient();

  const [testimonialsRes, hiddenRes, google] = await Promise.all([
    admin.from("testimonials").select("*").order("created_at", { ascending: false }),
    admin.from("hidden_google_reviews").select("review_id"),
    fetchGoogleReviews(),
  ]);

  const all = (testimonialsRes.data ?? []) as Testimonial[];
  const pending = all.filter((t) => t.status === "pending");
  const reviewed = all.filter((t) => t.status !== "pending");
  const hidden = new Set((hiddenRes.data ?? []).map((h) => h.review_id));

  return (
    <main className="wrap">
      <h1>Painel de avaliações</h1>
      <p className="muted">Logado como {user.email}</p>

      <section>
        <h2>Pendentes ({pending.length})</h2>
        {pending.length === 0 ? <p className="muted">Nada pendente 🎉</p> : null}
        {pending.map((t) => (
          <article key={t.id} className="row">
            <div>
              <strong>{t.author}</strong> <StarRating value={t.rating} />
              <p>{t.text}</p>
              {t.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="review-photo" src={t.photo_url} alt="Foto enviada" loading="lazy" />
              ) : null}
              <small>{new Date(t.created_at).toLocaleString("pt-BR")}</small>
            </div>
            <AdminControls kind="testimonial" id={t.id} status={t.status} featured={t.featured} />
          </article>
        ))}
      </section>

      <section>
        <h2>Já revisados ({reviewed.length})</h2>
        {reviewed.map((t) => (
          <article key={t.id} className="row">
            <div>
              <strong>{t.author}</strong> <StarRating value={t.rating} />
              <span className={`tag tag-${t.status}`}>{t.status}</span>
              {t.featured ? <span className="tag">destaque</span> : null}
              <p>{t.text}</p>
              {t.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="review-photo" src={t.photo_url} alt="Foto enviada" loading="lazy" />
              ) : null}
            </div>
            <AdminControls kind="testimonial" id={t.id} status={t.status} featured={t.featured} />
          </article>
        ))}
      </section>

      <section>
        <h2>Avaliações do Google</h2>
        {!google.configured ? (
          <p className="muted">
            Bloco do Google desativado. Defina <code>FEATURABLE_WIDGET_ID</code> no ambiente para
            ativá-lo.
          </p>
        ) : (
          <p className="muted">
            Vêm do Featurable. A curadoria principal é no painel do Featurable; aqui você pode{" "}
            <em>ocultar</em> avaliações específicas da home.
          </p>
        )}
        {google.error ? <p className="err">{google.error}</p> : null}
        {google.reviews.map((r) => (
          <article key={r.id} className="row">
            <div>
              <strong>{r.author}</strong> <StarRating value={r.rating} />
              {hidden.has(r.id) ? <span className="tag">oculta</span> : null}
              <p>{r.text}</p>
              <small>{r.relativeTime}</small>
            </div>
            <AdminControls kind="google" id={r.id} hidden={hidden.has(r.id)} />
          </article>
        ))}
      </section>
    </main>
  );
}
