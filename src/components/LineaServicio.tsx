import Link from 'next/link';
import type { Linea } from '@/lib/content/schemas';
import { IconoInfo } from './Iconos';

export function NotaAuditoria({ texto }: { texto: string }) {
  return (
    <p className="flex items-start gap-2 rounded-[var(--radio,8px)] border border-line-strong bg-surface-sunken p-4 text-body-sm">
      <IconoInfo tam={20} className="mt-px shrink-0 text-accent" /><span>{texto}</span>
    </p>
  );
}

export function LineaTarjeta({ l }: { l: Linea }) {
  return (
    <article className="relative flex h-full flex-col rounded-md border border-line bg-surface-raised p-6 shadow-1 hover:shadow-2">
      <h3 className="font-serif text-h3 font-semibold">
        <Link href={`/ba/servicios/${l.slug}`} className="no-underline after:absolute after:inset-0 hover:text-accent">{l.titulo}</Link>
      </h3>
      <p className="mt-2 text-ink-muted">{l.problema}</p>
      <p className="mt-auto pt-4 text-body-sm font-semibold text-accent">Ver método y entregables</p>
    </article>
  );
}
