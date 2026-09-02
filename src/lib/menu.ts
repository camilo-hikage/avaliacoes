export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  image: string;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

export type Menu = {
  configured: boolean;
  categories: MenuCategory[];
  error: string | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

const CATEGORIES_URL =
  "https://integracao.cardapioweb.com/api/menu/company/categories?only_available_for=view_only&origin=catalogo";

const clean = (v: any): string => (typeof v === "string" ? v.trim() : "");
const asPrice = (v: any): number | null =>
  typeof v === "number" && v > 0 ? v : null;

/**
 * Cardápio do CardápioWeb (https://app.cardapioweb.com/<slug>).
 * A empresa é identificada pelo header `company: <slug>`.
 * Retorna só os itens (e subitens) que têm foto, agrupados por categoria.
 * Deixe CARDAPIOWEB_SLUG vazio para esconder a seção.
 */
export async function fetchMenu(): Promise<Menu> {
  const slug = process.env.CARDAPIOWEB_SLUG;
  if (!slug) return { configured: false, categories: [], error: null };

  let res: Response;
  try {
    res = await fetch(CATEGORIES_URL, {
      headers: { company: slug, Accept: "application/json" },
      next: { revalidate: 3600, tags: ["menu"] },
    });
  } catch {
    return { configured: true, categories: [], error: "Falha de rede ao contatar o CardápioWeb." };
  }
  if (!res.ok) {
    return { configured: true, categories: [], error: `CardápioWeb respondeu ${res.status}.` };
  }

  const raw = (await res.json()) as any;
  const rawCats: any[] = Array.isArray(raw) ? raw : Array.isArray(raw?.categories) ? raw.categories : [];

  const categories: MenuCategory[] = rawCats
    .map((c) => {
      const items: MenuItem[] = [];

      for (const it of c.items ?? []) {
        if (it.status && it.status !== "ACTIVE") continue;

        const img = clean(it.image_url) || clean(it.thumbnail_url);
        if (img) {
          const addonMin = (it.add_ons ?? [])
            .map((a: any) => asPrice(a.minimum_price))
            .filter((n: number | null): n is number => n != null);
          items.push({
            id: `i${it.id}`,
            name: clean(it.name),
            description: clean(it.description),
            price: asPrice(it.price) ?? (addonMin.length ? Math.min(...addonMin) : null),
            image: img,
          });
        }

        // muitos pratos ficam como subitens dentro de add_ons
        for (const a of it.add_ons ?? []) {
          for (const s of a.subitems ?? []) {
            if (s.status && s.status !== "ACTIVE") continue;
            const sImg = clean(s.image_url) || clean(s.thumbnail_url);
            if (sImg) {
              items.push({
                id: `s${s.id}`,
                name: clean(s.name),
                description: clean(s.description),
                price: asPrice(s.price),
                image: sImg,
              });
            }
          }
        }
      }

      // remove duplicados por imagem
      const seen = new Set<string>();
      const unique = items.filter((i) => (seen.has(i.image) ? false : seen.add(i.image)));

      return { name: clean(c.name), items: unique };
    })
    .filter((c) => c.items.length > 0);

  return { configured: true, categories, error: null };
}
