# Avaliações — Next.js + Supabase

Site com uma seção de avaliações que junta:

- **Bloco B — Google:** até 5 avaliações do local, buscadas ao vivo na **Places API (New)**.
  No painel você pode **ocultar** as que não quiser mostrar.
- **Bloco C — Depoimentos do site:** qualquer visitante envia uma avaliação pelo formulário;
  ela fica **pendente** até você **aprovar** no painel `/admin`. Você também pode **destacar**.

> ⚠️ Como você **não é o dono** do local no Google, a Places API só entrega 5 avaliações e
> **não permite armazenar o texto** delas. Por isso o bloco B é ao vivo (só guardamos o id das
> ocultadas). Curadoria completa só existe no bloco C.

## Stack (tudo em plano gratuito)

| Peça | Serviço |
| --- | --- |
| Framework / hospedagem | Next.js 15 (App Router) na **Vercel** |
| Banco + login do admin | **Supabase** (Postgres + Auth por magic link) |
| Avaliações do Google | **Places API (New)** do Google Cloud |
| Atualização diária do cache | **Vercel Cron** (`vercel.json`) |

---

## 1. Supabase

1. Crie um projeto em <https://supabase.com>.
2. **SQL Editor** → cole o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
3. **Project Settings → API** → copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (secreto!)
4. **Authentication → URL Configuration**:
   - `Site URL`: `http://localhost:3000` (troque pela URL da Vercel depois)
   - `Redirect URLs`: adicione
     `http://localhost:3000/auth/callback` e `https://SEU-APP.vercel.app/auth/callback`

## 2. Google Places API (New)

1. <https://console.cloud.google.com> → crie um projeto.
2. **APIs & Services → Library** → ative **Places API (New)**.
3. **APIs & Services → Credentials → Create credentials → API key**.
   - Em **API restrictions**, restrinja à *Places API (New)*.
   - Guarde em `GOOGLE_MAPS_API_KEY`.
4. Descubra o **Place ID** do local:
   <https://developers.google.com/maps/documentation/places/web-service/place-id> → `GOOGLE_PLACE_ID`.
5. Ative o faturamento no projeto Google (a Places API exige um cartão, mas há
   crédito mensal gratuito que cobre folgado ~1 requisição/dia).

## 3. Rodar localmente

```bash
cp .env.local.example .env.local     # preencha os valores
npm install
npm run dev
```

- Site: <http://localhost:3000>
- Painel: <http://localhost:3000/admin> (faça login com um email que esteja em `ADMIN_EMAILS`)

## 4. Deploy na Vercel

1. Suba esta pasta para um repositório no GitHub.
2. <https://vercel.com> → **Add New → Project** → importe o repositório.
3. **Environment Variables**: adicione todas as do `.env.local` (inclua `NEXT_PUBLIC_SITE_URL`
   com a URL final e um `CRON_SECRET` aleatório).
4. Deploy. Depois volte no Supabase e ajuste `Site URL` / `Redirect URLs` para o domínio da Vercel.

O cron em [`vercel.json`](vercel.json) chama `/api/refresh` todo dia às 06:00 UTC para renovar
o cache das avaliações do Google.

---

## Estrutura

```
src/
  app/
    page.tsx                 Home: avaliações do Google + depoimentos aprovados + formulário
    actions.ts               Server Action: enviar depoimento (entra como 'pending')
    login/page.tsx           Login por magic link (Supabase)
    auth/callback/route.ts   Troca o code do magic link por sessão
    admin/
      page.tsx               Painel: aprovar / rejeitar / destacar / ocultar
      actions.ts             Server Actions do painel (usa service_role, checa admin)
      AdminControls.tsx      Botões do painel (client)
    api/refresh/route.ts     Endpoint do cron
  components/                StarRating, ReviewCard, TestimonialForm
  lib/
    google.ts                Chamada à Places API (New) + cache de 12h
    auth.ts                  getAdminUser() — valida contra ADMIN_EMAILS
    supabase/                client (browser) · server (anon+cookies) · admin (service_role)
  middleware.ts              Renova a sessão e protege /admin
supabase/schema.sql          Tabelas + RLS
```

## Segurança — pontos-chave

- `SUPABASE_SERVICE_ROLE_KEY` e `GOOGLE_MAPS_API_KEY` **só existem no servidor** (sem `NEXT_PUBLIC_`).
- Escrita nas tabelas passa por **RLS** + verificação de `ADMIN_EMAILS` nas Server Actions.
- Visitante só consegue **inserir** depoimento como `pending`; nunca aprovar nem destacar.
- Formulário tem honeypot anti-bot. Para volume maior, adicione rate limiting ou um captcha.
