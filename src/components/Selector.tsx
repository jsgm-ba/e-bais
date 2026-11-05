'use client';
import { useRef, type KeyboardEvent } from 'react';
import { cx } from './ui';

/** Grupo de opciones con patrón radiogroup (flechas para moverse, una sola opción en la secuencia de tabulación). */
export function Selector({ etiqueta, opciones, valor, onCambio, idEtiqueta }: {
  etiqueta: string; idEtiqueta: string; opciones: { id: string; texto: string }[]; valor: string | null; onCambio: (id: string | null) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const activo = Math.max(0, opciones.findIndex((o) => o.id === valor));
  function tecla(e: KeyboardEvent, i: number) {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const j = (i + d + opciones.length) % opciones.length;
    refs.current[j]?.focus();
    onCambio(opciones[j]!.id);
  }
  return (
    <div>
      <p id={idEtiqueta} className="mb-3 text-h4 font-semibold">{etiqueta}</p>
      <div role="radiogroup" aria-labelledby={idEtiqueta} className="flex flex-wrap gap-2">
        {opciones.map((o, i) => {
          const sel = o.id === valor;
          return (
            <button key={o.id} ref={(el) => { refs.current[i] = el; }} type="button" role="radio" aria-checked={sel}
              tabIndex={i === activo ? 0 : -1} onKeyDown={(e) => tecla(e, i)} onClick={() => onCambio(sel ? null : o.id)}
              className={cx('min-h-touch rounded-full border px-4 text-label font-medium md:min-h-control',
                sel ? 'border-accent bg-accent text-on-accent' : 'border-line-strong bg-surface text-ink hover:bg-accent-soft')}>
              {o.texto}
            </button>
          );
        })}
      </div>
    </div>
  );
}
