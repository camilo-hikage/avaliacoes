# Avaliações — Next.js + Supabase

Site com uma seção de avaliações que junta:

- **Bloco B — Google:** avaliações do local, buscadas via **Featurable** (plano gratuito, sem cartão).
  A curadoria principal (quais sincronizar) é feita no painel do Featurable; na tela `/admin`
  você ainda pode **ocultar** avaliações específicas.
- **Bloco C — Depoimentos do site:** qualquer visitante envia uma avaliação pelo formulário;
  ela fica **pendente** até você **aprovar** no painel `/admin`. Você também pode **destacar**.

> Deixe `FEATURABLE_WIDGET_ID` vazio para desativar o bloco B — o site funciona só com os
> depoimentos do próprio site.

## Stack (tudo em plano gratuito)

| Peça | Serviço |
| --- | --- |
| Framework / hospedagem | Next.js 15 (App Router) na **Vercel** |
| Banco + login do admin | **Supabase** (Postgres + Auth por magic link) |
| Avaliações do Google | **Featurable** (grátis, sem cartão) |
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

## 2. Featurable (avaliações do Google, grátis)

1. Crie uma conta em <https://featurable.com> (não pede cartão).
2. **Create widget** → selecione o local do Google (usa o Place ID do estabelecimento).
3. No painel do widget, escolha quais avaliações sincronizar.
4. Copie o **Widget ID** (aparece na URL do painel, no código de embed e no link
   `https://featurable.com/api/v2/widgets/<ID>`) → `FEATURABLE_WIDGET_ID`.

O app consome `GET https://featurable.com/api/v2/widgets/<ID>` e mostra o texto original
(`originalText`) das avaliações. Resultado fica em cache por 12 h.

## 2b. Carrossel do Instagram (Behold.so, grátis) — opcional

1. Crie uma conta em <https://behold.so> e conecte o Instagram do estabelecimento.
2. No feed criado, copie o **Feed ID** (link da API: `https://feeds.behold.so/<feedId>`).
3. Coloque em `BEHOLD_FEED_ID`. Vazio = a seção "No Instagram" fica escondida.

> As imagens vêm do CDN do Instagram e os links podem expirar depois de alguns dias.
> Se precisar de estabilidade, o plano pago do Behold serve as imagens pelo domínio deles.
> Alternativa sem serviço: uma galeria própria (upload das fotos no `/admin`).

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
    google.ts                Chamada à API do Featurable + cache de 12h
    auth.ts                  getAdminUser() — valida contra ADMIN_EMAILS
    supabase/                client (browser) · server (anon+cookies) · admin (service_role)
  middleware.ts              Renova a sessão e protege /admin
supabase/schema.sql          Tabelas + RLS
```

## Segurança — pontos-chave

- `SUPABASE_SERVICE_ROLE_KEY` e `FEATURABLE_WIDGET_ID` **só existem no servidor** (sem `NEXT_PUBLIC_`).
- Escrita nas tabelas passa por **RLS** + verificação de `ADMIN_EMAILS` nas Server Actions.
- Visitante só consegue **inserir** depoimento como `pending`; nunca aprovar nem destacar.
- Formulário tem honeypot anti-bot. Para volume maior, adicione rate limiting ou um captcha.
