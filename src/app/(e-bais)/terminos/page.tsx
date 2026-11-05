import type { Metadata } from 'next';
import { Marco } from '@/components/Marco';
import { BorradorBadge, Texto } from '@/components/ui';
import { contenido } from '@/lib/content';
import { esPreview } from '@/lib/preview';

const l = contenido.legal;
const d = l.terminos;
export const metadata: Metadata = { title: `${d.titulo} · e-B&Ais`, alternates: { canonical: '/terminos' } };

/** Texto legal: borrador visible siempre con su aviso hasta la revisión jurídica. */
export default function Pagina() {
  const preview = esPreview();
  return (
    <Marco s="hub">
      <article className="contenedor py-12">
        <BorradorBadge texto={l.aviso_juridico} />
        <h1 className="mt-4 text-h2 font-bold">{d.titulo}</h1>
        <div className="mt-6 grid max-w-measure gap-6">
          {d.secciones.map((s) => (
            <section key={s.t}><h2 className="text-h4 font-semibold">{s.t}</h2><p className="mt-2"><Texto preview={preview}>{s.p}</Texto></p></section>
          ))}
        </div>
      </article>
    </Marco>
  );
}
