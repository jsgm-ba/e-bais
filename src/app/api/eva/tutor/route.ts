import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { curso } from '@/lib/content';
import { esPreview } from '@/lib/preview';
import { sesionActual } from '@/lib/supabase/server';

/**
 * Tutor IA de EVA. Apagado si no hay ANTHROPIC_API_KEY. El tutor propone; la persona decide.
 * Modelo configurable con ANTHROPIC_MODEL (por defecto claude-opus-5-5, esfuerzo bajo para respuestas cortas).
 */
const Entrada = z.object({ curso: z.string().max(120), leccion: z.string().max(40), pregunta: z.string().trim().min(3).max(600) });
const MODELO = process.env.ANTHROPIC_MODEL ?? 'claude-opus-5-5';

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: 'tutor_apagado' }, { status: 503 });
  // Endpoint con costo: exige sesión, salvo en vista previa.
  if (!esPreview() && !(await sesionActual())) return NextResponse.json({ error: 'sin_sesion' }, { status: 401 });

  const datos = Entrada.safeParse(await req.json().catch(() => null));
  if (!datos.success) return NextResponse.json({ error: 'entrada_invalida' }, { status: 400 });
  const c = curso(datos.data.curso);
  const leccion = c?.modulos.flatMap((m) => m.lecciones).find((l) => l.id === datos.data.leccion);
  if (!c || !leccion) return NextResponse.json({ error: 'leccion_no_encontrada' }, { status: 404 });

  // System prompt estable por lección (primero, con cache_control): la pregunta va después, en messages.
  const contexto = [
    `Curso: ${c.titulo}`, `Lección: ${leccion.titulo}`, ...leccion.parrafos,
    ...(leccion.piramide ?? []).map((p) => `${p.nivel}: ${p.norma}`),
    leccion.actividad ? `Actividad: ${leccion.actividad}` : '',
  ].filter(Boolean).join('\n');
  const system = `Eres el tutor de EVA, la academia de B&A. Respondes en español de Colombia, tuteando, en máximo 120 palabras, sin emoji ni exclamaciones.
Reglas: responde solo con base en la lección; si la pregunta sale de ella o necesitas un dato que no está, dilo y sugiere verificar en la fuente oficial. No inventes normas, números de resolución ni cifras. No digas que B&A o EVA certifican. Recuerda que tú propones y la persona decide.

${contexto}`;

  const cliente = new Anthropic();
  try {
    const r = await cliente.beta.messages.create({
      model: MODELO,
      max_tokens: 1024,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low' },
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: datos.data.pregunta }],
    });
    if (r.stop_reason === 'refusal') return NextResponse.json({ respuesta: 'No puedo responder esa pregunta. Consulta con el docente del curso.' });
    const texto = r.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('\n').trim();
    return NextResponse.json({ respuesta: texto || 'Sin respuesta. Intenta formular la pregunta de otra forma.' });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return NextResponse.json({ error: 'limite' }, { status: 429 });
    if (e instanceof Anthropic.APIError) return NextResponse.json({ error: 'api', estado: e.status }, { status: 502 });
    return NextResponse.json({ error: 'red' }, { status: 502 });
  }
}
