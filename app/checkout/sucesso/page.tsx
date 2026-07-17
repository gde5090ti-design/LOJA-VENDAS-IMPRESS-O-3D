import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { pedido?: string };
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 size={30} className="text-success" />
      </div>
      <span className="mt-6 block font-mono text-xs uppercase tracking-widest text-signal">
        Pedido confirmado
      </span>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
        Obrigado pelo seu pedido!
      </h1>
      {searchParams.pedido && (
        <p className="mt-4 rounded-full bg-surface px-4 py-1.5 font-mono text-sm text-muted">
          Pedido #{searchParams.pedido}
        </p>
      )}
      <p className="mt-6 font-body text-sm leading-relaxed text-ink/70">
        O pagamento é feito pessoalmente, na entrega ou retirada. Vamos entrar
        em contato pelo telefone informado caso tenhamos algum problema com o
        seu pedido.
      </p>
      <Link
        href="/"
        className="focus-ring mt-10 inline-block rounded-lg bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper shadow-soft transition hover:bg-signal"
      >
        Voltar ao catálogo
      </Link>
    </div>
  );
}
