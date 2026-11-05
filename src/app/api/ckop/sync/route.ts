import { NextResponse } from 'next/server';
import { leerMaestro, sheetsConfigurado } from '@/lib/sheets';
import { clienteAdmin } from '@/lib/supabase/server';

/** Vercel Cron: copia SEMÁFORO 2026-2 del Sheets Maestro a ckop_proceso. Protegido con CRON_SECRET. */
export async function GET(req: Request) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || req.headers.get('authorization') !== `Bearer ${secreto}`) return NextResponse.json({ error: 'no_autorizado' }, { status: 401 });
  if (!sheetsConfigurado()) return NextResponse.json({ error: 'sheets_sin_configurar' }, { status: 503 });
  const sb = clienteAdmin();
  if (!sb) return NextResponse.json({ error: 'base_sin_configurar' }, { status: 503 });
  const filas = await leerMaestro();
  const { error } = await sb.from('ckop_proceso').upsert(filas.map((f) => ({ codigo: f.codigo, entidad: f.entidad, objeto: f.objeto, valor: f.valor, cierre: f.cierre, estado: f.estado, url: f.url ?? null, modalidad: f.modalidad ?? null, responsable: f.responsable ?? null, estado_secop: f.estado_secop ?? null, hojas: f.hojas ?? [], hitos: f.hitos ?? [], origen: 'maestro', sincronizado: new Date().toISOString() })), { onConflict: 'codigo' });
  if (error) return NextResponse.json({ error: 'base', detalle: error.message }, { status: 500 });
  await sb.from('ckop_bitacora').insert({ evento: 'sincronizacion_maestro', detalle: { filas: filas.length } });
  return NextResponse.json({ ok: true, filas: filas.length });
}
