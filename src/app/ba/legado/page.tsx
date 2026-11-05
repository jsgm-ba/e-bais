import type { Metadata } from 'next';
import { Marco } from '@/components/Marco';
import { EnPreparacion, Texto } from '@/components/ui';
import { contenido, visible } from '@/lib/content';
import { esPreview } from '@/lib/preview';

const b = contenido.ba;
const m = contenido.mmp;
export const metadata: Metadata = { title: `${m.nombre} · Dirección técnica de B&A`, description: m.resumen_carrera.texto, alternates: { canonical: '/ba/legado' } };

export default function Legado() {
  if (!visible(m._estado)) return <Marco s="ba"><EnPreparacion /></Marco>;
  const preview = esPreview();
  return (
    <Marco s="ba" borrador={m._estado.publicacion === 'borrador'}>
      <div className="contenedor py-16">
        <p className="text-label font-semibold uppercase tracking-[0.14em] text-accent">{m.rol}</p>
        <h1 className="mt-3 font-serif text-[40px] font-semibold leading-tight lg:text-display-ba">{m.nombre}</h1>
        <p className="mt-6 max-w-3xl font-serif text-h3 leading-snug">{m.resumen_carrera.texto}</p>
        <ul className="mt-8 grid max-w-measure gap-2">{b.legado.perfil.map((p) => <li key={p}>{p}</li>)}</ul>
        <p className="mt-3 text-caption text-ink-muted">Fuente: {[...new Set([...b.legado.fuentes, ...m.fuentes])].join(' · ')}</p>

        <h2 className="mt-16 font-serif text-h1-ba font-semibold">Trayectoria</h2>
        <ol className="mt-8 grid gap-0">
          {m.hitos.map((h) => (
            <li key={`${h.entidad}-${h.desde}`} className="grid gap-2 border-t border-line py-5 md:grid-cols-[140px_1fr_200px] md:gap-6">
              <span className="font-mono text-data-lg tabular text-accent">{h.desde}{h.hasta && h.hasta !== h.desde ? `–${h.hasta}` : ''}</span>
              <span><span className="text-h4 font-semibold">{h.entidad}</span>{h.tematica && <span className="mt-1 block text-body-sm text-ink-muted">{h.tematica}</span>}</span>
              <span className="text-body-sm text-ink-muted md:text-right">{h.vinculo}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-body-sm"><Texto preview={preview}>{m.nota}</Texto></p>

        <section className="mt-16 max-w-measure">
          <h2 className="font-serif text-h1-ba font-semibold">{b.legado.como_lee.titulo}</h2>
          <p className="mt-4"><Texto preview={preview}>{b.legado.como_lee.texto}</Texto></p>
        </section>
      </div>
    </Marco>
  );
}
