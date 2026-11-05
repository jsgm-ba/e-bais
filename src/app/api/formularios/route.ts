import { NextResponse } from 'next/server';
import { z } from 'zod';
import { clienteAdmin } from '@/lib/supabase/server';

const Base = z.object({
  nombre: z.string().trim().min(2).max(120),
  correo: z.string().trim().email().max(200),
  autorizacion: z.literal(true),
  version_autorizacion: z.string().max(60),
  origen: z.string().max(200),
  sitio_web: z.string().max(0).optional().or(z.literal('')), // campo trampa
});
const Entrada = z.discriminatedUnion('tipo', [
  Base.extend({ tipo: z.literal('lista_espera'), perfil: z.string().max(40), producto_id: z.string().max(10).optional().or(z.literal('')) }),
  Base.extend({ tipo: z.literal('cotizacion'), organizacion: z.string().max(200).optional(), motivo: z.string().max(40), mensaje: z.string().max(4000).optional() }),
]);

const FINALIDAD = {
  lista_espera: 'Avisar la apertura de productos de EVA elegidos por el titular',
  cotizacion: 'Responder la solicitud de cotización o contacto',
} as const;

/** Recibe formularios. Sin autorización Ley 1581 no guarda nada. Destino: Supabase o, si no, el endpoint externo. */
export async function POST(req: Request) {
  const cuerpo = await req.json().catch(() => null);
  if (cuerpo?.sitio_web) return NextResponse.json({ ok: true }); // bot: se ignora en silencio
  const d = Entrada.safeParse(cuerpo);
  if (!d.success) return NextResponse.json({ error: 'entrada_invalida' }, { status: 400 });
  const v = d.data;

  const sb = clienteAdmin();
  if (sb) {
    const { data: aut, error: e1 } = await sb.from('autorizacion_datos')
      .insert({ correo: v.correo, finalidad: FINALIDAD[v.tipo], version_texto: v.version_autorizacion, origen: v.origen }).select('id').single();
    if (e1 || !aut) return NextResponse.json({ error: 'base' }, { status: 500 });
    const { error } = v.tipo === 'lista_espera'
      ? await sb.from('lista_espera').insert({ nombre: v.nombre, correo: v.correo, perfil: v.perfil, producto_id: v.producto_id || null, autorizacion_id: aut.id })
      : await sb.from('solicitud_cotizacion').insert({ nombre: v.nombre, correo: v.correo, organizacion: v.organizacion ?? null, motivo: v.motivo, mensaje: v.mensaje ?? null, autorizacion_id: aut.id });
    return error ? NextResponse.json({ error: 'base' }, { status: 500 }) : NextResponse.json({ ok: true });
  }

  const externo = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
  if (externo) {
    const r = await fetch(externo, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...v, finalidad: FINALIDAD[v.tipo], recibido: new Date().toISOString() }) });
    return r.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'externo' }, { status: 502 });
  }
  return NextResponse.json({ error: 'sin_destino', mensaje: 'Formulario en preparación' }, { status: 503 });
}
