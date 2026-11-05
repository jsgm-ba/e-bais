import { NextResponse } from 'next/server';
import { z } from 'zod';
import { SemaforoEstado } from '@/lib/content/schemas';
import { clienteServidor, esEquipo, sesionActual } from '@/lib/supabase/server';

const Entrada = z.object({
  codigo: z.string().min(1).max(120),
  estado: SemaforoEstado,
  responsable: z.string().trim().min(2).max(120),
  precio_propuesto: z.number().int().nonnegative().nullable(),
  justificacion: z.string().trim().min(10).max(4000),
});

/** Registra la decisión humana sobre un proceso. Nada se envía a SECOP II. */
export async function POST(req: Request) {
  const sesion = await sesionActual();
  if (!esEquipo(sesion)) return NextResponse.json({ error: 'sin_permiso' }, { status: 403 });
  const d = Entrada.safeParse(await req.json().catch(() => null));
  if (!d.success) return NextResponse.json({ error: 'entrada_invalida', detalle: d.error.issues.map((i) => i.path.join('.')) }, { status: 400 });
  const sb = (await clienteServidor())!;
  const { error } = await sb.from('ckop_decision').insert({ ...d.data, propuesta_por: 'persona', aprobada_por: sesion!.id, autor: sesion!.id });
  if (error) return NextResponse.json({ error: 'base', detalle: error.message }, { status: 500 });
  await sb.from('ckop_bitacora').insert({ evento: 'decision', detalle: { codigo: d.data.codigo, estado: d.data.estado }, autor: sesion!.id });
  return NextResponse.json({ ok: true });
}
