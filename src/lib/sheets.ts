import 'server-only';
import { JWT } from 'google-auth-library';
import type { FilaProceso } from './content/schemas';
import { aSemaforo } from './semaforo';

/**
 * Lectura del Sheets Maestro con una cuenta de servicio (solo lectura).
 * Los encabezados reales de SEMÁFORO 2026-2 se mapean por alias: confirmar con JSGM y ajustar ALIAS si cambian.
 */
export const ALIAS: Record<keyof Omit<FilaProceso, 'estado'> | 'estado', string[]> = {
  codigo: ['no. proceso', 'no proceso', 'proceso', 'codigo', 'codigo proceso', 'id proceso', 'referencia', 'numero de proceso', 'no. proceso'],
  entidad: ['entidad', 'entidad contratante', 'cliente'],
  objeto: ['objeto', 'objeto del proceso', 'descripcion', 'nombre del procedimiento'],
  valor: ['cuantia / presupuesto', 'cuantia', 'valor', 'presupuesto', 'cuantia', 'precio base', 'valor estimado'],
  cierre: ['fecha presentar propuesta', 'cierre', 'fecha cierre', 'fecha de cierre', 'presentacion de ofertas', 'fecha limite'],
  estado: ['semaforo', 'estado', 'decision', 'viabilidad'],
  url: ['url', 'enlace', 'link', 'url secop', 'secop ii', '–'],
  modalidad: ['modalidad', 'modalidad de contratacion'],
  responsable: ['responsable', 'encargado'],
};

/** Quita tildes, emoji y saltos: «🔔 Fecha Presentar Propuesta» → «fecha presentar propuesta». */
const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}\s./–-]/gu, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

export function aNumero(v: unknown): number | null {
  if (typeof v === 'number') return v;
  const s = String(v ?? '').replace(/[^\d,.-]/g, '');
  if (!s) return null;
  // es-CO: punto de miles, coma decimal.
  const n = Number(s.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? Math.round(n) : null;
}

export function aFechaISO(v: unknown): string | null {
  const s = String(v ?? '').trim();
  if (!s) return null;
  const m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (m) {
    const [, d, mes, a, h = '23', min = '59'] = m;
    return `${a}-${mes!.padStart(2, '0')}-${d!.padStart(2, '0')}T${h.padStart(2, '0')}:${min}:00-05:00`;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Convierte una matriz de valores (fila 0 = encabezados) en procesos. */
export function filasAProcesos(valores: unknown[][]): FilaProceso[] {
  const [enc = [], ...resto] = valores;
  const indice: Partial<Record<keyof typeof ALIAS, number>> = {};
  enc.forEach((h, i) => {
    const n = norm(String(h ?? ''));
    for (const [campo, alias] of Object.entries(ALIAS)) {
      // Coincidencia exacta, o prefijo para encabezados con leyenda («Semáforo ✅ | ‼️ | ❌»).
      if (indice[campo as keyof typeof ALIAS] === undefined && (alias.includes(n) || alias.some((a) => a.length > 4 && n.startsWith(`${a} `)))) indice[campo as keyof typeof ALIAS] = i;
    }
  });
  const celda = (fila: unknown[], c: keyof typeof ALIAS) => (indice[c] === undefined ? undefined : fila[indice[c]!]);
  return resto
    .filter((f) => f.some((c) => String(c ?? '').trim()))
    .map((f, i) => ({
      codigo: String(celda(f, 'codigo') ?? `FILA-${i + 2}`).trim(),
      entidad: String(celda(f, 'entidad') ?? 'SIN DATO').trim(),
      objeto: String(celda(f, 'objeto') ?? 'SIN DATO').trim(),
      valor: aNumero(celda(f, 'valor')),
      cierre: aFechaISO(celda(f, 'cierre')),
      estado: aSemaforo(celda(f, 'estado')),
      url: celda(f, 'url') ? String(celda(f, 'url')) : undefined,
      modalidad: celda(f, 'modalidad') ? String(celda(f, 'modalidad')) : undefined,
      responsable: celda(f, 'responsable') ? String(celda(f, 'responsable')) : undefined,
    }));
}

export const sheetsConfigurado = () => Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON && process.env.SHEETS_MAESTRO_ID);

export async function leerRango(rango: string): Promise<unknown[][]> {
  const cred = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);
  const jwt = new JWT({ email: cred.client_email, key: cred.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
  const { token } = await jwt.getAccessToken();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEETS_MAESTRO_ID}/values/${encodeURIComponent(rango)}?valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!r.ok) throw new Error(`Sheets respondió ${r.status}`);
  const j = (await r.json()) as { values?: unknown[][] };
  return j.values ?? [];
}

export async function leerSemaforo(): Promise<FilaProceso[]> {
  return filasAProcesos(await leerRango(process.env.SHEETS_RANGO_SEMAFORO ?? 'SEMÁFORO 2026-2!A1:Z1000'));
}
