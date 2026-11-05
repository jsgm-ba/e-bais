/** Cifras y fechas en es-CO (DESIGN_SYSTEM.md §Voz y contenido). */
const nf = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });
const MESES = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'];

/** $ 48.200.000 */
export const cop = (n: number | null | undefined) => (n == null ? 'SIN DATO' : `$ ${nf.format(n)}`);
export const numero = (n: number) => nf.format(n);

/** 30 oct. 2026, en hora de Bogotá. */
export function fecha(iso: string | Date): string {
  const d = bogota(iso);
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** D-3 · 14:00 (días hasta el cierre y hora de Bogotá). */
export function plazo(iso: string, ahora: Date = new Date()): string {
  const c = bogota(iso);
  const h = bogota(ahora);
  const dia = (x: Date) => Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate());
  const dias = Math.round((dia(c) - dia(h)) / 86_400_000);
  const hora = `${String(c.getUTCHours()).padStart(2, '0')}:${String(c.getUTCMinutes()).padStart(2, '0')}`;
  const etiqueta = dias < 0 ? 'Cerrado' : dias === 0 ? 'Hoy' : `D-${dias}`;
  return `${etiqueta} · ${hora}`;
}

export function diasHasta(iso: string, ahora: Date = new Date()): number {
  return Math.ceil((new Date(iso).getTime() - ahora.getTime()) / 86_400_000);
}

/** Bogotá es UTC-5 todo el año. Devuelve una fecha cuyos campos UTC son la hora local de Bogotá. */
function bogota(v: string | Date): Date {
  const d = typeof v === 'string' ? new Date(v) : v;
  return new Date(d.getTime() - 5 * 3_600_000);
}
