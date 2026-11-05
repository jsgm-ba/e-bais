import type { SemaforoEstado } from './content/schemas';

export const ETIQUETA_SEMAFORO: Record<SemaforoEstado, string> = { viable: 'Viable', revisar: 'Revisar', noir: 'No ir' };

/** Normaliza el texto del Sheets Maestro (VIABLE, Revisar, NO IR, verde...) al estado del sistema. */
export function aSemaforo(v: unknown): SemaforoEstado | null {
  const crudo = String(v ?? '');
  if (crudo.includes('❌') || crudo.includes('😡')) return 'noir';
  if (crudo.includes('✅')) return 'viable';
  if (crudo.includes('‼') || crudo.includes('🔍')) return 'revisar';
  const s = crudo.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
  if (!s) return null;
  if (/^(viable|verde|go|si)\b/.test(s)) return 'viable';
  if (/^(revisar|amarillo|ambar|evaluar|pendiente)\b/.test(s)) return 'revisar';
  if (/^(no ir|no-ir|noir|rojo|no go|descartar|descartado|no)\b/.test(s)) return 'noir';
  return null;
}
