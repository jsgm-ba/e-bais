import type { FilaProceso, Hito } from './content/schemas';
import { diasHasta } from './formato';

/** Próximo hito pendiente de un proceso (el primero con fecha futura). */
export function proximoHito(f: Pick<FilaProceso, 'hitos'>, ahora: Date = new Date()): Hito | null {
  const futuros = (f.hitos ?? []).filter((h) => new Date(h.fecha).getTime() >= ahora.getTime());
  futuros.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  return futuros[0] ?? null;
}

/** Hitos que vencen en los próximos n días (para alertas D-3, D-2, D-1). */
export function hitosUrgentes(filas: FilaProceso[], dias = 3, ahora: Date = new Date()) {
  return filas.flatMap((f) => (f.hitos ?? []).filter((h) => { const d = diasHasta(h.fecha, ahora); return d >= 0 && d <= dias; }).map((h) => ({ codigo: f.codigo, ...h })));
}
