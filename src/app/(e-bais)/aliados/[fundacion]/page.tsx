import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Marco } from '@/components/Marco';
import { Chip, EnPreparacion, LinkButton, Section, Texto } from '@/components/ui';
import { contenido, productoPorId, visible } from '@/lib/content';
import { esPreview } from '@/lib/preview';

const a = contenido.aliados;
const disponibles = () => a.fundaciones.filter((f) => f.permiso_ref || esPreview());
export const generateStaticParams = () => disponibles().map((f) => ({ fundacion: f.id }));
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ fundacion: string }> }): Promise<Metadata> {
  const { fundacion } = await params;
  const f = disponibles().find((x) => x.id === fundacion);
  return f ? { title: `Propuesta para ${f.nombre} · e-B&Ais`, description: f.propuesta_valor, robots: { index: false } } : {};
}

/** Propuesta de colaboración directa. Imprimible (Ctrl+P) para enviarla como documento. */
export default async function Propuesta({ params }: { params: Promise<{ fundacion: string }> }) {
  const { fundacion } = await params;
  const f = disponibles().find((x) => x.id === fundacion);
  if (!f) notFound();
  if (!visible(a._estado)) return <Marco s="hub"><EnPreparacion /></Marco>;
  const preview = esPreview();
  const Lista = ({ items }: { items: string[] }) => <ul className="mt-2 grid list-disc gap-1 pl-5">{items.map((x) => <li key={x}>{x}</li>)}</ul>;
  return (
    <Marco s="hub" borrador>
      <article className="contenedor py-12">
        <nav aria-label="Ruta de navegación" className="text-body-sm" data-no-print><Link href="/aliados" className="enlace">Alianzas</Link></nav>
        <p className="mt-6 text-label font-semibold uppercase tracking-wider text-accent">Propuesta de colaboración · e-B&Ais y B&A</p>
        <h1 className="mt-2 max-w-4xl text-h2 font-bold lg:text-[40px]">{f.nombre}</h1>
        <p className="mt-6 max-w-3xl text-h3 font-semibold leading-snug">{f.propuesta_valor}</p>
        <p className="mt-4 text-body-sm"><Texto preview={preview}>{f.lectura}</Texto></p>

        <Section titulo="Lo que creemos que les pasa" bajada="Hipótesis para validar juntos en la primera conversación." className="border-t border-line">
          <ol className="grid max-w-measure gap-3">{f.hipotesis.map((h, i) => <li key={h} className="flex gap-3"><span className="font-mono text-data text-accent">H{i + 1}</span><span>{h}</span></li>)}</ol>
        </Section>

        <Section titulo="Qué les proponemos" className="border-t border-line">
          <ul className="grid gap-4 md:grid-cols-3">{f.oferta.map((o) => {
            const p = o.producto ? productoPorId(o.producto) : undefined;
            return (
              <li key={o.t} className="flex flex-col rounded-md border border-line bg-surface-raised p-6">
                {o.estado === 'en_diseno' && <Chip tono="revisar" className="mb-2 w-fit">{contenido.comun.estados.en_diseno}</Chip>}
                <h3 className="text-h4 font-semibold">{o.t}</h3><p className="mt-2 text-body-sm">{o.d}</p>
                {p && <Link href={`/eva/${p.slug}`} className="enlace mt-auto pt-3 text-body-sm">Ver en EVA: {p.nombre}</Link>}
              </li>);
          })}</ul>
        </Section>

        <Section titulo="Primeros 90 días" className="border-t border-line">
          <ol className="grid gap-4 md:grid-cols-3">{f.plan_90.map((p) => (
            <li key={p.fase} className="rounded-md border border-line p-6"><p className="font-mono text-data text-accent">{p.fase}</p><h3 className="mt-1 text-h4 font-semibold">{p.t}</h3><p className="mt-2 text-body-sm">{p.d}</p></li>))}</ol>
        </Section>

        <Section titulo="Cómo sabremos que funcionó" className="border-t border-line"><Lista items={f.metricas} /></Section>

        <Section titulo="Qué aporta cada parte" className="border-t border-line">
          <div className="grid gap-6 md:grid-cols-2">
            <div><h3 className="text-h4 font-semibold">La fundación</h3><Lista items={f.aporta_fundacion} /></div>
            <div><h3 className="text-h4 font-semibold">B&A y e-B&Ais</h3><Lista items={f.aporta_ba} /></div>
          </div>
        </Section>

        <Section titulo="Modalidades de colaboración" className="border-t border-line">
          <ul className="grid gap-3">{a.modalidades.items.map((m) => <li key={m.id}><strong>{m.t}.</strong> {m.d} <span className="text-ink-muted"><Texto preview={preview}>{m.quien_paga}</Texto></span></li>)}</ul>
        </Section>

        <Section titulo="Para la primera conversación" className="border-t border-line"><Lista items={f.preguntas} /></Section>

        <section className="border-t border-line py-12">
          <p className="max-w-measure text-body-sm text-ink-muted">{a.aviso}</p>
          <div className="mt-4 flex flex-wrap gap-3" data-no-print>
            <LinkButton href={a.cta.h}>{a.cta.t}</LinkButton>
            <LinkButton href="/jsgm" variante="secundario">Perfil de quien lidera la propuesta</LinkButton>
          </div>
        </section>
      </article>
    </Marco>
  );
}
