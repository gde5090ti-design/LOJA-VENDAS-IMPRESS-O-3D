# Núcleo — loja online (Next.js + Supabase)

Site de vendas completo, já estilizado, com catálogo de produtos, página de
produto, carrinho e checkout gravando pedidos no Supabase. Pronto para subir
no GitHub e publicar na Vercel.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** para estilo
- **Supabase** (Postgres + Storage) para produtos e pedidos
- Carrinho em `localStorage` via React Context (nenhum backend próprio necessário)

## 1. Criar o projeto no Supabase

1. Crie uma conta em [supabase.com](https://supabase.com) e crie um novo projeto.
2. No painel do projeto, abra **SQL Editor > New query**.
3. Cole todo o conteúdo do arquivo [`supabase/schema.sql`](./supabase/schema.sql) e clique em **Run**.
   Isso cria as tabelas `products`, `orders`, `order_items`, as políticas de
   segurança (RLS), o bucket de imagens `product-images` e 6 produtos de exemplo.
4. Vá em **Project Settings > API** e copie:
   - `Project URL` → vai virar `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → vai virar `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Cadastrando produtos de verdade

Depois do seed, use o **Table Editor** do Supabase (tabela `products`) para
editar/apagar os produtos de exemplo e cadastrar os seus. Campos:

| Campo | Tipo | Observação |
|---|---|---|
| `slug` | texto único | usado na URL `/produto/slug` |
| `name` | texto | nome do produto |
| `description` | texto | descrição livre |
| `price_cents` | inteiro | preço em centavos (ex: R$49,90 = 4990) |
| `compare_at_price_cents` | inteiro (opcional) | preço "de", riscado na vitrine |
| `image_url` | texto | link direto de imagem (pode subir no bucket `product-images` do Storage e colar a URL pública) |
| `category` | texto | categoria exibida no card |
| `stock` | inteiro | estoque; 0 = "Esgotado" |
| `featured` | booleano | destaque (uso futuro) |

## 2. Rodar localmente

```bash
npm install
cp .env.local.example .env.local
# edite .env.local com a URL e a chave anon do seu projeto Supabase
npm run dev
```

Abra http://localhost:3000

## 3. Subir para o GitHub

```bash
git init
git add .
git commit -m "Loja Núcleo: primeira versão"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

> Não faça commit do arquivo `.env.local` — ele já está no `.gitignore`.

## 4. Publicar na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório do GitHub.
2. A Vercel detecta automaticamente que é um projeto Next.js.
3. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique em **Deploy**. Pronto — o site fica no ar em `https://seu-projeto.vercel.app`.

## Sobre pagamentos

O pagamento é feito **pessoalmente**, na entrega ou retirada — não existe
cobrança online neste projeto. O checkout só reserva o pedido: pede nome,
e-mail, **telefone** e endereço, grava tudo nas tabelas `orders` +
`order_items` do Supabase, e mostra uma tela de agradecimento avisando que a
loja entrará em contato pelo telefone informado caso haja algum problema com
o pedido.

Se no futuro você quiser aceitar pagamento online (Pix, cartão, etc.), dá para
adicionar isso mais tarde integrando um gateway como Mercado Pago ou Stripe no
formulário de `app/checkout/page.tsx`.

## Email automático de confirmação

Depois que o pedido é gravado no Supabase, o site tenta enviar um email de
confirmação para o cliente através do [Resend](https://resend.com) (um
serviço de envio de email transacional, com plano grátis de 3.000 emails/mês).
Se as chaves não estiverem configuradas, o pedido continua funcionando
normalmente — só não envia o email.

### Como configurar

1. Crie uma conta grátis em [resend.com](https://resend.com)
2. Em **Domains**, adicione e verifique um domínio seu (ex: `seudominio.com`).
   Sem isso, o Resend só permite enviar emails de teste para o seu próprio
   endereço, não para clientes de verdade.
3. Em **API Keys**, crie uma nova chave e copie o valor (começa com `re_`)
4. No `.env.local` (e nas variáveis de ambiente da Vercel), adicione:

```
RESEND_API_KEY=re_SUACHAVE
RESEND_FROM_EMAIL=Núcleo <pedidos@seudominio.com>
```

⚠️ Essas duas variáveis **não** devem começar com `NEXT_PUBLIC_` — elas ficam
só no servidor (na rota `app/api/enviar-confirmacao`), nunca expostas no
navegador do cliente.

Se você ainda não tem um domínio próprio, pode deixar essas variáveis vazias
por enquanto — o site funciona normalmente, só sem o email automático.

## Estrutura de pastas

```
app/
  page.tsx                  → página inicial / catálogo
  produto/[slug]/page.tsx   → página de detalhe do produto
  carrinho/page.tsx         → carrinho
  checkout/page.tsx         → formulário de checkout (grava pedido no Supabase)
  checkout/sucesso/page.tsx → confirmação
components/                 → Header, Footer, ProductCard, AddToCartButton
contexts/CartContext.tsx    → estado do carrinho (localStorage)
lib/supabase.ts             → cliente Supabase + tipos
lib/products.ts             → funções de busca de produtos
supabase/schema.sql         → schema completo do banco (rode no SQL Editor)
```

## Personalizar o visual

Os tokens de design (cores, fontes) ficam em `tailwind.config.ts`:

- `ink` (#141414) — texto e fundo escuro
- `paper` (#F6F5F2) — fundo claro
- `signal` (#FF5A1F) — cor de destaque/ação
- Fontes: Fraunces (títulos), Inter (corpo), IBM Plex Mono (rótulos/preços)

Troque essas variáveis para adaptar a marca sem mexer nos componentes.
