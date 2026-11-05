'use client';
import Link from 'next/link';
import { useId, useState, type FormEvent } from 'react';
import { Button, cx } from './ui';

export type Campo = { nombre: string; etiqueta: string; tipo?: 'text' | 'email' | 'textarea' | 'select'; requerido?: boolean; opciones?: { v: string; t: string }[]; autocompletar?: string; valor?: string };
export type TextosFormulario = Record<string, string>;
export type Autorizacion = { version: string; texto: string; enlace: string; obligatoria: string };

export function FormField({ campo }: { campo: Campo }) {
  const id = useId();
  const comunes = 'mt-1 w-full rounded-[var(--radio,8px)] border border-line-strong bg-surface px-3 text-body text-ink min-h-touch md:min-h-control';
  return (
    <div>
      <label htmlFor={id} className="text-label font-semibold">
        {campo.etiqueta}{campo.requerido && <span aria-hidden="true"> *</span>}
      </label>
      {campo.tipo === 'textarea' ? (
        <textarea id={id} name={campo.nombre} required={campo.requerido} rows={4} className={cx(comunes, 'py-2')} defaultValue={campo.valor} />
      ) : campo.tipo === 'select' ? (
        <select id={id} name={campo.nombre} required={campo.requerido} className={comunes} defaultValue={campo.valor ?? ''}>
          <option value="" disabled>Selecciona una opción</option>
          {campo.opciones?.map((o) => <option key={o.v} value={o.v}>{o.t}</option>)}
        </select>
      ) : (
        <input id={id} name={campo.nombre} type={campo.tipo ?? 'text'} required={campo.requerido} autoComplete={campo.autocompletar} className={comunes} defaultValue={campo.valor} />
      )}
    </div>
  );
}

/** Casilla Ley 1581: nunca premarcada, finalidad explícita y enlace a /privacidad. */
export function CasillaAutorizacion1581({ a, marcada, onCambio, error }: { a: Autorizacion; marcada: boolean; onCambio: (v: boolean) => void; error: boolean }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-start gap-3">
        <input id={id} type="checkbox" name="autorizacion" checked={marcada} onChange={(e) => onCambio(e.target.checked)}
          aria-describedby={error ? `${id}-err` : undefined} aria-invalid={error || undefined}
          className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent)]" />
        <label htmlFor={id} className="text-body-sm">
          {a.texto} <Link href="/privacidad" className="enlace">{a.enlace}</Link>.
        </label>
      </div>
      {error && <p id={`${id}-err`} className="mt-1 text-body-sm font-semibold text-noir">{a.obligatoria}</p>}
    </div>
  );
}

/** Formulario: envía a /api/formularios. Sin autorización no envía; sin destino configurado lo dice y no envía. */
export function Formulario({ tipo, campos, textos, autorizacion, activo, extra }: {
  tipo: 'lista_espera' | 'cotizacion' | 'contacto'; campos: Campo[]; textos: TextosFormulario; autorizacion: Autorizacion; activo: boolean; extra?: Record<string, string>;
}) {
  const [marcada, setMarcada] = useState(false);
  const [estado, setEstado] = useState<'reposo' | 'enviando' | 'ok' | 'error' | 'sin_autorizacion'>('reposo');

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!activo) return;
    if (!marcada) { setEstado('sin_autorizacion'); return; }
    setEstado('enviando');
    const datos = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const r = await fetch('/api/formularios', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...datos, ...extra, tipo, autorizacion: true, version_autorizacion: autorizacion.version, origen: window.location.pathname }),
      });
      setEstado(r.ok ? 'ok' : 'error');
    } catch { setEstado('error'); }
  }

  if (estado === 'ok') return <p role="status" className="rounded-[var(--radio,8px)] bg-viable-soft p-4 font-semibold text-viable">{textos.ok}</p>;

  return (
    <form onSubmit={enviar} noValidate={false} className="grid max-w-xl gap-4">
      {campos.map((c) => <FormField key={c.nombre} campo={c} />)}
      {/* Campo trampa anti-spam: invisible para personas */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>No llenar<input type="text" name="sitio_web" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <CasillaAutorizacion1581 a={autorizacion} marcada={marcada} onCambio={(v) => { setMarcada(v); if (v && estado === 'sin_autorizacion') setEstado('reposo'); }} error={estado === 'sin_autorizacion'} />
      <div aria-live="polite">
        {estado === 'error' && <p className="mb-2 text-body-sm font-semibold text-noir">{textos.error}</p>}
      </div>
      <div>
        <Button type="submit" disabled={!activo || estado === 'enviando'}>
          {!activo ? textos.sin_endpoint : estado === 'enviando' ? textos.enviando : textos.enviar}
        </Button>
      </div>
    </form>
  );
}
