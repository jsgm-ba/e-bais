import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NotaAuditoria } from '@/components/LineaServicio';
import { Marco } from '@/components/Marco';
import { EnPreparacion, LinkButton, Section } from '@/components/ui';
import { contenido, productoPorId, visible } from '@/lib/content';

const b = contenido.ba;
export const generateStaticParams = () => b.lineas.map((l) => ({ linea: l.slug }));
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ linea: string }> }): Promise<Metadata> {
  const { linea } = await params;
  const l = b.lineas.find((x) => x.slug === linea);
  return l ? { title: `${l.titulo} · B&A`, description: l.problema, alternates: { canonical: `/ba/servicios/${l.slug}` } } : {};
}

export default async function LineaPagina({ params }: { params: Promise<{ linea: string }> }) {
  const { linea } = await params;
  const l = b.lineas.find((x) => x.slug === linea);
  if (!l) notFound();
  if (!visible(b._estado)) return <Marco s="ba"><EnPreparacion /></Marco>;
  const relacionados = l.productos.map(productoPorId).filter((p) => p !== undefined);
  return (
    <Marco s="ba" borrador={b._estado.publicacion === 'borrador'}>
      <article className="contenedor py-12">
        <nav aria-label="Ruta de navegación" className="text-body-sm"><Link href="/ba/servicios" className="enlace">Servicios</Link></nav>
        <h1 className="mt-4 max-w-4xl font-serif text-h1-ba font-semibold">{l.titulo}</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            <Section titulo="El problema" nivel={3} denso><p className="max-w-measure">{l.problema}</p></Section>
            <Section titulo="Para quién" nivel={3} denso><p className="max-w-measure">{l.para}</p></Section>
            <Section titulo="Cómo lo hacemos" nivel={3} denso>
              <ol className="grid gap-3">
                {l.metodo.map((m, i) => (
                  <li key={m} className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent" aria-hidden="true">{i + 1}</span><span className="pt-1">{m}</span></li>
                ))}
              </ol>
            </Section>
            {l.auditoria && <NotaAuditoria texto={b.nota_auditoria} />}
          </div>
          <aside className="h-fit rounded-md border border-line bg-surface-sunken p-6">
            <h2 className="text-h4 font-semibold">Entregables</h2>
            <ul className="mt-3 grid list-disc gap-2 pl-5">{l.entregables.map((e) => <li key={e}>{e}</li>)}</ul>
            {relacionados.length > 0 && (<>
              <h2 className="mt-6 text-h4 font-semibold">Formación relacionada en EVA</h2>
              <ul className="mt-3 grid gap-2">{relacionados.map((p) => <li key={p.id}><Link href={`/eva/${p.slug}`} className="enlace">{p.nombre}</Link></li>)}</ul>
            </>)}
            <LinkButton href="/ba/contacto?motivo=consultoria" className="mt-6 w-full">Solicite una cotización</LinkButton>
          </aside>
        </div>
      </article>
    </Marco>
  );
}
