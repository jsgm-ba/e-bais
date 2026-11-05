import type { Metadata } from 'next';
import { LineaTarjeta, NotaAuditoria } from '@/components/LineaServicio';
import { Marco } from '@/components/Marco';
import { EnPreparacion } from '@/components/ui';
import { contenido, visible } from '@/lib/content';

const b = contenido.ba;
export const metadata: Metadata = { title: 'Servicios · B&A', description: b.meta.description, alternates: { canonical: '/ba/servicios' } };

export default function Servicios() {
  if (!visible(b._estado)) return <Marco s="ba"><EnPreparacion /></Marco>;
  return (
    <Marco s="ba" borrador={b._estado.publicacion === 'borrador'}>
      <div className="contenedor py-12">
        <h1 className="font-serif text-h1-ba font-semibold">Servicios</h1>
        <div className="mt-6 max-w-measure"><NotaAuditoria texto={b.nota_auditoria} /></div>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{b.lineas.map((l) => <li key={l.slug}><LineaTarjeta l={l} /></li>)}</ul>
      </div>
    </Marco>
  );
}
