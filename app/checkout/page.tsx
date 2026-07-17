"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { supabase, formatPriceFromCents } from "@/lib/supabase";

export default function CheckoutPage() {
  const { items, totalCents, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          shipping_address: address,
          total_cents: totalCents,
          status: "pendente",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        unit_price_cents: item.price_cents,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Envia o email de confirmação. Se falhar, não impede a finalização do pedido.
      try {
        await fetch("/api/enviar-confirmacao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: name,
            customerEmail: email,
            orderId: order.id,
            items: items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price_cents: item.price_cents,
            })),
            totalCents,
          }),
        });
      } catch (emailErr) {
        console.error("Falha ao enviar email de confirmação:", emailErr);
      }

      clearCart();
      router.push(`/checkout/sucesso?pedido=${order.id}`);
    } catch (err: any) {
      setError(
        err.message ||
          "Não foi possível concluir o pedido. Verifique a configuração do Supabase."
      );
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          Nada para finalizar
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
          Seu carrinho está vazio.
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">Checkout</h1>
      <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
        Pagamento feito pessoalmente na entrega ou retirada
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-lg bg-white p-6 shadow-card">
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-muted">
              Nome completo
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus-ring mt-2 w-full rounded-lg border border-border_soft bg-paper px-4 py-3 font-body text-sm"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-muted">
              E-mail
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-ring mt-2 w-full rounded-lg border border-border_soft bg-paper px-4 py-3 font-body text-sm"
              placeholder="voce@email.com"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-muted">
              Telefone (WhatsApp de preferência)
            </label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="focus-ring mt-2 w-full rounded-lg border border-border_soft bg-paper px-4 py-3 font-body text-sm"
              placeholder="(11) 91234-5678"
            />
            <p className="mt-1 font-mono text-[11px] text-muted">
              Usamos esse número só para entrar em contato caso haja algum problema com o pedido.
            </p>
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-muted">
              Endereço de entrega ou retirada
            </label>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="focus-ring mt-2 w-full rounded-lg border border-border_soft bg-paper px-4 py-3 font-body text-sm"
              placeholder="Rua, número, bairro, cidade, CEP"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-signal bg-signal_soft px-4 py-3 font-mono text-xs text-signal_dark">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring mt-2 w-full rounded-lg bg-ink px-6 py-4 font-mono text-xs uppercase tracking-widest text-paper shadow-soft transition hover:bg-signal disabled:opacity-50"
          >
            {loading ? "Enviando pedido..." : "Confirmar pedido"}
          </button>

          <p className="font-mono text-[11px] text-muted">
            O pagamento é feito pessoalmente, na entrega ou retirada. Este passo só reserva o
            pedido na tabela <code className="text-signal">orders</code> do Supabase.
          </p>
        </form>

        <div className="h-fit rounded-lg bg-white p-6 shadow-card">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
            Resumo do pedido
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between font-body text-sm text-ink">
                <span>
                  {item.quantity}× {item.name}
                </span>
                <span className="font-mono">
                  {formatPriceFromCents(item.price_cents * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-border_soft pt-4 font-display text-lg font-semibold text-ink">
            <span>Total</span>
            <span>{formatPriceFromCents(totalCents)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
