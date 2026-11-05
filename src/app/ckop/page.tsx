import type { Metadata } from 'next';
import { EstadoSemaforo } from '@/components/EstadoSemaforo';
import { Marco } from '@/components/Marco';
import { TablaDensa } from '@/components/TablaDensa';
import { Chip, DatoEjemplo, EnPreparacion, LinkButton, Section } from '@/components/ui';
import { contenido, visible } from '@/lib/content';
import type { FilaProceso } from '@/lib/content/schemas';
import { cop, plazo } from '@/lib/formato';

const k = contenido.ckop;
const m = contenido.ckopModulos;
const demo = contenido.ckopDemo;
export const metadata: Metadata = { title: k.meta.title, description: k.meta.description, alternates: { canonical: '/ckop' } };

export default function CKOP() {
  if (!visible(k._estado)) return <Marco s="ckop"><EnPreparacion /></Marco>;
  const c = k.demo.columnas;
  return (
    <Marco s="ckop" borrador={k._estado.publicacion === 'borrador'}>
      <div className="contenedor-wide">
        <section className="py-12" aria-labelledby="ckop-titular">
          <p className="font-mono text-label font-semibold uppercase tracking-widest text-accent">{k.hero.antetitulo}</p>
          <h1 id="ckop-titular" className="mt-2 max-w-4xl text-h2 font-semibold">{k.hero.titular}</h1>
          <p className="mt-3 max-w-measure text-ink-muted">{k.hero.bajada}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <LinkButton href="/ckop/panel" className="!min-h-control-ckop h-control-ckop">{k.ingresar.t}</LinkButton>
            <span className="text-body-sm text-ink-muted">{k.ingresar.deshabilitado}</span>
          </div>
        </section>
        <section aria-label="Las tres decisiones" className="grid gap-2 md:grid-cols-3">
          {k.decisiones.map((d, i) => (
            <div key={d.t} className="rounded-sm border border-line bg-surface-raised p-4">
              <p className="font-mono text-data text-accent">0{i + 1}</p>
              <h2 className="mt-1 text-h4 font-semibold">{d.t}</h2>
              <p className="mt-1 text-body-sm text-ink-muted">{d.d}</p>
            </div>
          ))}
        </section>
        <section aria-labelledby="traccion-t" className="mt-8 rounded-sm border border-line bg-surface-raised p-4">
          <h2 id="traccion-t" className="text-h4 font-semibold">{k.traccion.titulo}</h2>
          <ul className="mt-3 grid gap-4 md:grid-cols-2">{k.traccion.items.map((t) => <li key={t.etiqueta} className="flex items-baseline gap-3"><span className="font-mono text-kpi font-semibold tabular text-accent">{t.cifra}</span><span className="text-body-sm text-ink-muted">{t.etiqueta}</span></li>)}</ul>
          <p className="mt-2 text-caption text-ink-muted">Fuente: {k.traccion.fuentes.join(' · ')}</p>
        </section>
        <Section id="como" titulo={k.como.titulo} denso className="mt-8">
          <ol className="grid gap-2 md:grid-cols-4">{k.como.pasos.map((p, i) => <li key={p} className="rounded-sm border border-line p-3 text-body-sm"><span className="font-mono text-data text-accent">{i + 1}.</span> {p}</li>)}</ol>
        </Section>
        <Section id="principios" titulo={k.principios.titulo} denso>
          <ul className="flex flex-wrap gap-2">{k.principios.items.map((p) => <li key={p}><Chip>{p}</Chip></li>)}</ul>
        </Section>
        <Section id="demo" titulo={k.demo.titulo} denso>
          <div className="mb-2"><DatoEjemplo texto={k.demo.aviso} /></div>
          <TablaDensa<FilaProceso> titulo={`${k.demo.titulo} (${k.demo.aviso})`} filas={demo.filas} clave={(f) => f.codigo}
            columnas={[
              { clave: 'codigo', titulo: c.codigo!, celda: (f) => <span className="font-mono text-data">{f.codigo}</span> },
              { clave: 'entidad', titulo: c.entidad!, celda: (f) => f.entidad },
              { clave: 'objeto', titulo: c.objeto!, celda: (f) => f.objeto },
              { clave: 'valor', titulo: c.valor!, numerica: true, celda: (f) => cop(f.valor) },
              { clave: 'cierre', titulo: c.cierre!, numerica: true, celda: (f) => (f.cierre ? plazo(f.cierre, new Date('2026-11-05T12:00:00-05:00')) : 'SIN DATO') },
              { clave: 'estado', titulo: c.estado!, celda: (f) => <EstadoSemaforo estado={f.estado} /> },
            ]} />
        </Section>
        <Section id="modulos" titulo={k.modulos_titulo} denso>
          <TablaDensa titulo={k.modulos_titulo} filas={m.modulos} clave={(x) => x.id}
            columnas={[
              { clave: 'id', titulo: 'Módulo', celda: (x) => <span className="font-mono text-data">{x.id}</span> },
              { clave: 'nombre', titulo: 'Alcance', celda: (x) => x.nombre },
              { clave: 'estado', titulo: 'Estado', celda: (x) => <Chip tono={x.estado === 'disponible' ? 'acento' : 'neutro'}>{m.etiquetas[x.estado]}</Chip> },
            ]} />
        </Section>
      </div>
    </Marco>
  );
}
