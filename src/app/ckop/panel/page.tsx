import type { Metadata } from 'next';
import { Marco } from '@/components/Marco';
import { PanelCKOP } from '@/components/PanelCKOP';
import { contenido } from '@/lib/content';
import type { FilaProceso } from '@/lib/content/schemas';
import { esPreview } from '@/lib/preview';
import { radarSecop } from '@/lib/secop';
import { leerMaestro, sheetsConfigurado } from '@/lib/sheets';
import { clienteServidor, esEquipo, sesionActual } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Panel · CKOP', robots: { index: false } };
export const dynamic = 'force-dynamic';

/**
 * Orden de las fuentes: caché en Supabase (sincronizada por cron) → lectura directa del Sheets Maestro → datos de ejemplo (solo vista previa).
 */
async function cargarProcesos(equipo: boolean): Promise<{ filas: FilaProceso[]; ejemplo: boolean }> {
  if (equipo) {
    const sb = await clienteServidor();
    const { data } = (await sb?.from('ckop_proceso').select('codigo,entidad,objeto,valor,cierre,estado,url,modalidad,responsable,estado_secop,hojas,hitos').order('cierre')) ?? { data: null };
    if (data?.length) return { filas: data.map((d) => ({ ...d, url: d.url ?? undefined, modalidad: d.modalidad ?? undefined, responsable: d.responsable ?? undefined, estado_secop: d.estado_secop ?? undefined, hojas: d.hojas ?? undefined, hitos: d.hitos ?? [] })) as FilaProceso[], ejemplo: false };
    if (sheetsConfigurado()) {
      try { return { filas: await leerMaestro(), ejemplo: false }; } catch { /* cae a ejemplo */ }
    }
  }
  return { filas: esPreview() ? contenido.ckopDemo.filas : [], ejemplo: true };
}

export default async function Panel() {
  const sesion = await sesionActual();
  const equipo = esEquipo(sesion);
  const p = contenido.ckop.panel;
  if (!equipo && !esPreview()) {
    return <Marco s="ckop"><div className="contenedor-wide py-12"><h1 className="text-h2 font-semibold">{p.titulo}</h1><p className="mt-4 max-w-measure">{p.sin_permiso}</p></div></Marco>;
  }
  const [{ filas, ejemplo }, radar] = await Promise.all([cargarProcesos(equipo), equipo ? radarSecop() : Promise.resolve({ ok: false as const, error: 'solo equipo B&A' })]);
  return (
    <Marco s="ckop" borrador={ejemplo}>
      <div className="contenedor-wide py-6">
        <h1 className="text-h3 font-semibold">{p.titulo}</h1>
        <div className="mt-4">
          <PanelCKOP filas={filas} radar={radar.ok ? { ok: true, filas: radar.filas } : { ok: false, filas: [], error: radar.error }}
            t={{ ...p, columnas: contenido.ckop.demo.columnas, dato_ejemplo: contenido.comun.estados.dato_ejemplo! }} puedeDecidir={equipo} ejemplo={ejemplo} />
        </div>
      </div>
    </Marco>
  );
}
