import type { Metadata } from 'next';
import Link from 'next/link';
import { HubExplorador } from '@/components/HubExplorador';
import { IconoFlecha } from '@/components/Iconos';
import { Marco } from '@/components/Marco';
import { ligero } from '@/components/ProductoTarjeta';
import { EnPreparacion, Section, Texto } from '@/components/ui';
import { contenido, productos, visible } from '@/lib/content';
import { esPreview } from '@/lib/preview';
import { textosTarjeta } from '@/lib/textos';

const h = contenido.hub;
export const metadata: Metadata = { title: h.meta.title, description: h.meta.description, alternates: { canonical: '/' } };

export default function Hub() {
  if (!visible(h._estado)) return <Marco s="hub"><EnPreparacion /></Marco>;
  const preview = esPreview();
  return (
    <Marco s="hub" borrador={h._estado.publicacion === 'borrador'}>
      <div className="contenedor">
        <section className="py-12 lg:py-24" aria-labelledby="hub-titular">
          <p className="text-label font-semibold uppercase tracking-wider text-accent">{h.hero.antetitulo}</p>
          <h1 id="hub-titular" className="mt-3 max-w-4xl text-h2 font-bold lg:text-[40px]">{h.hero.titular}</h1>
          <p className="mt-4 max-w-measure text-body-lg text-ink-muted">{h.hero.bajada}</p>
          {h.hero.nota_trayectoria && <p className="mt-2 text-body-sm"><Texto preview={preview}>{h.hero.nota_trayectoria}</Texto></p>}
        </section>

        <Section id="explorar" className="border-t border-line">
          <HubExplorador perfiles={h.quien.perfiles} productos={productos().map(ligero)} t={textosTarjeta()}
            textos={{ quien: h.quien.pregunta, que: h.que.pregunta, todos: h.que.todos, vacio: h.que.vacio }} cta={h.cta} />
        </Section>

        <Section id="puertas" titulo={h.puertas.titulo} className="border-t border-line">
          <ul className="grid gap-4 md:grid-cols-2">
            {h.puertas.items.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="group flex h-full flex-col rounded-[var(--radio,8px)] border border-line bg-surface-raised p-6 no-underline shadow-1 hover:shadow-2">
                  <span className={`text-h3 font-semibold text-accent ${p.producto === 'eva' ? 'font-eva' : p.producto === 'ckop' ? 'font-mono' : ''}`}>{p.titulo}</span>
                  <span className="mt-2 text-ink-muted">{p.texto}</span>
                  <span className="mt-4 inline-flex items-center gap-2 font-semibold text-accent">{p.accion}<IconoFlecha /></span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="senal" titulo={h.senal.titulo} className="border-t border-line">
          <p className="max-w-measure text-body-lg">{h.senal.texto}</p>
          <p className="mt-2 text-caption text-ink-muted">Fuente: {h.senal.fuente}</p>
          {h.senal.nota && <p className="mt-2 text-body-sm"><Texto preview={preview}>{h.senal.nota}</Texto></p>}
        </Section>
      </div>
    </Marco>
  );
}
