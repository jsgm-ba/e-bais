import type { Metadata } from 'next';
import Link from 'next/link';
import { Marco } from '@/components/Marco';
import { contenido, cursos } from '@/lib/content';
import { sesionActual } from '@/lib/supabase/server';

const a = contenido.eva.aprender;
export const metadata: Metadata = { title: 'Aprender · EVA', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function Aprender() {
  const sesion = await sesionActual();
  const lista = cursos();
  return (
    <Marco s="eva">
      <div className="contenedor py-12">
        <h1 className="font-eva text-display-eva font-semibold">{a.titulo}</h1>
        <p className="mt-2 text-body-lg text-ink-muted">{sesion ? a.bajada : a.sin_sesion}</p>
        {lista.length === 0 ? <p className="mt-8">{a.sin_cursos}</p> : (
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {lista.map((c) => (
              <li key={c.slug} className="rounded-lg border border-line bg-surface-raised p-6">
                <p className="text-caption font-semibold text-ink-muted">{c.duracion_h} horas · {c.modulos.length} módulos</p>
                <h2 className="mt-2 font-eva text-h-eva font-semibold"><Link href={`/eva/aprender/${c.slug}`} className="hover:text-accent">{c.titulo}</Link></h2>
                <p className="mt-2 text-body-sm">{c.promesa}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Marco>
  );
}
