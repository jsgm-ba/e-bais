import Link from 'next/link';
import type { ReactNode } from 'react';
import { contenido } from '@/lib/content';
import { esPreview } from '@/lib/preview';
import { sesionActual } from '@/lib/supabase/server';
import { TemaToggle } from './TemaToggle';
import { BorradorBadge, LogoSlot, cx } from './ui';

export type Superficie = 'hub' | 'ba' | 'eva' | 'ckop';
const PRODUCTO: Record<Superficie, 'ba' | 'eva' | 'ckop'> = { hub: 'ba', ba: 'ba', eva: 'eva', ckop: 'ckop' };

function Marca({ s }: { s: Superficie }) {
  const { marca } = contenido.comun;
  if (s === 'ckop') return <span className="font-mono text-h4 font-semibold tracking-wider text-accent">{marca.ckop}</span>;
  if (s === 'eva') return <span className="font-eva text-h3 font-semibold text-accent">{marca.eva}</span>;
  if (s === 'ba') return <span className="flex items-center gap-3"><LogoSlot texto={marca.logo_slot} decorativo /><span className="font-serif text-h4 font-semibold">{marca.ba}</span></span>;
  return <span className="flex items-center gap-3"><LogoSlot texto={marca.logo_slot} decorativo /><span className="text-h4 font-bold">{marca.hub}</span></span>;
}

async function Encabezado({ s }: { s: Superficie }) {
  const { nav, cuenta } = contenido.comun;
  const enlaces = nav[s] ?? [];
  const sesion = await sesionActual();
  const inicio = s === 'hub' ? '/' : `/${s}`;
  return (
    <header className="border-b border-line bg-surface">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-surface focus:p-2">Saltar al contenido</a>
      <div className={cx(s === 'ckop' ? 'contenedor-wide' : 'contenedor', 'flex min-h-16 flex-wrap items-center gap-x-6 gap-y-2 py-2')}>
        <Link href={inicio} className="no-underline"><Marca s={s} /></Link>
        <nav aria-label="Principal" className="order-3 w-full lg:order-none lg:w-auto lg:flex-1">
          <ul className="flex flex-wrap gap-x-1 gap-y-1">
            {enlaces.map((e) => (
              <li key={e.h}><Link href={e.h} className="inline-flex min-h-touch items-center rounded-[var(--radio,8px)] px-3 text-label font-medium text-ink no-underline hover:bg-accent-soft hover:text-accent md:min-h-control">{e.t}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          {s !== 'ckop' && <TemaToggle />}
          {s === 'ckop' && <TemaToggle ambito="ckop" />}
          <Link href={sesion ? '/cuenta' : '/ingresar'} className="inline-flex min-h-touch items-center rounded-[var(--radio,8px)] border border-line-strong px-3 text-label font-semibold no-underline hover:bg-accent-soft md:min-h-control">
            {sesion ? cuenta.mi_cuenta : cuenta.ingresar}
          </Link>
        </div>
      </div>
    </header>
  );
}

function Pie() {
  const { pie } = contenido.comun;
  return (
    <footer data-product="ba" className="mt-16 border-t border-line bg-surface-sunken">
      <div className="contenedor grid gap-8 py-12 md:grid-cols-3">
        <nav aria-labelledby="pie-cruzado">
          <p id="pie-cruzado" className="mb-3 text-label font-semibold">{pie.titulo_cruzado}</p>
          <ul className="grid gap-2">{pie.enlaces.map((e) => <li key={e.h}><Link href={e.h} className="enlace text-body-sm">{e.t}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Legal">
          <ul className="grid gap-2">{pie.legal.map((e) => <li key={e.h}><Link href={e.h} className="enlace text-body-sm">{e.t}</Link></li>)}</ul>
        </nav>
        <div className="text-body-sm text-ink-muted">
          <p>{pie.razon_social}</p>
          <p className="mt-2">{pie.aviso_certificacion}</p>
        </div>
      </div>
    </footer>
  );
}

/** Marco de cada superficie: data-product reasigna el acento; CKOP arranca en tema oscuro. */
export async function Marco({ s, children, borrador }: { s: Superficie; children: ReactNode; borrador?: boolean }) {
  const preview = esPreview();
  return (
    <div data-product={PRODUCTO[s]} data-ambito={s === 'ckop' ? 'ckop' : undefined} data-theme={s === 'ckop' ? 'dark' : undefined}
      className={cx('flex min-h-screen flex-col', s === 'ckop' && 'bg-surface text-ink')}>
      <Encabezado s={s} />
      {preview && borrador && (
        <div className={cx(s === 'ckop' ? 'contenedor-wide' : 'contenedor', 'pt-4')}><BorradorBadge texto={contenido.comun.estados.borrador} /></div>
      )}
      <main id="contenido" className="flex-1">{children}</main>
      <Pie />
    </div>
  );
}
