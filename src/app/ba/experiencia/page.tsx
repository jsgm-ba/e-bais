import type { Metadata } from 'next';
import { Marco } from '@/components/Marco';
import { cop } from '@/lib/formato';
import { contenido, visible } from '@/lib/content';

const e = contenido.ba.experiencia;
const filas = contenido.experiencia.filas.filter((f) => f.publicable && f.permiso_ref && f.fuentes.length > 0 && visible(contenido.experiencia._estado));
export const metadata: Metadata = { title: 'Experiencia verificable · B&A', description: e.bajada, alternates: { canonical: '/ba/experiencia' } };

/** Solo filas con publicable=true, permiso y fuente. Si no hay, «En validación»: nunca se inventa experiencia. */
export default function Experiencia() {
  return (
    <Marco s="ba">
      <div className="contenedor py-12">
        <h1 className="font-serif text-h1-ba font-semibold">{e.titulo}</h1>
        <p className="mt-4 max-w-measure text-body-lg text-ink-muted">{e.bajada}</p>
        {filas.length === 0 ? (
          <p role="status" className="mt-8 max-w-measure rounded-md border border-line-strong bg-surface-sunken p-6">{e.en_validacion}</p>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-md border border-line" role="region" aria-label={e.titulo} tabIndex={0}>
            <table className="w-full min-w-[640px] text-body-sm">
              <thead className="bg-surface-sunken"><tr>{e.columnas.map((c) => <th key={c} scope="col" className="px-4 py-2 text-left">{c}</th>)}</tr></thead>
              <tbody>{filas.map((f) => (
                <tr key={`${f.entidad}-${f.anio}-${f.objeto}`} className="border-t border-line">
                  <td className="px-4 py-2">{f.entidad}</td><td className="px-4 py-2">{f.objeto}</td><td className="px-4 py-2 tabular">{f.anio}</td>
                  <td className="px-4 py-2 text-right tabular">{cop(f.valor_cop)}</td>
                  <td className="px-4 py-2">{f.secop_url ? <a className="enlace" href={f.secop_url} rel="noopener noreferrer">SECOP</a> : f.soporte}</td>
                </tr>))}</tbody>
            </table>
          </div>
        )}
      </div>
    </Marco>
  );
}
