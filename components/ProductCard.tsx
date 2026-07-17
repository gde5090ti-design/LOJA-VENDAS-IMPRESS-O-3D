import Link from "next/link";
import Image from "next/image";
import { Product, formatPriceFromCents } from "@/lib/supabase";

export default function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0;
  const onSale = !!product.compare_at_price_cents;

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="focus-ring group flex flex-col overflow-hidden rounded-lg bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-cardHover"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-xs text-muted">
            sem imagem
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {outOfStock && (
            <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-paper shadow-soft">
              Esgotado
            </span>
          )}
          {!outOfStock && onSale && (
            <span className="rounded-full bg-signal px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-paper shadow-soft">
              Oferta
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.category && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {product.category}
          </span>
        )}
        <h3 className="font-display text-lg font-medium leading-snug text-ink">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="font-mono text-sm font-semibold text-ink">
            {formatPriceFromCents(product.price_cents)}
          </span>
          {product.compare_at_price_cents && (
            <span className="font-mono text-xs text-muted line-through">
              {formatPriceFromCents(product.compare_at_price_cents)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
