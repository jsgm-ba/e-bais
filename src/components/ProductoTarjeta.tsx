import Link from 'next/link';
import type { Producto } from '@/lib/content/schemas';
import { cop } from '@/lib/formato';
import { Chip, cx } from './ui';

export type TextosTarjeta = { estados: Record<string, string>; formato: Record<string, string>; clientes: Record<string, string>; regimen: Record<string, string>; escalon: Record<string, string>; cotiza: string };
export type ProductoLigero = Pick<Producto, 'id' | 'slug' | 'cliente' | 'problema' | 'nombre' | 'resultado' | 'formato' | 'intensidad_h' | 'regimen' | 'precio' | 'estado' | 'escalon' | 'publicacion'>;

export const ligero = (p: Producto): ProductoLigero => ({
  id: p.id, slug: p.slug, cliente: p.cliente, problema: p.problema, nombre: p.nombre, resultado: p.resultado,
  formato: p.formato, intensidad_h: p.intensidad_h, regimen: p.regimen, precio: p.precio, estado: p.estado, escalon: p.escalon, publicacion: p.publicacion,
});

export function textoPrecio(p: ProductoLigero, t: TextosTarjeta): string {
  if (p.precio.modo === 'cotiza') return t.cotiza;
  if (!p.precio.aprobado_mmp) return t.estados.precio_preparacion ?? 'Precio en preparación';
  if (p.precio.modo === 'gratis') return 'Gratis';
  return p.precio.desde_cop != null ? `Desde ${cop(p.precio.desde_cop)}` : (t.estados.precio_preparacion ?? '');
}

export function ProductoTarjeta({ p, t, nivel = 3 }: { p: ProductoLigero; t: TextosTarjeta; nivel?: 2 | 3 }) {
  const H = nivel === 2 ? 'h2' : 'h3';
  return (
    <article className="relative flex h-full flex-col rounded-[var(--radio,8px)] border border-line bg-surface-raised p-6 shadow-1 hover:shadow-2">
      <div className="mb-3 flex flex-wrap gap-2">
        <Chip tono={p.estado === 'confirmado' ? 'acento' : 'neutro'}>{t.estados[p.estado]}</Chip>
        <Chip>{t.clientes[p.cliente]}</Chip>
        <Chip>{t.escalon[p.escalon]}</Chip>
      </div>
      <p className="text-body-sm text-ink-muted">{p.problema}</p>
      <H className="mt-2 text-h4 font-semibold">
        <Link href={`/eva/${p.slug}`} className="no-underline after:absolute after:inset-0 hover:text-accent focus-visible:text-accent">
          <span className="relative">{p.nombre}</span>
        </Link>
      </H>
      {p.resultado && <p className="mt-2 text-body-sm">{p.resultado}</p>}
      <dl className="mt-auto grid grid-cols-2 gap-x-4 gap-y-1 pt-4 text-caption text-ink-muted">
        <dt className="sr-only">Formato</dt><dd>{t.formato[p.formato]}</dd>
        <dt className="sr-only">Intensidad</dt><dd className="text-right">{p.intensidad_h ? `${p.intensidad_h} h` : ''}</dd>
        <dt className="sr-only">Precio</dt><dd className={cx('col-span-2 font-semibold text-ink')}>{textoPrecio(p, t)}</dd>
      </dl>
    </article>
  );
}
