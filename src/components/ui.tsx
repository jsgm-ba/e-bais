import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
export { cx };

/* ---------- Texto con marcas [[PENDIENTE: ...]] ---------- */
const MARCA = /\[\[PENDIENTE:?\s*([^\]]*)\]\]/g;

/** Separa un texto en partes normales y pendientes. Puro: sirve en servidor y cliente. */
export function partes(texto: string): { t: string; pendiente: boolean }[] {
  const out: { t: string; pendiente: boolean }[] = [];
  let ultimo = 0;
  for (const m of texto.matchAll(MARCA)) {
    if (m.index! > ultimo) out.push({ t: texto.slice(ultimo, m.index), pendiente: false });
    out.push({ t: m[1]!.trim(), pendiente: true });
    ultimo = m.index! + m[0].length;
  }
  if (ultimo < texto.length) out.push({ t: texto.slice(ultimo), pendiente: false });
  return out;
}

export const soloPendiente = (texto: string) => partes(texto).every((p) => p.pendiente || !p.t.trim());

/** Muestra el texto; los pendientes solo aparecen (resaltados) en vista previa. */
export function Texto({ children, preview }: { children: string; preview: boolean }) {
  return (
    <>
      {partes(children).map((p, i) =>
        p.pendiente ? (
          preview ? (
            <mark key={i} className="rounded-sm bg-revisar-soft px-1 text-revisar">Pendiente: {p.t}</mark>
          ) : null
        ) : (
          <span key={i}>{p.t}</span>
        ),
      )}
    </>
  );
}

/* ---------- Estructura ---------- */
export function Section({ id, titulo, bajada, children, className, nivel = 2, denso }: { id?: string; titulo?: ReactNode; bajada?: ReactNode; children: ReactNode; className?: string; nivel?: 2 | 3; denso?: boolean }) {
  const H = nivel === 2 ? 'h2' : 'h3';
  return (
    <section id={id} aria-labelledby={titulo && id ? `${id}-t` : undefined} className={cx(denso ? 'py-6' : 'py-12 lg:py-16', className)}>
      {titulo && (
        <div className="mb-6 max-w-measure">
          <H id={id ? `${id}-t` : undefined} className={cx(nivel === 2 ? 'text-h2' : 'text-h3', 'font-semibold')}>{titulo}</H>
          {bajada && <p className="mt-2 text-body-lg text-ink-muted">{bajada}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Card({ children, className, as: As = 'div', interactiva }: { children: ReactNode; className?: string; as?: 'div' | 'article' | 'li'; interactiva?: boolean }) {
  return (
    <As className={cx('rounded-[var(--radio,8px)] border border-line bg-surface-raised p-6 shadow-1', interactiva && 'hover:shadow-2', className)}>
      {children}
    </As>
  );
}

export function Chip({ children, tono = 'neutro', className }: { children: ReactNode; tono?: 'neutro' | 'acento' | 'viable' | 'revisar' | 'noir'; className?: string }) {
  const tonos = {
    neutro: 'border-line-strong text-ink-muted bg-surface',
    acento: 'border-transparent bg-accent-soft text-accent',
    viable: 'border-transparent bg-viable-soft text-viable',
    revisar: 'border-transparent bg-revisar-soft text-revisar',
    noir: 'border-transparent bg-noir-soft text-noir',
  } as const;
  return <span className={cx('inline-flex items-center gap-1 rounded-full border px-2 py-px text-caption font-medium', tonos[tono], className)}>{children}</span>;
}

/* ---------- Botones ---------- */
type Variante = 'principal' | 'secundario' | 'fantasma';
const base = 'inline-flex min-h-touch items-center justify-center gap-2 rounded-[var(--radio,8px)] px-4 text-label font-semibold md:min-h-control disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-muted disabled:border-line';
const variantes: Record<Variante, string> = {
  principal: 'bg-accent text-on-accent hover:brightness-90',
  secundario: 'border border-accent text-accent bg-surface hover:bg-accent-soft',
  fantasma: 'text-accent hover:bg-accent-soft',
};

export function Button({ variante = 'principal', className, ...p }: ComponentProps<'button'> & { variante?: Variante }) {
  return <button className={cx(base, variantes[variante], className)} {...p} />;
}

export function LinkButton({ variante = 'principal', className, href, ...p }: ComponentProps<typeof Link> & { variante?: Variante }) {
  return <Link href={href} className={cx(base, variantes[variante], 'no-underline', className)} {...p} />;
}

/* ---------- Estados de contenido ---------- */
export function BorradorBadge({ texto = 'Borrador · requiere aprobación' }: { texto?: string }) {
  return (
    <p role="note" className="inline-flex items-center gap-2 rounded-full border border-revisar bg-revisar-soft px-3 py-1 text-caption font-semibold text-revisar">
      {texto}
    </p>
  );
}

export function EnPreparacion({ texto = 'Contenido en preparación' }: { texto?: string }) {
  return (
    <div className="contenedor py-24">
      <p className="text-h3 font-semibold">{texto}</p>
      <p className="mt-2 text-ink-muted">Esta sección se publica cuando su contenido tenga fuente y aprobación.</p>
    </div>
  );
}

export function DatoEjemplo({ texto = 'Dato de ejemplo' }: { texto?: string }) {
  return <Chip tono="revisar">{texto}</Chip>;
}

/** Marcador del logo oficial de B&A hasta recibir el vectorial. No reconstruir el logo. */
export function LogoSlot({ texto = 'LOGO B&A', decorativo }: { texto?: string; decorativo?: boolean }) {
  return (
    <span className="eb-logo-slot inline-flex h-8 w-24 shrink-0 items-center justify-center rounded-sm border border-dashed border-line-strong text-caption font-semibold tracking-wide text-ink-muted"
      {...(decorativo ? { 'aria-hidden': true } : { role: 'img', 'aria-label': texto })}>
      {texto}
    </span>
  );
}
