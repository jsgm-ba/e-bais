'use client';
import { useMemo, useState } from 'react';
import { ProductoTarjeta, type ProductoLigero, type TextosTarjeta } from './ProductoTarjeta';
import { Button } from './ui';

const RANGOS = [
  { id: 'corto', t: 'Hasta 8 h', f: (h: number) => h <= 8 },
  { id: 'medio', t: '9 a 24 h', f: (h: number) => h > 8 && h <= 24 },
  { id: 'largo', t: 'Más de 24 h', f: (h: number) => h > 24 },
];

/** Catálogo filtrable por cliente (C1-C6), problema, formato e intensidad. */
export function CatalogoEVA({ productos, t, textos }: { productos: ProductoLigero[]; t: TextosTarjeta; textos: Record<string, string> }) {
  const [cliente, setCliente] = useState('');
  const [formato, setFormato] = useState('');
  const [rango, setRango] = useState('');
  const [q, setQ] = useState('');
  const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const filtrados = useMemo(() => productos.filter((p) =>
    (!cliente || p.cliente === cliente) && (!formato || p.formato === formato) &&
    (!rango || RANGOS.find((r) => r.id === rango)!.f(p.intensidad_h ?? 0)) &&
    (!q || norm(`${p.problema} ${p.nombre}`).includes(norm(q)))), [productos, cliente, formato, rango, q]);
  const formatos = [...new Set(productos.map((p) => p.formato))];
  const sel = 'mt-1 min-h-touch w-full rounded-[var(--radio,8px)] border border-line-strong bg-surface px-3 md:min-h-control';
  return (
    <div>
      <form role="search" aria-label="Filtrar catálogo" onSubmit={(e) => e.preventDefault()} className="grid gap-4 rounded-[var(--radio,8px)] border border-line bg-surface-sunken p-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2"><label htmlFor="f-q" className="text-label font-semibold">{textos.problema}</label>
          <input id="f-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} className={sel} /></div>
        <div><label htmlFor="f-c" className="text-label font-semibold">{textos.cliente}</label>
          <select id="f-c" value={cliente} onChange={(e) => setCliente(e.target.value)} className={sel}>
            <option value="">{textos.todos}</option>{Object.entries(t.clientes).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div><label htmlFor="f-f" className="text-label font-semibold">{textos.formato}</label>
          <select id="f-f" value={formato} onChange={(e) => setFormato(e.target.value)} className={sel}>
            <option value="">{textos.todos}</option>{formatos.map((f) => <option key={f} value={f}>{t.formato[f]}</option>)}</select></div>
        <div><label htmlFor="f-i" className="text-label font-semibold">{textos.intensidad}</label>
          <select id="f-i" value={rango} onChange={(e) => setRango(e.target.value)} className={sel}>
            <option value="">{textos.todos}</option>{RANGOS.map((r) => <option key={r.id} value={r.id}>{r.t}</option>)}</select></div>
      </form>
      <div className="my-4 flex flex-wrap items-center justify-between gap-2">
        <p aria-live="polite" className="text-body-sm text-ink-muted"><span data-testid="conteo-catalogo">{filtrados.length}</span> {textos.resultados}</p>
        <Button variante="fantasma" type="button" onClick={() => { setCliente(''); setFormato(''); setRango(''); setQ(''); }}>{textos.limpiar}</Button>
      </div>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filtrados.map((p) => <li key={p.id}><ProductoTarjeta p={p} t={t} /></li>)}</ul>
    </div>
  );
}
