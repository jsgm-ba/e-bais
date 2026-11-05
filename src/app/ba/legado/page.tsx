import type { Metadata } from 'next';
import { Marco } from '@/components/Marco';
import { EnPreparacion, Section, Texto } from '@/components/ui';
import { contenido, visible } from '@/lib/content';
import { esPreview } from '@/lib/preview';

const b = contenido.ba;
export const metadata: Metadata = { title: 'Legado · B&A', description: b.legado.bajada, alternates: { canonical: '/ba/legado' } };

export default function Legado() {
  if (!visible(b._estado)) return <Marco s="ba"><EnPreparacion /></Marco>;
  const preview = esPreview();
  const l = b.legado;
  return (
    <Marco s="ba" borrador={b._estado.publicacion === 'borrador'}>
      <div className="contenedor py-12">
        <h1 className="font-serif text-h1-ba font-semibold">{l.titulo}</h1>
        <p className="mt-4 text-body-lg text-ink-muted">{l.bajada}</p>
        <ul className="mt-8 grid max-w-measure gap-3">{l.perfil.map((p) => <li key={p} className="border-l-0 pl-0">{p}</li>)}</ul>
        <p className="mt-2 text-caption text-ink-muted">Fuente: {l.fuentes.join(' · ')}</p>
        <p className="mt-4"><Texto preview={preview}>{l.trayectoria}</Texto></p>
        <Section titulo={l.como_lee.titulo} nivel={2}><p><Texto preview={preview}>{l.como_lee.texto}</Texto></p></Section>
      </div>
    </Marco>
  );
}
