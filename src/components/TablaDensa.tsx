import type { ReactNode } from 'react';
import { cx } from './ui';

export type Columna<T> = { clave: string; titulo: string; celda: (f: T) => ReactNode; numerica?: boolean; className?: string };

/** Tabla densa de CKOP: filas de 32px, cifras a la derecha en mono tabular, desplazamiento horizontal dentro de su contenedor. */
export function TablaDensa<T>({ columnas, filas, clave, titulo, vacio = 'Sin filas', onFila, seleccionada }: {
  columnas: Columna<T>[]; filas: T[]; clave: (f: T) => string; titulo: string; vacio?: string;
  onFila?: (f: T) => void; seleccionada?: string | null;
}) {
  return (
    <div className="overflow-x-auto rounded-sm border border-line" role="region" aria-label={titulo} tabIndex={0}>
      <table className="w-full min-w-[720px] border-collapse text-body-sm">
        <caption className="sr-only">{titulo}</caption>
        <thead className="bg-surface-sunken">
          <tr>
            {columnas.map((c) => (
              <th key={c.clave} scope="col" className={cx('h-row whitespace-nowrap border-b border-line-strong px-3 text-left text-caption font-semibold uppercase tracking-wide text-ink-muted', c.numerica && 'text-right')}>
                {c.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.length === 0 && (
            <tr><td colSpan={columnas.length} className="px-3 py-6 text-center text-ink-muted">{vacio}</td></tr>
          )}
          {filas.map((f) => {
            const k = clave(f);
            return (
              <tr key={k} className={cx('h-row border-b border-line hover:bg-accent-soft', seleccionada === k && 'bg-accent-soft')}
                aria-current={seleccionada === k ? true : undefined}>
                {columnas.map((c, i) => (
                  <td key={c.clave} className={cx('px-3 py-1 align-middle', (c.numerica || i === 0) && 'whitespace-nowrap', c.numerica && 'text-right font-mono text-data tabular', c.className)}>
                    {i === 0 && onFila ? (
                      <button type="button" onClick={() => onFila(f)} className="whitespace-nowrap text-left font-mono text-data text-accent underline-offset-2 hover:underline">
                        {c.celda(f)}
                      </button>
                    ) : c.celda(f)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
