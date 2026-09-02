import { MenuCard } from "./MenuCard";
import { ScrollingWall, type WallCard } from "./ScrollingWall";
import type { Menu } from "@/lib/menu";

export function MenuWall({ menu }: { menu: Menu }) {
  const cards: WallCard[] = menu.categories.flatMap((cat) =>
    cat.items.map((it) => ({
      key: it.id,
      node: (
        <MenuCard
          name={it.name}
          description={it.description}
          price={it.price}
          image={it.image}
          category={cat.name}
        />
      ),
    })),
  );

  return <ScrollingWall cards={cards} emptyText="Cardápio indisponível no momento." />;
}
