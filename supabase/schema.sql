-- =====================================================================
--  Schema do projeto de avaliações  (rode no Supabase -> SQL Editor)
-- =====================================================================

-- ---------------------------------------------------------------------
--  Bloco C: depoimentos enviados pelos visitantes no próprio site
-- ---------------------------------------------------------------------
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  author      text        not null check (char_length(author) between 2 and 80),
  rating      int         not null check (rating between 1 and 5),
  text        text        not null check (char_length(text) between 10 and 2000),
  photo_url   text,
  status      text        not null default 'pending'
                          check (status in ('pending', 'approved', 'rejected')),
  featured    boolean     not null default false,
  created_at  timestamptz not null default now()
);

-- para bancos que já tinham a tabela sem a coluna de foto
alter table public.testimonials add column if not exists photo_url text;

alter table public.testimonials enable row level security;

-- Visitante (anon) pode ENVIAR, mas só como 'pending' e sem destaque
drop policy if exists "anon envia pendente" on public.testimonials;
create policy "anon envia pendente"
  on public.testimonials
  for insert
  to anon, authenticated
  with check (status = 'pending' and featured = false);

-- Público só LÊ os aprovados
drop policy if exists "publico le aprovados" on public.testimonials;
create policy "publico le aprovados"
  on public.testimonials
  for select
  to anon, authenticated
  using (status = 'approved');

-- (updates/deletes ficam só para a service_role, usada no servidor pelo /admin)

-- ---------------------------------------------------------------------
--  Bloco B: quais avaliações do Google o admin escolheu OCULTAR.
--  Guardamos apenas o id da review (opaco), nunca o texto — os Termos
--  da Places API não permitem armazenar o conteúdo.
-- ---------------------------------------------------------------------
create table if not exists public.hidden_google_reviews (
  review_id  text        primary key,
  hidden_at  timestamptz not null default now()
);

alter table public.hidden_google_reviews enable row level security;

-- Lista de ids ocultos é inofensiva: liberar leitura para a home
drop policy if exists "publico le ocultos" on public.hidden_google_reviews;
create policy "publico le ocultos"
  on public.hidden_google_reviews
  for select
  to anon, authenticated
  using (true);

-- inserts/deletes só via service_role (servidor)

-- índice auxiliar
create index if not exists testimonials_status_idx on public.testimonials (status, featured, created_at desc);

-- ---------------------------------------------------------------------
--  Storage: fotos anexadas aos depoimentos do site.
--  Bucket público (leitura livre); o upload é feito pelo servidor com a
--  service role (rota /api/testimonial), com limite de tamanho/mime.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'testimonials',
  'testimonials',
  true,
  5242880,                                   -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
