import type { Metadata } from 'next';
import { CatalogoEVA } from '@/components/CatalogoEVA';
import { Marco } from '@/components/Marco';
import { ligero } from '@/components/ProductoTarjeta';
import { Chip, EnPreparacion, Section } from '@/components/ui';
import { contenido, paquetes_, productos, visible } from '@/lib/content';
import { cop } from '@/lib/formato';
import { textosTarjeta } from '@/lib/textos';

const e = contenido.eva;
export const metadata: Metadata = { title: e.meta.title, description: e.meta.description, alternates: { canonical: '/eva' } };

export default function EVA() {
  if (!visible(e._estado)) return <Marco s="eva"><EnPreparacion /></Marco>;
  const pq = paquetes_();
  return (
    <Marco s="eva" borrador={e._estado.publicacion === 'borrador'}>
      <div className="contenedor">
        <section className="py-12 lg:py-16" aria-labelledby="eva-titular">
          <h1 id="eva-titular" className="max-w-4xl font-eva text-[32px] font-semibold leading-tight lg:text-display-eva">{e.hero.titular}</h1>
          <p className="mt-4 max-w-measure text-body-lg text-ink-muted">{e.hero.bajada}</p>
        </section>
        <Section id="componentes" titulo={<span className="font-eva">{e.componentes.titulo}</span>} className="border-t border-line">
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {e.componentes.items.map((c) => (
              <li key={c.n} className="rounded-lg border border-line bg-surface-raised p-6">
                <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-accent-soft px-2 font-eva font-semibold text-accent" aria-hidden="true">{c.n}</span>
                <h3 className="mt-3 font-eva text-h-eva font-semibold">{c.t}</h3>
                <p className="mt-2 text-body-sm text-ink-muted">{c.d}</p>
              </li>
            ))}
          </ol>
        </Section>
        <Section id="catalogo" titulo={<span className="font-eva">{e.filtros.titulo}</span>} className="border-t border-line">
          <CatalogoEVA productos={productos().map(ligero)} t={textosTarjeta()} textos={e.filtros} />
        </Section>
        {pq.length > 0 && (
          <Section id="paquetes" titulo={<span className="font-eva">{e.paquetes.titulo}</span>} bajada={e.paquetes.bajada} className="border-t border-line">
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pq.map((p) => (
                <li key={p.id} className="rounded-lg border border-line bg-surface-raised p-6">
                  <Chip>{contenido.comun.clientes[p.cliente]}</Chip>
                  <h3 className="mt-3 font-eva text-h-eva font-semibold">{p.nombre}</h3>
                  <p className="mt-2 text-body-sm">{p.resuelve}</p>
                  <p className="mt-4 text-body-sm font-semibold">
                    {p.precio.aprobado_mmp && p.precio.desde_cop ? `Desde ${cop(p.precio.desde_cop)}` : p.precio.desde_cop == null ? contenido.hub.cta.institucional.texto : contenido.comun.estados.precio_preparacion}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </Marco>
  );
}
