"use client";

import Link from "next/link";
import { ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <div className="sticky top-0 z-40">
      <div className="bg-ink px-6 py-2 text-center font-mono text-[11px] uppercase tracking-widest text-paper/80">
        <span className="inline-flex items-center gap-2">
          <Truck size={13} strokeWidth={2} />
          Pagamento pessoalmente na entrega ou retirada
        </span>
      </div>

      <header className="border-b border-border_soft bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="focus-ring font-display text-2xl font-semibold tracking-tight"
          >
            Núcleo
          </Link>

          <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-widest text-ink/70 md:flex">
            <Link href="/" className="transition hover:text-signal focus-ring">
              Catálogo
            </Link>
            <Link href="/#sobre" className="transition hover:text-signal focus-ring">
              Sobre
            </Link>
          </nav>

          <Link
            href="/carrinho"
            className="focus-ring flex items-center gap-2 rounded-full border border-ink/10 bg-ink px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-paper shadow-soft transition hover:bg-ink/85"
          >
            <ShoppingBag size={15} strokeWidth={2} />
            <span className="hidden sm:inline">Carrinho</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-signal px-1 text-[11px] font-semibold text-paper">
              {totalItems}
            </span>
          </Link>
        </div>
      </header>
    </div>
  );
}
