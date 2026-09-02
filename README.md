# Tio Bar e Restaurante — site

Site institucional em **Next.js 15 (App Router)**, sem backend próprio. Todo o conteúdo
vem de serviços externos gratuitos e o site é estático (ISR de 1 h).

## Seções

| Seção | Fonte | Env |
| --- | --- | --- |
| **Cardápio** | API do CardápioWeb (`app.cardapioweb.com/<slug>`), só itens com foto | `CARDAPIOWEB_SLUG` |
| **Avaliações do Google** | [Featurable](https://featurable.com) (grátis, sem cartão) | `FEATURABLE_WIDGET_ID` |
| **Instagram** (opcional) | [Behold.so](https://behold.so) | `BEHOLD_FEED_ID` |
| **Mapa** | embed público do Google Maps (sem chave) | `NEXT_PUBLIC_MAPS_*` |

Cada env vazia esconde a seção correspondente.

## Rodar localmente

```bash
cp .env.local.example .env.local     # preencha os valores
npm install
npm run dev
```

Site em <http://localhost:3000>.

## Configurar as fontes

- **Featurable:** conta em <https://featurable.com> → *Create widget* → escolha o local do Google
  → curadoria das avaliações no painel deles → copie o **Widget ID** (link da API
  `https://featurable.com/api/v2/widgets/<ID>`) para `FEATURABLE_WIDGET_ID`.
- **CardápioWeb:** `CARDAPIOWEB_SLUG` = o que vem depois de `app.cardapioweb.com/`.
  O app chama `integracao.cardapioweb.com/api/menu/company/categories` com o header `company: <slug>`.
- **Behold (Instagram):** conta em <https://behold.so> → conecte o Instagram → copie o **Feed ID**.
  As imagens vêm do CDN do Instagram e podem expirar em alguns dias no plano free.
- **Mapa:** no Google Maps, *Compartilhar → Incorporar um mapa*, copie só o `src="..."` para
  `NEXT_PUBLIC_MAPS_EMBED_URL`. Sem isso, ele busca por `NEXT_PUBLIC_MAPS_QUERY`.

## Deploy na Vercel

1. Importe o repositório em <https://vercel.com>.
2. **Environment Variables:** adicione as do `.env.local` (todas começam sem `NEXT_PUBLIC_`
   exceto as do mapa e `NEXT_PUBLIC_SITE_URL`).
3. Deploy. O cron em [`vercel.json`](vercel.json) chama `/api/refresh` 1×/dia para renovar
   o cache das fontes.

## Estrutura

```
src/
  app/
    page.tsx                 Home: cardápio + hero + avaliações + CTA + mapa
    layout.tsx               Header (logo), footer (Instagram), fontes
    api/refresh/route.ts     Endpoint do cron (revalida os caches)
    globals.css              Todo o estilo (paleta papel/tinta/dourado)
  components/
    ScrollingWall.tsx        Mural com scroll infinito (avaliações e cardápio)
    ReviewsWall / ReviewCard Avaliações do Google
    MenuWall / MenuCard      Cardápio
    InstagramCarousel        Carrossel do Instagram
    TornDivider / HeaderEdge Ondas e recortes entre seções
  lib/
    google.ts    menu.ts    instagram.ts    shapes.ts
```
