"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPriceFromCents } from "@/lib/supabase";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalCents } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface">
          <ShoppingBag size={22} className="text-muted" />
        </div>
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">
          Carrinho vazio
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
          Nada por aqui ainda.
        </h1>
        <Link
          href="/"
          className="focus-ring mt-8 inline-block rounded-lg bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper shadow-soft transition hover:bg-signal"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">Seu carrinho</h1>

      <div className="mt-8 flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-card"
          >
            <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded bg-surface">
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              <Link
                href={`/produto/${item.slug}`}
                className="focus-ring font-display text-base font-medium text-ink hover:text-signal"
              >
                {item.name}
              </Link>
              <p className="mt-1 font-mono text-xs text-muted">
                {formatPriceFromCents(item.price_cents)} / unidade
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-full border border-border_soft p-1 font-mono text-sm">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="focus-ring flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-surface"
                aria-label="Diminuir quantidade"
              >
                <Minus size={13} />
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="focus-ring flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-surface"
                aria-label="Aumentar quantidade"
              >
                <Plus size={13} />
              </button>
            </div>

            <p className="w-24 text-right font-mono text-sm font-semibold text-ink">
              {formatPriceFromCents(item.price_cents * item.quantity)}
            </p>

            <button
              onClick={() => removeItem(item.id)}
              aria-label="Remover item"
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-signal_soft hover:text-signal"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4 rounded-lg bg-white p-6 shadow-card md:ml-auto md:w-fit">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            Total
          </span>
          <span className="font-display text-2xl font-semibold text-ink">
            {formatPriceFromCents(totalCents)}
          </span>
        </div>
        <Link
          href="/checkout"
          className="focus-ring w-full rounded-lg bg-ink px-6 py-4 text-center font-mono text-xs uppercase tracking-widest text-paper shadow-soft transition hover:bg-signal md:w-64"
        >
          Ir para o checkout
        </Link>
      </div>
    </div>
  );
}
