import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CursoPlayer } from '@/components/CursoPlayer';
import { Marco } from '@/components/Marco';
import { contenido, curso as buscarCurso } from '@/lib/content';
import { esPreview } from '@/lib/preview';
import { sesionActual } from '@/lib/supabase/server';

export async function generateMetadata({ params }: { params: Promise<{ curso: string }> }): Promise<Metadata> {
  const c = buscarCurso((await params).curso);
  return { title: c ? `${c.titulo} · EVA` : 'EVA', robots: { index: false } };
}

export default async function CursoPagina({ params }: { params: Promise<{ curso: string }> }) {
  const c = buscarCurso((await params).curso);
  if (!c) notFound();
  const sesion = await sesionActual();
  return (
    <Marco s="eva" borrador={c.publicacion === 'borrador'}>
      <div className="contenedor py-8">
        <p className="text-caption font-semibold text-ink-muted">{c.duracion_h} horas · {c.producto_id}</p>
        <h1 className="mt-1 font-eva text-[28px] font-semibold leading-tight lg:text-display-eva">{c.titulo}</h1>
        <p className="mt-2 max-w-measure text-body-lg text-ink-muted">{c.promesa}</p>
        <p className="mt-2 max-w-measure text-body-sm"><strong>Te llevas:</strong> {c.entregable_final}</p>
        <div className="mt-8">
          <CursoPlayer curso={c} conSesion={Boolean(sesion)} tutorActivo={Boolean(process.env.ANTHROPIC_API_KEY)} preview={esPreview()} textos={contenido.eva.tutor} />
        </div>
      </div>
    </Marco>
  );
}
