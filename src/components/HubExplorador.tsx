'use client';
import { useMemo, useState } from 'react';
import { ProductoTarjeta, type ProductoLigero, type TextosTarjeta } from './ProductoTarjeta';
import { Selector } from './Selector';
import { LinkButton } from './ui';

type Perfil = { id: string; etiqueta: string; clientes: string[]; cta: 'individual' | 'institucional' };

/** Selectores «¿Quién eres?» y «¿Qué necesitas resolver?»: filtran el catálogo y eligen el CTA. */
export function HubExplorador({ perfiles, productos, t, textos, cta }: {
  perfiles: Perfil[]; productos: ProductoLigero[]; t: TextosTarjeta;
  textos: { quien: string; que: string; todos: string; vacio: string };
  cta: Record<'individual' | 'institucional', { texto: string; href: string }>;
}) {
  const [perfil, setPerfil] = useState<string | null>(null);
  const [problema, setProblema] = useState<string>('');
  const p = perfiles.find((x) => x.id === perfil);
  const delPerfil = useMemo(() => productos.filter((x) => !p || p.clientes.includes(x.cliente)), [productos, p]);
  const visibles = delPerfil.filter((x) => !problema || x.id === problema);
  const accion = cta[p?.cta ?? 'individual'];

  return (
    <div className="grid gap-8">
      <Selector idEtiqueta="hub-quien" etiqueta={textos.quien} opciones={perfiles.map((x) => ({ id: x.id, texto: x.etiqueta }))} valor={perfil} onCambio={(v) => { setPerfil(v); setProblema(''); }} />
      <div>
        <label htmlFor="hub-que" className="mb-3 block text-h4 font-semibold">{textos.que}</label>
        <select id="hub-que" value={problema} onChange={(e) => setProblema(e.target.value)}
          className="min-h-touch w-full max-w-2xl rounded-[var(--radio,8px)] border border-line-strong bg-surface px-3 text-body md:min-h-control">
          <option value="">{textos.todos}</option>
          {delPerfil.map((x) => <option key={x.id} value={x.id}>{x.problema.replace(/[«»]/g, '')}</option>)}
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <LinkButton href={accion.href}>{accion.texto}</LinkButton>
        <p className="text-body-sm text-ink-muted" aria-live="polite">{visibles.length} {visibles.length === 1 ? 'producto' : 'productos'}</p>
      </div>
      {visibles.length === 0 ? <p>{textos.vacio}</p> : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibles.slice(0, 9).map((x) => <li key={x.id}><ProductoTarjeta p={x} t={t} /></li>)}
        </ul>
      )}
    </div>
  );
}
