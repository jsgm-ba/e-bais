import { NextResponse } from 'next/server';
import { z } from 'zod';
import { curso } from '@/lib/content';
import { clienteServidor } from '@/lib/supabase/server';

const Entrada = z.discriminatedUnion('accion', [
  z.object({ accion: z.literal('leccion'), curso: z.string(), leccion: z.string() }),
  z.object({ accion: z.literal('evaluacion'), curso: z.string(), respuestas: z.array(z.number().int()) }),
]);

/** Guarda avance y evaluación del participante. Sin Supabase, el cliente guarda el avance en su navegador. */
export async function POST(req: Request) {
  const sb = await clienteServidor();
  if (!sb) return NextResponse.json({ error: 'sin_base' }, { status: 503 });
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return NextResponse.json({ error: 'sin_sesion' }, { status: 401 });
  const d = Entrada.safeParse(await req.json().catch(() => null));
  if (!d.success) return NextResponse.json({ error: 'entrada_invalida' }, { status: 400 });
  const c = curso(d.data.curso);
  if (!c) return NextResponse.json({ error: 'curso_no_encontrado' }, { status: 404 });

  await sb.from('inscripcion').upsert({ usuario: u.user.id, curso: c.slug });
  if (d.data.accion === 'leccion') {
    if (!c.modulos.some((m) => m.lecciones.some((l) => l.id === (d.data as { leccion: string }).leccion))) return NextResponse.json({ error: 'leccion' }, { status: 400 });
    const { error } = await sb.from('avance').upsert({ usuario: u.user.id, curso: c.slug, leccion: d.data.leccion });
    return error ? NextResponse.json({ error: 'base' }, { status: 500 }) : NextResponse.json({ ok: true });
  }
  // La nota se calcula en el servidor: el cliente no decide si aprobó.
  const aciertos = c.evaluacion.filter((q, i) => d.data.accion === 'evaluacion' && d.data.respuestas[i] === q.correcta).length;
  const aprobado = aciertos >= c.aprobacion_minima;
  const { error } = await sb.from('evaluacion_intento').insert({ usuario: u.user.id, curso: c.slug, aciertos, total: c.evaluacion.length, aprobado });
  return error ? NextResponse.json({ error: 'base' }, { status: 500 }) : NextResponse.json({ aciertos, total: c.evaluacion.length, aprobado });
}
