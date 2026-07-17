-- ============================================================
-- SCHEMA COMPLETO SUPABASE — LOJA NÚCLEO
-- Rode este script inteiro em: Supabase > SQL Editor > New query
--
-- Já rodou uma versão anterior deste schema? Rode só este bloco de migração
-- abaixo (é seguro rodar mesmo que algumas colunas não existam ainda),
-- depois pode ignorar o resto do arquivo:
--
--   alter table orders drop constraint if exists orders_status_check;
--   alter table orders drop constraint if exists orders_payment_method_check;
--   alter table orders add column if not exists customer_phone text not null default '';
--   do $$
--   begin
--     if exists (select 1 from information_schema.columns
--                where table_name = 'orders' and column_name = 'payment_method') then
--       execute 'alter table orders alter column payment_method drop not null';
--     end if;
--   end $$;
--   alter table orders add constraint orders_status_check
--     check (status in ('pendente', 'confirmado', 'enviado', 'concluido', 'cancelado'));
-- ============================================================

-- Extensão para gerar UUIDs
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- TABELA: products
-- ------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  compare_at_price_cents integer,
  image_url text,
  category text,
  stock integer not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_slug on products (slug);
create index if not exists idx_products_category on products (category);

-- ------------------------------------------------------------
-- TABELA: orders (pedidos)
-- ------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  total_cents integer not null check (total_cents >= 0),
  status text not null default 'pendente'
    check (status in ('pendente', 'confirmado', 'enviado', 'concluido', 'cancelado')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- TABELA: order_items (itens de cada pedido)
-- ------------------------------------------------------------
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on order_items (order_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- PRODUCTS: qualquer visitante (anon) pode LER os produtos
drop policy if exists "Produtos são públicos para leitura" on products;
create policy "Produtos são públicos para leitura"
  on products for select
  to anon, authenticated
  using (true);

-- PRODUCTS: apenas usuários autenticados (ex: painel admin) podem inserir/editar/apagar
drop policy if exists "Apenas autenticados podem inserir produtos" on products;
create policy "Apenas autenticados podem inserir produtos"
  on products for insert
  to authenticated
  with check (true);

drop policy if exists "Apenas autenticados podem editar produtos" on products;
create policy "Apenas autenticados podem editar produtos"
  on products for update
  to authenticated
  using (true);

drop policy if exists "Apenas autenticados podem apagar produtos" on products;
create policy "Apenas autenticados podem apagar produtos"
  on products for delete
  to authenticated
  using (true);

-- ORDERS: qualquer visitante pode CRIAR um pedido (checkout público)
drop policy if exists "Qualquer um pode criar pedido" on orders;
create policy "Qualquer um pode criar pedido"
  on orders for insert
  to anon, authenticated
  with check (true);

-- ORDERS: apenas autenticados (admin) podem ler/gerenciar pedidos
drop policy if exists "Apenas autenticados podem ler pedidos" on orders;
create policy "Apenas autenticados podem ler pedidos"
  on orders for select
  to authenticated
  using (true);

drop policy if exists "Apenas autenticados podem atualizar pedidos" on orders;
create policy "Apenas autenticados podem atualizar pedidos"
  on orders for update
  to authenticated
  using (true);

-- ORDER_ITEMS: qualquer visitante pode CRIAR itens de pedido (checkout público)
drop policy if exists "Qualquer um pode criar itens de pedido" on order_items;
create policy "Qualquer um pode criar itens de pedido"
  on order_items for insert
  to anon, authenticated
  with check (true);

-- ORDER_ITEMS: apenas autenticados (admin) podem ler
drop policy if exists "Apenas autenticados podem ler itens de pedido" on order_items;
create policy "Apenas autenticados podem ler itens de pedido"
  on order_items for select
  to authenticated
  using (true);

-- ============================================================
-- BUCKET DE IMAGENS (Storage)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Imagens de produto são públicas" on storage.objects;
create policy "Imagens de produto são públicas"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Autenticados podem enviar imagens" on storage.objects;
create policy "Autenticados podem enviar imagens"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

-- ============================================================
-- DADOS DE EXEMPLO (seed) — pode apagar/editar como quiser
-- ============================================================
insert into products (slug, name, description, price_cents, compare_at_price_cents, image_url, category, stock, featured)
values
  (
    'moletom-canelado-grafite',
    'Moletom canelado grafite',
    'Moletom de algodão pesado, gola careca reforçada, corte reto. Peça atemporal do catálogo.',
    24900,
    29900,
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
    'Vestuário',
    18,
    true
  ),
  (
    'caneca-ceramica-fosca',
    'Caneca de cerâmica fosca',
    'Caneca 300ml em cerâmica fosca, alça reforçada, vai ao micro-ondas e lava-louças.',
    5900,
    null,
    'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
    'Casa',
    42,
    true
  ),
  (
    'caderno-pontilhado-a5',
    'Caderno pontilhado A5',
    'Capa dura, 160 páginas em papel 100g, marcador de página costurado.',
    7900,
    9900,
    'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800',
    'Papelaria',
    30,
    false
  ),
  (
    'bone-aba-curva-preto',
    'Boné aba curva preto',
    'Boné em sarja com fecho de metal ajustável, bordado tonal discreto.',
    9900,
    null,
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
    'Acessórios',
    0,
    true
  ),
  (
    'garrafa-termica-inox',
    'Garrafa térmica inox 500ml',
    'Parede dupla a vácuo, mantém temperatura por até 12h, tampa rosqueável.',
    12900,
    15900,
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
    'Casa',
    25,
    true
  ),
  (
    'camiseta-basica-off-white',
    'Camiseta básica off-white',
    'Malha 100% algodão penteado, modelagem reta, gola careca.',
    8900,
    null,
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    'Vestuário',
    50,
    false
  )
on conflict (slug) do nothing;
