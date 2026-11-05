import 'server-only';
import type { FilaProceso } from './content/schemas';

/**
 * Radar SECOP II desde datos abiertos (Socrata). Dataset «SECOP II - Procesos de Contratación» (p6dx-8zbt).
 * [[VERIFICAR]] los nombres de campo contra https://www.datos.gov.co/resource/p6dx-8zbt.json cuando la red del entorno lo permita.
 * Solo lectura: nada se envía a SECOP II desde el sistema.
 */
const DATASET = 'https://www.datos.gov.co/resource/p6dx-8zbt.json';
export const PALABRAS_RADAR = ['AUDITORIA', 'CONTROL INTERNO', 'MIPG', 'CAPACITACION', 'ISO', 'CONSULTORIA', 'FENECIMIENTO', 'SISTEMA DE GESTION'];

type RegistroSecop = Record<string, unknown> & { urlproceso?: { url?: string } };

export function construirConsulta(palabras = PALABRAS_RADAR, limite = 50): string {
  const like = palabras.map((p) => `upper(nombre_del_procedimiento) like '%${p.replace(/'/g, '')}%'`).join(' OR ');
  const p = new URLSearchParams({
    $select: 'id_del_proceso,referencia_del_proceso,entidad,nombre_del_procedimiento,precio_base,fecha_de_recepcion_de,modalidad_de_contratacion,urlproceso',
    $where: `fase = 'Presentación de oferta' AND (${like})`,
    $order: 'fecha_de_recepcion_de ASC',
    $limit: String(limite),
  });
  return `${DATASET}?${p.toString()}`;
}

export function aProceso(r: RegistroSecop): FilaProceso {
  const valor = Number(r.precio_base);
  return {
    codigo: String(r.referencia_del_proceso ?? r.id_del_proceso ?? 'SIN DATO'),
    entidad: String(r.entidad ?? 'SIN DATO'),
    objeto: String(r.nombre_del_procedimiento ?? 'SIN DATO'),
    valor: Number.isFinite(valor) ? valor : null,
    cierre: r.fecha_de_recepcion_de ? `${String(r.fecha_de_recepcion_de).slice(0, 19)}-05:00` : null,
    estado: null,
    url: r.urlproceso?.url,
    modalidad: r.modalidad_de_contratacion ? String(r.modalidad_de_contratacion) : undefined,
  };
}

export async function radarSecop(): Promise<{ ok: true; filas: FilaProceso[]; consultado: string } | { ok: false; error: string }> {
  try {
    const r = await fetch(construirConsulta(), { next: { revalidate: 3600 }, signal: AbortSignal.timeout(10_000) });
    if (!r.ok) return { ok: false, error: `datos.gov.co respondió ${r.status}` };
    const datos = (await r.json()) as RegistroSecop[];
    return { ok: true, filas: datos.map(aProceso), consultado: new Date().toISOString() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'sin conexión' };
  }
}
