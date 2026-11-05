'use client';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { Curso } from '@/lib/content/schemas';
import { IconoCheck } from './Iconos';
import { Button, cx, partes } from './ui';

type Textos = Record<string, string>;
const TIPO: Record<string, string> = { concepto: 'Marco conceptual', norma: 'Marco normativo', como: 'El cómo', practica: 'Práctica' };

function Parrafo({ texto, preview }: { texto: string; preview: boolean }) {
  return <>{partes(texto).map((p, i) => p.pendiente ? (preview ? <mark key={i} className="rounded-sm bg-revisar-soft px-1 text-revisar">Pendiente: {p.t}</mark> : null) : <span key={i}>{p.t}</span>)}</>;
}

/** Reproductor del curso: módulos, lecciones, avance, evaluación y tutor IA. Con sesión guarda en Supabase; sin sesión, en el navegador. */
export function CursoPlayer({ curso, conSesion, tutorActivo, preview, textos }: { curso: Curso; conSesion: boolean; tutorActivo: boolean; preview: boolean; textos: Textos }) {
  const lecciones = useMemo(() => curso.modulos.flatMap((m) => m.lecciones.map((l) => ({ ...l, modulo: m.titulo }))), [curso]);
  const [actual, setActual] = useState(0);
  const [hechas, setHechas] = useState<Set<string>>(new Set());
  const [enEvaluacion, setEnEvaluacion] = useState(false);
  const clave = `eva-avance-${curso.slug}`;

  useEffect(() => {
    try { const g = localStorage.getItem(clave); if (g) setHechas(new Set(JSON.parse(g))); } catch { /* sin almacenamiento */ }
  }, [clave]);

  async function completar(id: string) {
    const n = new Set(hechas).add(id);
    setHechas(n);
    try { localStorage.setItem(clave, JSON.stringify([...n])); } catch { /* sin almacenamiento */ }
    if (conSesion) await fetch('/api/eva/avance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accion: 'leccion', curso: curso.slug, leccion: id }) }).catch(() => null);
    if (actual < lecciones.length - 1) setActual(actual + 1); else setEnEvaluacion(true);
  }

  const l = lecciones[actual]!;
  const pct = Math.round((hechas.size / lecciones.length) * 100);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <nav aria-label="Contenido del curso" className="h-fit rounded-lg border border-line bg-surface-sunken p-4">
        <div className="mb-4">
          <p className="text-caption font-semibold text-ink-muted">Avance: {pct}%</p>
          <div className="mt-1 h-2 rounded-full bg-surface" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Avance del curso">
            <div className="h-2 rounded-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <ol className="grid gap-4">
          {curso.modulos.map((m) => (
            <li key={m.id}>
              <p className="text-label font-semibold">{m.titulo}</p>
              <ol className="mt-2 grid gap-1">
                {m.lecciones.map((x) => {
                  const i = lecciones.findIndex((y) => y.id === x.id);
                  return (
                    <li key={x.id}>
                      <button type="button" onClick={() => { setActual(i); setEnEvaluacion(false); }} aria-current={!enEvaluacion && i === actual ? 'step' : undefined}
                        className={cx('flex min-h-touch w-full items-center gap-2 rounded-lg px-2 text-left text-body-sm md:min-h-control', !enEvaluacion && i === actual ? 'bg-accent-soft font-semibold text-accent' : 'hover:bg-accent-soft')}>
                        {hechas.has(x.id) ? <IconoCheck className="shrink-0 text-viable" /> : <span className="h-4 w-4 shrink-0 rounded-full border border-line-strong" aria-hidden="true" />}
                        <span>{x.titulo}{hechas.has(x.id) && <span className="sr-only"> (completada)</span>}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </li>
          ))}
          <li>
            <button type="button" onClick={() => setEnEvaluacion(true)} aria-current={enEvaluacion ? 'step' : undefined}
              className={cx('min-h-touch w-full rounded-lg px-2 text-left text-label font-semibold md:min-h-control', enEvaluacion ? 'bg-accent-soft text-accent' : 'hover:bg-accent-soft')}>Evaluación final</button>
          </li>
        </ol>
      </nav>

      <div>
        {enEvaluacion ? <Evaluacion curso={curso} conSesion={conSesion} /> : (
          <article aria-labelledby="leccion-t">
            <p className="text-caption font-semibold uppercase tracking-wide text-accent">{TIPO[l.tipo]} · {l.modulo}</p>
            <h2 id="leccion-t" className="mt-2 font-eva text-h2 font-semibold">{l.titulo}</h2>
            <div className="prosa mt-4 max-w-measure text-body-lg">{l.parrafos.map((p, i) => <p key={i}><Parrafo texto={p} preview={preview} /></p>)}</div>
            {l.piramide && (
              <ol className="mt-6 grid max-w-2xl gap-2" aria-label="Pirámide normativa, de mayor a menor jerarquía">
                {l.piramide.map((n, i) => (
                  <li key={n.nivel} className="rounded-lg border border-line bg-surface-raised p-3">
                    <span className="text-caption font-semibold uppercase tracking-wide text-accent">{i + 1}. {n.nivel}</span>
                    <span className="mt-1 block text-body-sm"><Parrafo texto={n.norma} preview={preview} /></span>
                  </li>
                ))}
              </ol>
            )}
            {l.actividad && (
              <div className="mt-6 max-w-measure rounded-lg border border-accent bg-accent-soft p-4">
                <p className="text-label font-semibold text-accent">Actividad</p>
                <p className="mt-1">{l.actividad}</p>
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => completar(l.id)}>{actual < lecciones.length - 1 ? 'Marcar como completada y seguir' : 'Completar e ir a la evaluación'}</Button>
              {actual > 0 && <Button variante="secundario" onClick={() => setActual(actual - 1)}>Lección anterior</Button>}
            </div>
            <Tutor curso={curso.slug} leccion={l.id} activo={tutorActivo} textos={textos} />
          </article>
        )}
      </div>
    </div>
  );
}

function Evaluacion({ curso, conSesion }: { curso: Curso; conSesion: boolean }) {
  const [resp, setResp] = useState<(number | null)[]>(curso.evaluacion.map(() => null));
  const [resultado, setResultado] = useState<{ aciertos: number; total: number; aprobado: boolean; guardado: boolean } | null>(null);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (resp.some((r) => r === null)) return;
    if (conSesion) {
      const r = await fetch('/api/eva/avance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accion: 'evaluacion', curso: curso.slug, respuestas: resp }) }).catch(() => null);
      if (r?.ok) { setResultado({ ...(await r.json()), guardado: true }); return; }
    }
    const aciertos = curso.evaluacion.filter((q, i) => resp[i] === q.correcta).length;
    setResultado({ aciertos, total: curso.evaluacion.length, aprobado: aciertos >= curso.aprobacion_minima, guardado: false });
  }

  return (
    <form onSubmit={enviar} aria-labelledby="eval-t">
      <h2 id="eval-t" className="font-eva text-h2 font-semibold">Evaluación final</h2>
      <p className="mt-2 text-ink-muted">{curso.constancia}</p>
      <div className="mt-6 grid gap-6">
        {curso.evaluacion.map((q, i) => (
          <fieldset key={q.id} className="rounded-lg border border-line p-4">
            <legend className="px-1 font-semibold">{i + 1}. {q.pregunta}</legend>
            <div className="mt-2 grid gap-2">
              {q.opciones.map((o, j) => (
                <label key={j} className="flex min-h-touch cursor-pointer items-center gap-3 rounded-lg px-2 hover:bg-accent-soft md:min-h-control">
                  <input type="radio" name={q.id} checked={resp[i] === j} onChange={() => setResp(resp.map((r, k) => (k === i ? j : r)))} className="h-5 w-5 accent-[var(--accent)]" />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <Button type="submit" className="mt-6" disabled={resp.some((r) => r === null)}>Enviar respuestas</Button>
      <div aria-live="polite" className="mt-4">
        {resultado && (
          <p className={cx('rounded-lg p-4 font-semibold', resultado.aprobado ? 'bg-viable-soft text-viable' : 'bg-revisar-soft text-revisar')}>
            {resultado.aciertos} de {resultado.total} correctas. {resultado.aprobado ? 'Aprobaste.' : 'Repasa las lecciones e intenta de nuevo.'}
            {!resultado.guardado && ' Resultado no guardado: ingresa con tu correo para registrar tu constancia.'}
          </p>
        )}
      </div>
    </form>
  );
}

function Tutor({ curso, leccion, activo, textos }: { curso: string; leccion: string; activo: boolean; textos: Textos }) {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  useEffect(() => { setRespuesta(null); setPregunta(''); }, [leccion]);

  async function preguntar(e: FormEvent) {
    e.preventDefault();
    setCargando(true);
    const r = await fetch('/api/eva/tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ curso, leccion, pregunta }) }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setRespuesta(j.respuesta ?? 'El tutor no está disponible en este momento.');
    setCargando(false);
  }

  return (
    <aside aria-labelledby="tutor-t" className="mt-10 max-w-measure rounded-lg border border-line bg-surface-sunken p-4">
      <h3 id="tutor-t" className="font-eva text-h4 font-semibold">{textos.titulo}</h3>
      <p className="mt-1 text-caption font-semibold text-revisar">{textos.aviso}</p>
      {!activo ? <p className="mt-2 text-body-sm text-ink-muted">{textos.apagado}</p> : (
        <form onSubmit={preguntar} className="mt-3 grid gap-2">
          <label htmlFor="tutor-q" className="sr-only">{textos.placeholder}</label>
          <textarea id="tutor-q" value={pregunta} onChange={(e) => setPregunta(e.target.value)} rows={3} maxLength={600} placeholder={textos.placeholder}
            className="w-full rounded-lg border border-line-strong bg-surface p-2" />
          <Button type="submit" disabled={cargando || pregunta.trim().length < 3} className="w-fit">{cargando ? 'Pensando' : 'Preguntar'}</Button>
          <div aria-live="polite">{respuesta && <p className="mt-2 whitespace-pre-line rounded-lg bg-surface p-3 text-body-sm">{respuesta}</p>}</div>
        </form>
      )}
    </aside>
  );
}
