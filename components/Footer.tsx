import { Mail, Instagram, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border_soft bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold">Núcleo</p>
          <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-paper/60">
            Peças selecionadas, estoque real, entrega combinada com você.
            Sem intermediário, sem letra miúda.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="mailto:contato@nucleo.loja"
              aria-label="Enviar email"
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-paper/15 transition hover:border-signal hover:text-signal"
            >
              <Mail size={16} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-paper/15 transition hover:border-signal hover:text-signal"
            >
              <Instagram size={16} />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-widest">
          <span className="text-paper/35">Loja</span>
          <a href="/" className="text-paper/75 transition hover:text-signal">Catálogo</a>
          <a href="/carrinho" className="text-paper/75 transition hover:text-signal">Carrinho</a>
          <a href="/#sobre" className="text-paper/75 transition hover:text-signal">Sobre</a>
        </div>

        <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-widest">
          <span className="text-paper/35">Atendimento</span>
          <a href="mailto:contato@nucleo.loja" className="text-paper/75 transition hover:text-signal">
            contato@nucleo.loja
          </a>
          <span className="text-paper/75">Seg – Sex, 9h às 18h</span>
          <span className="mt-2 flex items-center gap-2 text-paper/50 normal-case tracking-normal">
            <ShieldCheck size={14} /> Pagamento seguro, na entrega
          </span>
        </div>
      </div>

      <div className="border-t border-paper/10 px-6 py-4 text-center font-mono text-[11px] uppercase tracking-widest text-paper/35">
        © {new Date().getFullYear()} Núcleo — construído com Next.js + Supabase
      </div>
    </footer>
  );
}
