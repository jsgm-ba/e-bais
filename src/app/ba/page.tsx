import type { Metadata } from 'next';
import { LineaTarjeta } from '@/components/LineaServicio';
import { Marco } from '@/components/Marco';
import { EnPreparacion, LinkButton, Section } from '@/components/ui';
import { contenido, visible } from '@/lib/content';

const b = contenido.ba;
export const metadata: Metadata = { title: b.meta.title, description: b.meta.description, alternates: { canonical: '/ba' } };

export default function BA() {
  if (!visible(b._estado)) return <Marco s="ba"><EnPreparacion /></Marco>;
  return (
    <Marco s="ba" borrador={b._estado.publicacion === 'borrador'}>
      <div className="contenedor">
        <section className="py-12 lg:py-24" aria-labelledby="ba-titular">
          <h1 id="ba-titular" className="max-w-4xl font-serif text-[32px] font-semibold leading-tight lg:text-display-ba">{b.hero.titular}</h1>
          <p className="mt-6 max-w-measure text-body-lg text-ink-muted">{b.hero.bajada}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href={b.hero.accion_principal.h}>{b.hero.accion_principal.t}</LinkButton>
            <LinkButton href={b.hero.accion_secundaria.h} variante="secundario">{b.hero.accion_secundaria.t}</LinkButton>
          </div>
        </section>
        <Section id="lineas" titulo="Líneas de servicio" className="border-t border-line">
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{b.lineas.map((l) => <li key={l.slug}><LineaTarjeta l={l} /></li>)}</ul>
        </Section>
      </div>
    </Marco>
  );
}
