import { Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { getAllProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <div>
      <section className="border-b border-border_soft bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-block rounded-full bg-signal_soft px-3 py-1 font-mono text-xs uppercase tracking-widest text-signal_dark">
              {products.length} peças no catálogo
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.08] tracking-tight text-ink md:text-6xl">
              Peças escolhidas,
              <br />
              <span className="italic text-signal">não</span> empilhadas.
            </h1>
            <p className="mt-6 max-w-md font-body text-base leading-relaxed text-ink/70">
              Cada item deste catálogo está em estoque real, com preço fechado
              e sem letras miúdas. O que você vê aqui é o que chega aí.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#catalogo"
                className="focus-ring rounded-lg bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper shadow-soft transition hover:bg-signal"
              >
                Ver catálogo
              </a>
              <a
                href="#sobre"
                className="focus-ring rounded-lg border border-ink/15 px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink transition hover:border-ink"
              >
                Sobre a loja
              </a>
            </div>
          </div>

          <div className="grid content-center gap-4">
            <div className="flex items-start gap-4 rounded-lg bg-surface p-5">
              <Truck size={20} className="mt-0.5 shrink-0 text-signal" />
              <div>
                <p className="font-body text-sm font-semibold text-ink">Entrega combinada com você</p>
                <p className="mt-0.5 font-body text-sm text-ink/60">Alinhamos data e local direto pelo telefone.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg bg-surface p-5">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-signal" />
              <div>
                <p className="font-body text-sm font-semibold text-ink">Estoque conferido em tempo real</p>
                <p className="mt-0.5 font-body text-sm text-ink/60">O que aparece disponível aqui, existe de verdade.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg bg-surface p-5">
              <MessageCircle size={20} className="mt-0.5 shrink-0 text-signal" />
              <div>
                <p className="font-body text-sm font-semibold text-ink">Pagamento pessoalmente</p>
                <p className="mt-0.5 font-body text-sm text-ink/60">Na entrega ou retirada, sem cartão salvo em lugar nenhum.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="catalogo" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">Catálogo</h2>
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            {products.length} {products.length === 1 ? "item" : "itens"}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border_soft bg-white p-12 text-center font-mono text-sm text-muted">
            Nenhum produto encontrado. Cadastre produtos na tabela{" "}
            <code className="text-signal">products</code> do Supabase para
            que apareçam aqui.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section id="sobre" className="border-t border-border_soft bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-signal">
            Sobre a Núcleo
          </p>
          <p className="mt-4 max-w-2xl font-display text-2xl font-medium leading-snug md:text-3xl">
            Construída como vitrine enxuta: sem intermediário de anúncio,
            sem estoque fantasma, sem preço que muda no carrinho.
          </p>
        </div>
      </section>
    </div>
  );
}
