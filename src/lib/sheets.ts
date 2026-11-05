import 'server-only';
import { JWT } from 'google-auth-library';
import type { FilaProceso } from './content/schemas';
import { aSemaforo } from './semaforo';

/**
 * Lectura del Sheets Maestro con una cuenta de servicio (solo lectura).
 * Los encabezados reales de SEMÁFORO 2026-2 se mapean por alias: confirmar con JSGM y ajustar ALIAS si cambian.
 */
export const ALIAS: Record<'codigo' | 'entidad' | 'objeto' | 'valor' | 'cierre' | 'estado' | 'url' | 'modalidad' | 'responsable' | 'estado_secop', string[]> = {
  codigo: ['no. proceso', 'no proceso', 'proceso', 'codigo', 'codigo proceso', 'id proceso', 'referencia', 'numero de proceso', 'no. proceso'],
  entidad: ['entidad', 'entidad contratante', 'cliente'],
  objeto: ['objeto', 'objeto del proceso', 'descripcion', 'nombre del procedimiento'],
  valor: ['cuantia / presupuesto', 'cuantia', 'valor', 'presupuesto', 'cuantia', 'precio base', 'valor estimado'],
  cierre: ['fecha presentar propuesta', 'cierre', 'fecha cierre', 'fecha de cierre', 'presentacion de ofertas', 'fecha limite'],
  estado: ['semaforo', 'estado', 'decision', 'viabilidad'],
  url: ['url', 'enlace', 'link', 'url secop', 'secop ii', '–'],
  modalidad: ['modalidad', 'modalidad de contratacion'],
  responsable: ['responsable', 'encargado'],
  estado_secop: ['estado secop', 'fase'],
};

/** Columnas de fechas del Maestro → hitos del flujo precontractual (docs/FLUJO_SECOP_II.md §7). */
export const HITOS: { t: string; alias: string[] }[] = [
  { t: 'Observaciones al proyecto de pliego', alias: ['fecha observaciones proyecto pliego'] },
  { t: 'Manifestar interés', alias: ['fecha manifestar interes'] },
  { t: 'Presentar oferta', alias: ['fecha presentar propuesta', 'cierre api', 'cierre'] },
  { t: 'Informe de evaluación', alias: ['fecha informe evaluacion'] },
  { t: 'Subsanación', alias: ['fecha subsanacion'] },
];

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
  const m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM|a\.?\s?m\.?|p\.?\s?m\.?)?)?/i);
  if (m) {
    const [, d, mes, a, hh, min = '59', ampm] = m;
    let h = hh === undefined ? 23 : Number(hh);
    if (ampm && /^p/i.test(ampm) && h < 12) h += 12;
    if (ampm && /^a/i.test(ampm) && h === 12) h = 0;
    return `${a}-${mes!.padStart(2, '0')}-${d!.padStart(2, '0')}T${String(h).padStart(2, '0')}:${min}:00-05:00`;
  }
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}T${iso[4] ?? '23'}:${iso[5] ?? '59'}:00-05:00`;
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
  const colHito = HITOS.map((h) => enc.findIndex((x) => h.alias.includes(norm(String(x ?? '')))));
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
      estado_secop: celda(f, 'estado_secop') ? String(celda(f, 'estado_secop')).trim() : undefined,
      hitos: HITOS.flatMap((h, k) => {
        const fecha = colHito[k]! >= 0 ? aFechaISO(f[colHito[k]!]) : null;
        return fecha ? [{ t: h.t, fecha }] : [];
      }),
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

/** Hojas del Maestro Licitaciones que alimentan el panel (configurable con SHEETS_PESTANAS). */
export const PESTANAS = () => (process.env.SHEETS_PESTANAS ?? 'SEMÁFORO 2026-2,OPORTUNIDADES').split(',').map((x) => x.trim()).filter(Boolean);

/** Une procesos de varias hojas; si un código se repite, gana la primera hoja de la lista. */
export function unirHojas(porHoja: { hoja: string; filas: FilaProceso[] }[]): FilaProceso[] {
  const vistos = new Map<string, FilaProceso>();
  for (const { hoja, filas } of porHoja) {
    for (const f of filas) {
      if (f.codigo.startsWith('FILA-') && f.objeto === 'SIN DATO') continue;
      const previo = vistos.get(f.codigo);
      if (previo) previo.hojas = [...(previo.hojas ?? []), hoja];
      else vistos.set(f.codigo, { ...f, hojas: [hoja] });
    }
  }
  return [...vistos.values()];
}

export async function leerMaestro(): Promise<FilaProceso[]> {
  const porHoja = await Promise.all(PESTANAS().map(async (hoja) => ({ hoja, filas: filasAProcesos(await leerRango(`${hoja}!A1:AE1000`)) })));
  return unirHojas(porHoja);
}

/** Compatibilidad: solo SEMÁFORO 2026-2. */
export async function leerSemaforo(): Promise<FilaProceso[]> {
  return filasAProcesos(await leerRango(process.env.SHEETS_RANGO_SEMAFORO ?? 'SEMÁFORO 2026-2!A1:AE1000'));
}
