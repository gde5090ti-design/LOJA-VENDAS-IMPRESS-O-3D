import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-signal">
        404
      </span>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Essa página não existe.
      </h1>
      <Link
        href="/"
        className="focus-ring mt-8 inline-block rounded-lg bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper shadow-soft transition hover:bg-signal"
      >
        Voltar ao catálogo
      </Link>
    </div>
  );
}
