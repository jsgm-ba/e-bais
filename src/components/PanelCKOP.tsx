'use client';
import { useMemo, useState, type FormEvent } from 'react';
import type { FilaProceso, SemaforoEstado } from '@/lib/content/schemas';
import { cop, diasHasta, plazo } from '@/lib/formato';
import { ETIQUETA_SEMAFORO } from '@/lib/semaforo';
import { EstadoSemaforo } from './EstadoSemaforo';
import { TablaDensa, type Columna } from './TablaDensa';
import { Button, Chip, cx } from './ui';

type T = Record<string, Record<string, string> | string>;
const tx = (t: T, g: string, k: string) => ((t[g] as Record<string, string>)?.[k] ?? k);

function Kpi({ etiqueta, valor, tono }: { etiqueta: string; valor: string; tono?: SemaforoEstado }) {
  return (
    <div className="rounded-sm border border-line bg-surface-raised p-3">
      <p className="text-caption font-semibold uppercase tracking-wide text-ink-muted">{etiqueta}</p>
      <p className={cx('mt-1 font-mono text-kpi font-semibold tabular', tono && { viable: 'text-viable', revisar: 'text-revisar', noir: 'text-noir' }[tono])}>{valor}</p>
    </div>
  );
}

/** Panel CKOP: KPI, filtros, tabla densa y decisión con justificación. La persona decide; nada se envía a SECOP II. */
export function PanelCKOP({ filas, radar, t, puedeDecidir, ejemplo }: {
  filas: FilaProceso[]; radar: { ok: boolean; filas: FilaProceso[]; error?: string }; t: T; puedeDecidir: boolean; ejemplo: boolean;
}) {
  const [vista, setVista] = useState<'maestro' | 'radar'>('maestro');
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState<'' | SemaforoEstado>('');
  const [sel, setSel] = useState<string | null>(null);
  const base = vista === 'maestro' ? filas : radar.filas;
  const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = useMemo(() => base.filter((f) => (!estado || f.estado === estado) && (!q || norm(`${f.codigo} ${f.entidad} ${f.objeto}`).includes(norm(q)))), [base, estado, q]);
  const proceso = base.find((f) => f.codigo === sel) ?? null;

  const k = {
    total: filas.length,
    viable: filas.filter((f) => f.estado === 'viable').length,
    revisar: filas.filter((f) => f.estado === 'revisar').length,
    noir: filas.filter((f) => f.estado === 'noir').length,
    valor: filas.filter((f) => f.estado !== 'noir').reduce((s, f) => s + (f.valor ?? 0), 0),
    cierran: filas.filter((f) => f.cierre && diasHasta(f.cierre) >= 0 && diasHasta(f.cierre) <= 7).length,
  };

  const columnas: Columna<FilaProceso>[] = [
    { clave: 'codigo', titulo: tx(t, 'columnas', 'codigo'), celda: (f) => f.codigo },
    { clave: 'entidad', titulo: tx(t, 'columnas', 'entidad'), celda: (f) => <span className="block max-w-[220px] truncate" title={f.entidad}>{f.entidad}</span> },
    { clave: 'objeto', titulo: tx(t, 'columnas', 'objeto'), celda: (f) => <span className="block max-w-[360px] truncate" title={f.objeto}>{f.objeto}</span> },
    { clave: 'valor', titulo: tx(t, 'columnas', 'valor'), numerica: true, celda: (f) => cop(f.valor) },
    { clave: 'cierre', titulo: tx(t, 'columnas', 'cierre'), numerica: true, celda: (f) => (f.cierre ? plazo(f.cierre) : 'SIN DATO') },
    { clave: 'estado', titulo: tx(t, 'columnas', 'estado'), celda: (f) => <EstadoSemaforo estado={f.estado} /> },
  ];

  return (
    <div className="grid gap-4">
      {ejemplo && <p className="flex items-center gap-2 text-body-sm"><Chip tono="revisar">{t.dato_ejemplo as string}</Chip><span className="text-ink-muted">{t.sin_datos as string}</span></p>}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
        <Kpi etiqueta={tx(t, 'kpi', 'procesos')} valor={String(k.total)} />
        <Kpi etiqueta={tx(t, 'kpi', 'viable')} valor={String(k.viable)} tono="viable" />
        <Kpi etiqueta={tx(t, 'kpi', 'revisar')} valor={String(k.revisar)} tono="revisar" />
        <Kpi etiqueta={tx(t, 'kpi', 'noir')} valor={String(k.noir)} tono="noir" />
        <Kpi etiqueta={tx(t, 'kpi', 'valor')} valor={cop(k.valor)} />
        <Kpi etiqueta={tx(t, 'kpi', 'cierran')} valor={String(k.cierran)} />
      </div>

      <div role="tablist" aria-label="Fuente de procesos" className="flex gap-1 border-b border-line">
        {(['maestro', 'radar'] as const).map((v) => (
          <button key={v} role="tab" type="button" aria-selected={vista === v} aria-controls="ckop-tabla" id={`tab-${v}`} onClick={() => { setVista(v); setSel(null); }}
            className={cx('h-control-ckop border-b-2 px-3 text-label font-semibold', vista === v ? 'border-accent text-accent' : 'border-transparent text-ink-muted hover:text-ink')}>
            {v === 'maestro' ? 'Sheets Maestro' : tx(t, 'radar', 'titulo')}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-[220px] flex-1">
          <label htmlFor="ckop-q" className="text-caption font-semibold text-ink-muted">{tx(t, 'filtros', 'buscar')}</label>
          <input id="ckop-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} className="mt-1 h-control-ckop w-full rounded-sm border border-line-strong bg-surface px-2 text-body-sm" />
        </div>
        <div>
          <label htmlFor="ckop-e" className="text-caption font-semibold text-ink-muted">{tx(t, 'filtros', 'estado')}</label>
          <select id="ckop-e" value={estado} onChange={(e) => setEstado(e.target.value as '' | SemaforoEstado)} className="mt-1 h-control-ckop rounded-sm border border-line-strong bg-surface px-2 text-body-sm">
            <option value="">{tx(t, 'filtros', 'todos')}</option>
            {(Object.keys(ETIQUETA_SEMAFORO) as SemaforoEstado[]).map((s) => <option key={s} value={s}>{ETIQUETA_SEMAFORO[s]}</option>)}
          </select>
        </div>
        <p className="ml-auto font-mono text-data text-ink-muted tabular" aria-live="polite">{visibles.length}/{base.length}</p>
      </div>

      {vista === 'radar' && !radar.ok && <p className="rounded-sm border border-line-strong bg-surface-sunken p-3 text-body-sm">{tx(t, 'radar', 'sin_red')} ({radar.error})</p>}

      <div id="ckop-tabla" role="tabpanel" aria-labelledby={`tab-${vista}`} className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <TablaDensa titulo={vista === 'maestro' ? 'Procesos del Sheets Maestro' : 'Radar SECOP II'} columnas={columnas} filas={visibles} clave={(f) => f.codigo} onFila={(f) => setSel(f.codigo)} seleccionada={sel} />
        {proceso && <Detalle p={proceso} t={t} puedeDecidir={puedeDecidir && !ejemplo} onCerrar={() => setSel(null)} />}
      </div>
      <p className="text-caption text-ink-muted">{t.fuente as string}</p>
    </div>
  );
}

function Detalle({ p, t, puedeDecidir, onCerrar }: { p: FilaProceso; t: T; puedeDecidir: boolean; onCerrar: () => void }) {
  const [estado, setEstado] = useState<SemaforoEstado>(p.estado ?? 'revisar');
  const [resultado, setResultado] = useState<string | null>(null);
  async function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const precio = String(fd.get('precio') ?? '').replace(/\D/g, '');
    const r = await fetch('/api/ckop/decision', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo: p.codigo, estado, responsable: fd.get('responsable'), precio_propuesto: precio ? Number(precio) : null, justificacion: fd.get('nota') }) }).catch(() => null);
    setResultado(r?.ok ? 'Decisión registrada en la bitácora.' : 'No se pudo registrar la decisión.');
  }
  return (
    <section aria-labelledby="det-t" className="h-fit rounded-sm border border-line bg-surface-raised p-4">
      <div className="flex items-start justify-between gap-2">
        <h2 id="det-t" className="font-mono text-data-lg font-semibold">{p.codigo}</h2>
        <button type="button" onClick={onCerrar} className="h-control-ckop rounded-sm px-2 text-body-sm text-ink-muted hover:bg-accent-soft">Cerrar</button>
      </div>
      <p className="mt-1 text-body-sm">{p.entidad}</p>
      <p className="mt-2 text-body-sm">{p.objeto}</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-body-sm">
        <dt className="text-ink-muted">Valor</dt><dd className="text-right font-mono tabular">{cop(p.valor)}</dd>
        <dt className="text-ink-muted">Cierre</dt><dd className="text-right font-mono tabular">{p.cierre ? plazo(p.cierre) : 'SIN DATO'}</dd>
        {p.modalidad && (<><dt className="text-ink-muted">Modalidad</dt><dd className="text-right">{p.modalidad}</dd></>)}
      </dl>
      {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="enlace mt-2 inline-block text-body-sm">Ver en SECOP II</a>}
      <form onSubmit={guardar} className="mt-4 grid gap-3 border-t border-line pt-4">
        <p className="text-label font-semibold">{tx(t, 'decision', 'titulo')}</p>
        <fieldset>
          <legend className="sr-only">Semáforo</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(ETIQUETA_SEMAFORO) as SemaforoEstado[]).map((s) => (
              <label key={s} className={cx('flex cursor-pointer items-center gap-1 rounded-full border px-1 py-px', estado === s ? 'border-accent' : 'border-transparent')}>
                <input type="radio" name="estado" value={s} checked={estado === s} onChange={() => setEstado(s)} className="sr-only" />
                <EstadoSemaforo estado={s} />
              </label>
            ))}
          </div>
        </fieldset>
        <label className="text-caption font-semibold text-ink-muted">{tx(t, 'decision', 'responsable')}
          <input name="responsable" required minLength={2} className="mt-1 block h-control-ckop w-full rounded-sm border border-line-strong bg-surface px-2 text-body-sm text-ink" /></label>
        <label className="text-caption font-semibold text-ink-muted">{tx(t, 'decision', 'precio')}
          <input name="precio" inputMode="numeric" className="mt-1 block h-control-ckop w-full rounded-sm border border-line-strong bg-surface px-2 font-mono text-data text-ink" /></label>
        <label className="text-caption font-semibold text-ink-muted">{tx(t, 'decision', 'nota')}
          <textarea name="nota" required minLength={10} rows={3} className="mt-1 block w-full rounded-sm border border-line-strong bg-surface p-2 text-body-sm text-ink" /></label>
        <Button type="submit" disabled={!puedeDecidir} className="!min-h-0 h-control-ckop">{tx(t, 'decision', 'guardar')}</Button>
        {!puedeDecidir && <p className="text-caption text-ink-muted">Disponible para el equipo de B&A con datos reales.</p>}
        <p aria-live="polite" className="text-body-sm">{resultado}</p>
      </form>
    </section>
  );
}
