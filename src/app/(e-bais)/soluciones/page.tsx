import type { Metadata } from 'next';
import Link from 'next/link';
import { Marco } from '@/components/Marco';
import { EnPreparacion, LinkButton } from '@/components/ui';
import { contenido, visible } from '@/lib/content';

const s = contenido.soluciones;
export const metadata: Metadata = { title: s.meta.title, description: s.meta.description, alternates: { canonical: '/soluciones' } };

export default function Soluciones() {
  if (!visible(s._estado)) return <Marco s="hub"><EnPreparacion /></Marco>;
  return (
    <Marco s="hub" borrador={s._estado.publicacion === 'borrador'}>
      <div className="contenedor py-12 lg:py-16">
        <h1 className="max-w-4xl text-h2 font-bold lg:text-[40px]">{s.hero.titular}</h1>
        <p className="mt-4 max-w-measure text-body-lg text-ink-muted">{s.hero.bajada}</p>
        <p className="mt-6 max-w-measure rounded-md border border-line bg-surface-sunken p-4 text-body-sm">{s.principio}</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {s.items.map((x) => (
            <li key={x.slug} className="relative flex flex-col rounded-md border border-line bg-surface-raised p-6 shadow-1 hover:shadow-2">
              <h2 className="text-h3 font-semibold"><Link href={`/soluciones/${x.slug}`} className="no-underline after:absolute after:inset-0 hover:text-accent">{x.titulo}</Link></h2>
              <p className="mt-2 text-ink-muted">{x.problema}</p>
              <p className="mt-3 text-body-sm"><strong>Resultado:</strong> {x.resultado}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <LinkButton href={s.cta.h}>{s.cta.t}</LinkButton>
          <Link href="/jsgm" className="enlace">Conoce el perfil experto detrás de las soluciones</Link>
        </div>
        <p className="mt-6 text-body-sm text-ink-muted">{s.aviso}</p>
      </div>
    </Marco>
  );
}
