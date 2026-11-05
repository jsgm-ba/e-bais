import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Marco } from '@/components/Marco';
import { EnPreparacion, LinkButton } from '@/components/ui';
import { contenido, productoPorId, visible } from '@/lib/content';

const s = contenido.soluciones;
export const generateStaticParams = () => s.items.map((x) => ({ slug: x.slug }));
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const x = s.items.find((i) => i.slug === slug);
  return x ? { title: `${x.titulo} · e-B&Ais`, description: x.problema, alternates: { canonical: `/soluciones/${x.slug}` } } : {};
}

export default async function Solucion({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const x = s.items.find((i) => i.slug === slug);
  if (!x) notFound();
  if (!visible(s._estado)) return <Marco s="hub"><EnPreparacion /></Marco>;
  const curso = x.producto_eva ? productoPorId(x.producto_eva) : undefined;
  return (
    <Marco s="hub" borrador={s._estado.publicacion === 'borrador'}>
      <article className="contenedor py-12">
        <nav aria-label="Ruta de navegación" className="text-body-sm"><Link href="/soluciones" className="enlace">Soluciones</Link></nav>
        <h1 className="mt-4 max-w-4xl text-h2 font-bold lg:text-[40px]">{x.titulo}</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="grid max-w-measure gap-6">
            <section><h2 className="text-h3 font-semibold">El problema</h2><p className="mt-2">{x.problema}</p></section>
            <section><h2 className="text-h3 font-semibold">El resultado</h2><p className="mt-2">{x.resultado}</p></section>
            <section><h2 className="text-h3 font-semibold">Cómo lo hacemos</h2>
              <ol className="mt-3 grid gap-3">{x.pasos.map((p, i) => <li key={p} className="flex gap-3"><span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent">{i + 1}</span><span className="pt-1">{p}</span></li>)}</ol>
            </section>
          </div>
          <aside className="h-fit rounded-md border border-line bg-surface-sunken p-6">
            <h2 className="text-h4 font-semibold">Entregable</h2><p className="mt-2">{x.entregable}</p>
            <h2 className="mt-4 text-h4 font-semibold">Para quién</h2><p className="mt-2">{x.para}</p>
            {curso && <p className="mt-4 text-body-sm">Formación relacionada: <Link className="enlace" href={`/eva/${curso.slug}`}>{curso.nombre}</Link></p>}
            <LinkButton href={s.cta.h} className="mt-6 w-full">{s.cta.t}</LinkButton>
          </aside>
        </div>
        <p className="mt-8 text-body-sm text-ink-muted">{s.aviso}</p>
      </article>
    </Marco>
  );
}
