import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, PackageCheck, PackageX } from "lucide-react";
import { getProductBySlug } from "@/lib/products";
import { formatPriceFromCents } from "@/lib/supabase";
import AddToCartButton from "@/components/AddToCartButton";

export const revalidate = 0;

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product) notFound();

  const inStock = product.stock > 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/"
        className="focus-ring inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted transition hover:text-signal"
      >
        <ArrowLeft size={14} /> Voltar ao catálogo
      </Link>

      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface shadow-card">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-mono text-xs text-muted">
              sem imagem
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {product.category && (
            <span className="font-mono text-xs uppercase tracking-widest text-signal">
              {product.category}
            </span>
          )}
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink">
            {product.name}
          </h1>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-mono text-2xl font-semibold text-ink">
              {formatPriceFromCents(product.price_cents)}
            </span>
            {product.compare_at_price_cents && (
              <span className="font-mono text-base text-muted line-through">
                {formatPriceFromCents(product.compare_at_price_cents)}
              </span>
            )}
          </div>

          <p className="mt-6 max-w-md font-body text-sm leading-relaxed text-ink/70">
            {product.description || "Sem descrição cadastrada para este produto."}
          </p>

          <div
            className={`mt-5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-widest ${
              inStock ? "bg-success/10 text-success" : "bg-ink/5 text-muted"
            }`}
          >
            {inStock ? <PackageCheck size={14} /> : <PackageX size={14} />}
            {inStock ? `${product.stock} em estoque` : "Sem estoque no momento"}
          </div>

          <div className="mt-8 max-w-sm">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
