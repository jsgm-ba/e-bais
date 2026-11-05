import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Marco } from '@/components/Marco';
import { textoPrecio, ligero } from '@/components/ProductoTarjeta';
import { Chip, LinkButton } from '@/components/ui';
import { contenido, cursoDeProducto, producto, productoPorId, productos } from '@/lib/content';
import { textosTarjeta } from '@/lib/textos';

const e = contenido.eva;
const c = contenido.comun;
export const generateStaticParams = () => productos().map((p) => ({ slug: p.slug }));
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = producto((await params).slug);
  return p ? { title: `${p.nombre} · EVA`, description: p.resultado ?? p.problema, alternates: { canonical: `/eva/${p.slug}` } } : {};
}

export default async function Ficha({ params }: { params: Promise<{ slug: string }> }) {
  const p = producto((await params).slug);
  if (!p) notFound();
  const sig = p.upsell ? productoPorId(p.upsell) : undefined;
  const curso = cursoDeProducto(p.id);
  const institucional = p.precio.modo === 'cotiza';
  const f = e.ficha;
  const filas: [string, string | null][] = [
    [f.intensidad!, p.intensidad_h ? `${p.intensidad_h} horas` : null],
    [f.formato!, c.formato[p.formato] ?? p.formato],
    [f.norma!, p.norma],
    [f.regimen!, c.regimen[p.regimen]],
    ['Docente', p.docente],
    ['Precio', textoPrecio(ligero(p), textosTarjeta())],
  ];
  return (
    <Marco s="eva" borrador={p.publicacion === 'borrador'}>
      <article className="contenedor py-12">
        <nav aria-label="Ruta de navegación" className="text-body-sm"><Link href="/eva#catalogo" className="enlace">Catálogo</Link></nav>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip tono={p.estado === 'confirmado' ? 'acento' : 'neutro'}>{c.estados[p.estado]}</Chip>
          <Chip>{c.clientes[p.cliente]}</Chip><Chip>{p.id}</Chip>
        </div>
        <p className="mt-6 text-body-lg text-ink-muted">{p.problema}</p>
        <h1 className="mt-2 max-w-4xl font-eva text-[32px] font-semibold leading-tight lg:text-display-eva">{p.nombre}</h1>
        <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="grid gap-8">
            {p.resultado && <section><h2 className="font-eva text-h-eva font-semibold">{f.resultado}</h2><p className="mt-2 max-w-measure">{p.resultado}</p></section>}
            {p.entregable && <section><h2 className="font-eva text-h-eva font-semibold">{f.entregable}</h2><p className="mt-2 max-w-measure">{p.entregable}</p></section>}
            <section>
              <h2 className="font-eva text-h-eva font-semibold">{f.componentes}</h2>
              <ol className="mt-3 grid gap-3">
                {e.componentes.items.map((k) => (
                  <li key={k.n} className="flex gap-3 rounded-lg border border-line p-4">
                    <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-accent-soft px-1 text-body-sm font-semibold text-accent" aria-hidden="true">{k.n}</span>
                    <span><strong>{k.t}.</strong> {k.n === '3' && p.activo_mmp ? `Basado en: ${p.activo_mmp}.` : k.n === 'IA' && p.capa_ia ? `${p.capa_ia}.` : k.d}</span>
                  </li>
                ))}
              </ol>
            </section>
            {p.disparador && <section><h2 className="font-eva text-h-eva font-semibold">Por qué ahora</h2><p className="mt-2 max-w-measure">{p.disparador}</p></section>}
            <section><h2 className="text-label font-semibold">{f.fuentes}</h2><ul className="mt-2 grid gap-1 text-caption text-ink-muted">{p.fuentes.map((x) => <li key={x}>{x}</li>)}</ul></section>
          </div>
          <aside className="h-fit rounded-lg border border-line bg-surface-sunken p-6">
            <dl className="grid gap-3">
              {filas.filter(([, v]) => v).map(([k, v]) => (<div key={k}><dt className="text-caption font-semibold uppercase tracking-wide text-ink-muted">{k}</dt><dd className="mt-1">{v}</dd></div>))}
            </dl>
            <div className="mt-6 grid gap-3">
              {curso && <LinkButton href={`/eva/aprender/${curso.slug}`}>{f.comenzar}</LinkButton>}
              {institucional
                ? <LinkButton href="/ba/contacto?motivo=cotizacion" variante={curso ? 'secundario' : 'principal'}>{f.precio_institucional}</LinkButton>
                : <LinkButton href={`/eva/lista-de-espera?producto=${p.id}`} variante={curso ? 'secundario' : 'principal'}>{e.lista_espera.enviar}</LinkButton>}
            </div>
            {sig && (<p className="mt-6 text-body-sm">{f.siguiente}: <Link className="enlace" href={`/eva/${sig.slug}`}>{sig.nombre}</Link></p>)}
          </aside>
        </div>
      </article>
    </Marco>
  );
}
