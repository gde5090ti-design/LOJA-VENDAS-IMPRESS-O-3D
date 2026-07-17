"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/supabase";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  function handleClick() {
    if (outOfStock) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      disabled={outOfStock}
      className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-6 py-4 font-mono text-xs uppercase tracking-widest text-paper shadow-soft transition hover:bg-signal disabled:cursor-not-allowed disabled:bg-muted"
    >
      {outOfStock ? (
        "Esgotado"
      ) : added ? (
        <>
          <Check size={15} /> Adicionado
        </>
      ) : (
        <>
          <ShoppingBag size={15} /> Adicionar ao carrinho
        </>
      )}
    </button>
  );
}
