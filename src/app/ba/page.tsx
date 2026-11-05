import type { Metadata } from 'next';
import Link from 'next/link';
import { IconoFlecha } from '@/components/Iconos';
import { LineaTarjeta } from '@/components/LineaServicio';
import { Marco } from '@/components/Marco';
import { EnPreparacion, LinkButton, Texto } from '@/components/ui';
import { contenido, visible } from '@/lib/content';
import { esPreview } from '@/lib/preview';

const b = contenido.ba;
const m = contenido.mmp;
const red = contenido.redExpertos;
export const metadata: Metadata = { title: b.meta.title, description: b.meta.description, alternates: { canonical: '/ba' } };

/** Numera las fuentes de la página para citarlas como notas al pie. */
function indiceFuentes(listas: string[][]) {
  const orden: string[] = [];
  for (const l of listas) for (const f of l) if (!orden.includes(f)) orden.push(f);
  return { orden, n: (f: string) => orden.indexOf(f) + 1 };
}

function Nota({ fuentes, n }: { fuentes: string[]; n: (f: string) => number }) {
  return <sup className="ml-1 font-sans text-caption font-normal text-ink-muted">{fuentes.map(n).sort((a, c) => a - c).join(',')}</sup>;
}

function Encabezado({ kicker, titulo, bajada, id }: { kicker: string; titulo: string; bajada?: string; id: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="text-label font-semibold uppercase tracking-[0.14em] text-accent">{kicker}</p>
      <h2 id={id} className="mt-3 font-serif text-[28px] font-semibold leading-tight lg:text-h1-ba">{titulo}</h2>
      {bajada && <p className="mt-4 text-body-lg text-ink-muted">{bajada}</p>}
    </div>
  );
}

export default function BA() {
  if (!visible(b._estado)) return <Marco s="ba"><EnPreparacion /></Marco>;
  const preview = esPreview();
  const { orden, n } = indiceFuentes([b.hero.fuentes, ...b.prueba.items.map((i) => i.fuentes), b.etapas.fuentes, b.capacidades.fuentes, m.resumen_carrera.fuentes, red.fuentes]);
  const maxCap = Math.max(...b.capacidades.items.map((c) => c.n));
  const maxNorma = Math.max(...Object.values(red.por_norma));
  const hitosClave = m.hitos.filter((h) => h.desde).slice(0, 6);
  return (
    <Marco s="ba" borrador={b._estado.publicacion === 'borrador'}>
      {/* 1 · Apertura */}
      <section aria-labelledby="ba-titular" className="border-b border-line">
        <div className="contenedor grid gap-12 py-16 lg:grid-cols-[1.6fr_1fr] lg:py-24">
          <div>
            <p className="text-label font-semibold uppercase tracking-[0.14em] text-accent">{b.hero.antetitulo}</p>
            <h1 id="ba-titular" className="mt-5 font-serif text-[40px] font-semibold leading-[1.05] lg:text-[64px]">
              {b.hero.titular}<Nota fuentes={b.hero.fuentes} n={n} />
            </h1>
            <p className="mt-6 max-w-2xl font-serif text-h3 leading-snug text-ink">{b.hero.subtitular}</p>
            <p className="mt-6 max-w-measure text-body-lg text-ink-muted">{b.hero.bajada}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <LinkButton href={b.hero.accion_principal.h}>{b.hero.accion_principal.t}</LinkButton>
              <LinkButton href={b.hero.accion_secundaria.h} variante="secundario">{b.hero.accion_secundaria.t}</LinkButton>
            </div>
          </div>
          <aside aria-label="Ficha de la firma" className="h-fit border-l-0 bg-surface-sunken p-8 lg:mt-10">
            <dl className="grid gap-5 text-body-sm">
              <div><dt className="text-caption font-semibold uppercase tracking-wider text-ink-muted">Razón social</dt><dd className="mt-1 font-semibold">Business & Auditing Consultores Ltda.</dd></div>
              <div><dt className="text-caption font-semibold uppercase tracking-wider text-ink-muted">NIT · RUP</dt><dd className="mt-1 font-mono text-data-lg tabular">830.026.351-4 · 00036564</dd></div>
              <div><dt className="text-caption font-semibold uppercase tracking-wider text-ink-muted">Dirección técnica</dt><dd className="mt-1"><Link href="/ba/legado" className="enlace">{m.nombre}</Link></dd></div>
              <div><dt className="text-caption font-semibold uppercase tracking-wider text-ink-muted">Aliado certificador</dt><dd className="mt-1">FB Certification SAS, OEC acreditado por ONAC (15-CSG-002)</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      {/* 2 · Evidencia */}
      <section aria-labelledby="prueba-t" className="border-b border-line bg-surface-sunken">
        <div className="contenedor py-12">
          <h2 id="prueba-t" className="sr-only">{b.prueba.titulo}</h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {b.prueba.items.map((p) => (
              <li key={p.etiqueta} className="border-t-2 border-accent pt-4">
                <p className="font-serif text-[44px] font-semibold leading-none tabular text-ink">{p.cifra}<Nota fuentes={p.fuentes} n={n} /></p>
                <p className="mt-3 text-body-sm text-ink-muted">{p.etiqueta}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 · Servicios */}
      <section aria-labelledby="lineas-t" className="contenedor py-16 lg:py-24">
        <Encabezado id="lineas-t" kicker="Lo que resolvemos" titulo="Seis problemas que las entidades nos traen" bajada="Cada línea parte de un problema que se nota en una auditoría, en el FURAG o en un dictamen, y termina en evidencia verificable." />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{b.lineas.map((l) => <li key={l.slug}><LineaTarjeta l={l} /></li>)}</ul>
      </section>

      {/* 4 · Trayectoria de la firma */}
      <section aria-labelledby="etapas-t" className="border-t border-line">
        <div className="contenedor py-16 lg:py-24">
          <Encabezado id="etapas-t" kicker="Trayectoria" titulo={b.etapas.titulo} />
          <ol className="grid gap-0 md:grid-cols-4">
            {b.etapas.items.map((e, i) => (
              <li key={e.periodo} className="border-l border-line-strong py-2 pl-6 md:border-l-0 md:border-t md:pl-0 md:pr-6 md:pt-6">
                <p className="font-mono text-data text-accent">{String(i + 1).padStart(2, '0')} · {e.periodo}</p>
                <h3 className="mt-2 font-serif text-h3 font-semibold">{e.t}</h3>
                <p className="mt-2 text-body-sm text-ink-muted">{e.d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl font-serif text-h3 italic leading-snug">«{b.etapas.hilo}»<Nota fuentes={b.etapas.fuentes} n={n} /></p>
        </div>
      </section>

      {/* 5 · Capacidades */}
      <section aria-labelledby="cap-t" className="border-t border-line bg-surface-sunken">
        <div className="contenedor grid gap-12 py-16 lg:grid-cols-[1fr_1.4fr] lg:py-24">
          <div>
            <Encabezado id="cap-t" kicker="Capacidad acreditada" titulo={b.capacidades.titulo} bajada={b.capacidades.bajada} />
            <p className="text-body-sm"><Texto preview={preview}>{b.capacidades.nota}</Texto></p>
          </div>
          <figure>
            <figcaption className="sr-only">Contratos que acreditan cada capacidad</figcaption>
            <ul className="grid gap-3">
              {b.capacidades.items.map((c) => (
                <li key={c.t} className="grid grid-cols-[minmax(0,180px)_1fr_40px] items-center gap-3 text-body-sm">
                  <span>{c.t}</span>
                  <span className="h-3 rounded-full bg-surface" aria-hidden="true"><span className="block h-3 rounded-full bg-accent" style={{ width: `${(c.n / maxCap) * 100}%` }} /></span>
                  <span className="text-right font-mono text-data tabular">{c.n}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-caption text-ink-muted">Contratos por capacidad<Nota fuentes={b.capacidades.fuentes} n={n} /></p>
          </figure>
        </div>
      </section>

      {/* 6 · Dirección técnica */}
      <section aria-labelledby="mmp-t" className="border-t border-line">
        <div className="contenedor grid gap-12 py-16 lg:grid-cols-[1fr_1.4fr] lg:py-24">
          <div>
            <Encabezado id="mmp-t" kicker="Dirección técnica" titulo={m.nombre} bajada={m.resumen_carrera.texto} />
            <p className="-mt-6 text-caption text-ink-muted">Trayectoria<Nota fuentes={m.resumen_carrera.fuentes} n={n} /></p>
            <ul className="mt-6 grid gap-2 text-body-sm">{b.legado.perfil.map((p) => <li key={p}>{p}</li>)}</ul>
            <Link href="/ba/legado" className="enlace mt-6 inline-flex items-center gap-2 font-semibold">Ver la trayectoria completa<IconoFlecha /></Link>
          </div>
          <ol className="grid gap-0" aria-label="Hitos de la trayectoria">
            {hitosClave.map((h) => (
              <li key={h.entidad} className="grid grid-cols-[110px_1fr] gap-4 border-t border-line py-4">
                <span className="font-mono text-data tabular text-accent">{h.desde}{h.hasta && h.hasta !== h.desde ? `–${h.hasta}` : ''}</span>
                <span><span className="font-semibold">{h.entidad}</span><span className="block text-body-sm text-ink-muted">{h.vinculo}{h.tematica ? ` · ${h.tematica.slice(0, 90)}${h.tematica.length > 90 ? '…' : ''}` : ''}</span></span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7 · Red de expertos */}
      <section aria-labelledby="red-t" className="border-t border-line bg-surface-sunken">
        <div className="contenedor grid gap-12 py-16 lg:grid-cols-[1fr_1.4fr] lg:py-24">
          <Encabezado id="red-t" kicker="Red de expertos" titulo={`${red.profesionales} profesionales, ${red.auditores_lideres_iaf} auditores líderes`} bajada="La capacidad de B&A no cabe en una nómina: es una red de auditores y consultores que se convoca por norma, sector y región." />
          <figure>
            <figcaption className="text-label font-semibold">Profesionales que declaran experiencia por norma<Nota fuentes={red.fuentes} n={n} /></figcaption>
            <ul className="mt-4 grid gap-3">
              {Object.entries(red.por_norma).map(([k, v]) => (
                <li key={k} className="grid grid-cols-[minmax(0,180px)_1fr_40px] items-center gap-3 text-body-sm">
                  <span>{k}</span>
                  <span className="h-3 rounded-full bg-surface" aria-hidden="true"><span className="block h-3 rounded-full bg-accent" style={{ width: `${(v / maxNorma) * 100}%` }} /></span>
                  <span className="text-right font-mono text-data tabular">{v}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-body-sm"><Texto preview={preview}>{red.nota}</Texto></p>
          </figure>
        </div>
      </section>

      {/* 8 · Método */}
      <section aria-labelledby="metodo-t" className="contenedor border-t border-line py-16 lg:py-24">
        <Encabezado id="metodo-t" kicker="Método" titulo={b.metodo.titulo} />
        <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {b.metodo.items.map((x, i) => (
            <li key={x.t}><p className="font-serif text-[44px] font-semibold leading-none text-accent">{i + 1}</p><h3 className="mt-3 text-h4 font-semibold">{x.t}</h3><p className="mt-2 text-body-sm text-ink-muted">{x.d}</p></li>
          ))}
        </ol>
        <p className="mt-10 max-w-measure text-body-sm text-ink-muted">{b.nota_auditoria}</p>
      </section>

      {/* 9 · Cierre */}
      <section aria-labelledby="cierre-t" className="bg-accent text-on-accent">
        <div className="contenedor flex flex-wrap items-center justify-between gap-6 py-14">
          <h2 id="cierre-t" className="max-w-2xl font-serif text-[28px] font-semibold leading-tight">¿Su entidad tiene un dictamen, un FURAG o una auditoría encima?</h2>
          <Link href="/ba/contacto?motivo=cotizacion" className="inline-flex min-h-touch items-center gap-2 rounded-md bg-surface px-5 font-semibold text-accent no-underline md:min-h-control">Hablemos esta semana<IconoFlecha /></Link>
        </div>
      </section>

      {/* Fuentes */}
      <section aria-labelledby="fuentes-t" className="contenedor py-10">
        <h2 id="fuentes-t" className="text-label font-semibold">Fuentes de esta página</h2>
        <ol className="mt-3 grid list-decimal gap-1 pl-5 text-caption text-ink-muted">{orden.map((f) => <li key={f}>{f}</li>)}</ol>
      </section>
    </Marco>
  );
}
