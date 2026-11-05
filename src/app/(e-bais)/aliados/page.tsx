import type { Metadata } from 'next';
import Link from 'next/link';
import { Marco } from '@/components/Marco';
import { EnPreparacion, LinkButton, Section, Texto } from '@/components/ui';
import { contenido, visible } from '@/lib/content';
import { esPreview } from '@/lib/preview';

const a = contenido.aliados;
export const metadata: Metadata = { title: a.meta.title, description: a.meta.description, alternates: { canonical: '/aliados' } };

export default function Aliados() {
  if (!visible(a._estado)) return <Marco s="hub"><EnPreparacion /></Marco>;
  const preview = esPreview();
  const fundaciones = a.fundaciones.filter((f) => f.permiso_ref || preview);
  return (
    <Marco s="hub" borrador={a._estado.publicacion === 'borrador'}>
      <div className="contenedor">
        <section className="py-12 lg:py-16" aria-labelledby="al-t">
          <h1 id="al-t" className="max-w-4xl text-h2 font-bold lg:text-[40px]">{a.intro.titulo}</h1>
          <p className="mt-4 max-w-measure text-body-lg text-ink-muted">{a.intro.bajada}</p>
          <ul className="mt-6 grid max-w-measure gap-2">{a.intro.principios.map((p) => <li key={p} className="border-b border-line pb-2">{p}</li>)}</ul>
        </section>
        <Section id="valor" titulo={a.valor_compartido.titulo} className="border-t border-line">
          <ul className="grid gap-4 md:grid-cols-3">{a.valor_compartido.items.map((v) => <li key={v.t} className="rounded-md border border-line bg-surface-raised p-6"><h3 className="text-h4 font-semibold">{v.t}</h3><p className="mt-2 text-body-sm">{v.d}</p></li>)}</ul>
        </Section>
        <Section id="modalidades" titulo={a.modalidades.titulo} className="border-t border-line">
          <ol className="grid gap-4 md:grid-cols-3">{a.modalidades.items.map((m, i) => (
            <li key={m.id} className="rounded-md border border-line bg-surface-raised p-6">
              <span className="font-mono text-data text-accent">0{i + 1}</span>
              <h3 className="mt-1 text-h4 font-semibold">{m.t}</h3><p className="mt-2 text-body-sm">{m.d}</p>
              <p className="mt-3 text-body-sm text-ink-muted"><Texto preview={preview}>{m.quien_paga}</Texto></p>
            </li>))}</ol>
        </Section>
        {fundaciones.length > 0 && (
          <Section id="propuestas" titulo="Propuestas por fundación" className="border-t border-line">
            <ul className="grid gap-4 md:grid-cols-2">{fundaciones.map((f) => (
              <li key={f.id} className="relative rounded-md border border-line bg-surface-raised p-6 shadow-1 hover:shadow-2">
                <h3 className="text-h3 font-semibold"><Link href={`/aliados/${f.id}`} className="no-underline after:absolute after:inset-0 hover:text-accent">{f.nombre}</Link></h3>
                <p className="mt-2">{f.propuesta_valor}</p>
              </li>))}</ul>
          </Section>
        )}
        <section className="border-t border-line py-12">
          <p className="max-w-measure text-body-sm text-ink-muted">{a.aviso}</p>
          <LinkButton href={a.cta.h} className="mt-4">{a.cta.t}</LinkButton>
        </section>
      </div>
    </Marco>
  );
}
