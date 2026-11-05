import type { Metadata } from 'next';
import Link from 'next/link';
import { IconoCheck, IconoFlecha } from '@/components/Iconos';
import { Marco } from '@/components/Marco';
import { Chip, EnPreparacion, LinkButton, Section, Texto } from '@/components/ui';
import { contenido, productoPorId, visible } from '@/lib/content';
import { esPreview } from '@/lib/preview';

const j = contenido.jsgm;
export const metadata: Metadata = { title: j.meta.title, description: j.meta.description, alternates: { canonical: '/jsgm' } };

/** Perfil experto de JSGM como portafolio consultivo para B&A y su red de aliados. Imprimible como brochure (Ctrl+P). */
export default function PerfilJSGM() {
  if (!visible(j._estado)) return <Marco s="hub"><EnPreparacion /></Marco>;
  const preview = esPreview();
  const clientes = contenido.comun.clientes;
  // Fundaciones: sin permiso_ref solo se muestran en vista previa (CLAUDE.md §2.2).
  const fundaciones = j.aliados.fundaciones.filter((f) => f.permiso_ref || preview);
  return (
    <Marco s="hub" borrador={j._estado.publicacion === 'borrador'}>
      <div className="contenedor">
        <section className="py-12 lg:py-16" aria-labelledby="jsgm-nombre">
          <p className="text-label font-semibold uppercase tracking-wider text-accent">{j.hero.antetitulo}</p>
          <h1 id="jsgm-nombre" className="mt-3 text-h2 font-bold lg:text-[40px]">{j.hero.nombre}</h1>
          <p className="mt-1 text-body-lg text-ink-muted">{j.hero.rol}</p>
          <p className="mt-6 max-w-3xl text-h3 font-semibold leading-snug">{j.hero.titular}</p>
          <p className="mt-4 max-w-measure text-body-lg">{j.hero.bajada}</p>
          {j.hero.nota_trayectoria && <p className="mt-2 text-body-sm"><Texto preview={preview}>{j.hero.nota_trayectoria}</Texto></p>}
          <div className="mt-8 flex flex-wrap gap-3" data-no-print>
            <LinkButton href={j.cta.h}>{j.cta.t}</LinkButton>
            <LinkButton href="#servicios" variante="secundario">Ver portafolio</LinkButton>
          </div>
        </section>

        <Section id="tesis" titulo={j.tesis.titulo} className="border-t border-line">
          <div className="prosa max-w-measure text-body-lg">{j.tesis.parrafos.map((p) => <p key={p}>{p}</p>)}</div>
          <p className="mt-3 text-caption text-ink-muted">Referencias: {j.tesis.fuentes.join(' · ')}</p>
        </Section>

        <Section id="diferencial" titulo={j.diferencial.titulo} className="border-t border-line">
          <ul className="grid gap-4 md:grid-cols-3">
            {j.diferencial.items.map((d) => (
              <li key={d.t} className="rounded-md border border-line bg-surface-raised p-6"><h3 className="text-h4 font-semibold">{d.t}</h3><p className="mt-2 text-body-sm text-ink-muted">{d.d}</p></li>
            ))}
          </ul>
        </Section>

        <Section id="servicios" titulo={j.servicios.titulo} bajada={j.servicios.bajada} className="border-t border-line">
          <ul className="grid gap-4 lg:grid-cols-2">
            {j.servicios.items.map((s) => (
              <li key={s.slug} className="flex flex-col rounded-md border border-line bg-surface-raised p-6 shadow-1">
                <div className="flex flex-wrap gap-2">
                  {s.para.map((c) => <Chip key={c}>{clientes[c]}</Chip>)}
                  {s.estado === 'en_diseno' && <Chip tono="revisar">{contenido.comun.estados.en_diseno}</Chip>}
                </div>
                <h3 className="mt-3 text-h3 font-semibold">{s.t}</h3>
                <dl className="mt-3 grid gap-2 text-body-sm">
                  <div><dt className="inline font-semibold">Problema: </dt><dd className="inline">{s.problema}</dd></div>
                  <div><dt className="inline font-semibold">Resultado: </dt><dd className="inline">{s.resultado}</dd></div>
                  <div><dt className="inline font-semibold">Entregable: </dt><dd className="inline">{s.entregable}</dd></div>
                  <div><dt className="inline font-semibold">Duración: </dt><dd className="inline">{s.duracion}</dd></div>
                </dl>
                <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-body-sm">
                  {s.h && <Link href={s.h} className="enlace">Ver detalle</Link>}
                  {s.productos?.map(productoPorId).filter((p) => p !== undefined).map((p) => <Link key={p.id} href={`/eva/${p.slug}`} className="enlace">{p.nombre}</Link>)}
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {fundaciones.length > 0 && (
          <Section id="aliados" titulo={j.aliados.titulo} bajada={j.aliados.bajada} className="border-t border-line">
            <ul className="grid gap-4 lg:grid-cols-2">
              {fundaciones.map((f) => (
                <li key={f.id} className="rounded-md border border-line bg-surface-raised p-6">
                  <h3 className="text-h3 font-semibold">{f.nombre}</h3>
                  <p className="mt-1 text-caption text-ink-muted">Propuesta por validar con la fundación</p>
                  <ul className="mt-4 grid gap-2">
                    {f.propuesta.map((p) => <li key={p} className="flex gap-2"><IconoCheck className="mt-1 shrink-0 text-accent" /><span>{p}</span></li>)}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-body-sm">
                    {f.productos.map(productoPorId).filter((p) => p !== undefined).map((p) => <Link key={p.id} href={`/eva/${p.slug}`} className="enlace">{p.nombre}</Link>)}
                  </div>
                  {f.nota && <p className="mt-4 text-body-sm"><Texto preview={preview}>{f.nota}</Texto></p>}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-body-sm"><Texto preview={preview}>{j.aliados.modelo}</Texto></p>
          </Section>
        )}

        <Section id="construido" titulo={j.construido.titulo} className="border-t border-line">
          <ul className="grid gap-4 md:grid-cols-2">
            {j.construido.items.map((c) => (
              <li key={c.t} className="rounded-md border border-line p-6">
                <h3 className="text-h4 font-semibold">{c.t}</h3><p className="mt-2 text-body-sm text-ink-muted">{c.d}</p>
                {c.h && <Link href={c.h} className="enlace mt-3 inline-flex items-center gap-1 text-body-sm">Ver<IconoFlecha /></Link>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-caption text-ink-muted">Fuente: {j.construido.fuentes.join(' · ')}</p>
          {j.construido.nota_metricas && <p className="mt-2 text-body-sm"><Texto preview={preview}>{j.construido.nota_metricas}</Texto></p>}
        </Section>

        <Section id="formacion" titulo={j.formaciones_dictadas.titulo} className="border-t border-line">
          <ul className="grid gap-4 md:grid-cols-2">
            {j.formaciones_dictadas.items.map((f) => (
              <li key={f.t} className="rounded-md border border-line p-6">
                <h3 className="text-h4 font-semibold">{f.t}</h3><p className="mt-2 text-body-sm">{f.d}</p>
                {f.nota && <p className="mt-2 text-body-sm"><Texto preview={preview}>{f.nota}</Texto></p>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-caption text-ink-muted">Fuente: {j.formaciones_dictadas.fuentes.join(' · ')}</p>
        </Section>

        <Section id="credenciales" titulo={j.formacion.titulo} className="border-t border-line">
          <div className="grid gap-8 md:grid-cols-2">
            <ul className="grid gap-2">{j.formacion.academica.map((a) => <li key={a} className="font-semibold">{a}</li>)}</ul>
            <ul className="grid gap-2 text-body-sm">
              {j.formacion.credenciales.filter((c) => c.soporte || preview).map((c) => (
                <li key={c.t} className="flex gap-2">{c.t}{!c.soporte && <Chip tono="revisar">Soporte pendiente</Chip>}</li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-caption text-ink-muted">Fuente: {j.formacion.fuentes.join(' · ')}</p>
          {j.formacion.nota && <p className="mt-2 text-body-sm"><Texto preview={preview}>{j.formacion.nota}</Texto></p>}
          {j.formacion.siguiente && <p className="mt-2 text-body-sm"><Texto preview={preview}>{j.formacion.siguiente}</Texto></p>}
        </Section>

        <Section id="contenido-jsgm" titulo={j.lineas_contenido.titulo} className="border-t border-line">
          <ul className="flex flex-wrap gap-2">{j.lineas_contenido.items.map((l) => <li key={l}><Chip>{l}</Chip></li>)}</ul>
        </Section>

        <section className="border-t border-line py-12" data-no-print>
          <p className="max-w-measure text-body-sm text-ink-muted">{j.aviso}</p>
          <LinkButton href={j.cta.h} className="mt-4">{j.cta.t}</LinkButton>
        </section>
      </div>
    </Marco>
  );
}
