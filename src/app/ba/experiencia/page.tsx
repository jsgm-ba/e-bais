import type { Metadata } from 'next';
import { Marco } from '@/components/Marco';
import { Texto } from '@/components/ui';
import { contenido, visible } from '@/lib/content';
import { cop } from '@/lib/formato';
import { esPreview } from '@/lib/preview';

const e = contenido.ba.experiencia;
const x = contenido.experiencia;
export const metadata: Metadata = { title: 'Experiencia verificable · B&A', description: e.bajada, alternates: { canonical: '/ba/experiencia' } };

/** Resumen de los contratos del RUP + tabla solo con los que tienen soporte verificado (publicable). Nunca se inventa experiencia. */
export default function Experiencia() {
  const preview = esPreview();
  const verVisible = visible(x._estado);
  const filas = verVisible ? x.filas.filter((f) => f.publicable && f.permiso_ref && f.fuentes.length > 0) : [];
  const r = x.resumen;
  const max = Math.max(...Object.values(r.por_tipo_entidad));
  return (
    <Marco s="ba" borrador={x._estado.publicacion === 'borrador'}>
      <div className="contenedor py-16">
        <h1 className="font-serif text-[40px] font-semibold leading-tight lg:text-display-ba">{e.titulo}</h1>
        <p className="mt-4 max-w-measure text-body-lg text-ink-muted">{e.bajada}</p>
        {!verVisible ? <p role="status" className="mt-8 max-w-measure rounded-md border border-line-strong bg-surface-sunken p-6">{e.en_validacion}</p> : (<>
          <section aria-labelledby="res-t" className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 id="res-t" className="font-serif text-h1-ba font-semibold">{r.contratos} contratos, {r.entidades} entidades</h2>
              <p className="mt-3 text-ink-muted">Contratos inscritos en el RUP de B&A entre {r.desde} y {r.hasta}. {r.verificados} ya tienen la certificación de la entidad verificada y se listan abajo; el resto está en validación documental.</p>
              <dl className="mt-6 grid grid-cols-2 gap-4">
                {Object.entries(r.por_servicio).map(([k, v]) => <div key={k} className="border-t border-line pt-2"><dt className="text-body-sm text-ink-muted">{k}</dt><dd className="font-serif text-h2 font-semibold tabular">{v}</dd></div>)}
              </dl>
              <p className="mt-4 text-caption text-ink-muted">Fuente: {r.fuentes.join(' · ')}</p>
              <p className="mt-2 text-body-sm"><Texto preview={preview}>{r.nota}</Texto></p>
            </div>
            <figure>
              <figcaption className="text-label font-semibold">Contratos por tipo de entidad</figcaption>
              <ul className="mt-4 grid gap-3">
                {Object.entries(r.por_tipo_entidad).map(([k, v]) => (
                  <li key={k} className="grid grid-cols-[minmax(0,220px)_1fr_32px] items-center gap-3 text-body-sm">
                    <span>{k}</span><span className="h-3 rounded-full bg-surface-sunken" aria-hidden="true"><span className="block h-3 rounded-full bg-accent" style={{ width: `${(v / max) * 100}%` }} /></span><span className="text-right font-mono text-data tabular">{v}</span>
                  </li>))}
              </ul>
            </figure>
          </section>
          <section aria-labelledby="ver-t" className="mt-16">
            <h2 id="ver-t" className="font-serif text-h1-ba font-semibold">Contratos con soporte verificado</h2>
            <div className="mt-6 overflow-x-auto rounded-md border border-line" role="region" aria-label="Contratos con soporte verificado" tabIndex={0}>
              <table className="w-full min-w-[760px] text-body-sm">
                <thead className="bg-surface-sunken"><tr>{['Entidad', 'Objeto', 'Año', 'Servicio', 'Valor', 'Soporte'].map((c) => <th key={c} scope="col" className="px-4 py-3 text-left font-semibold">{c}</th>)}</tr></thead>
                <tbody>{filas.map((f) => (
                  <tr key={f.id_rup} className="border-t border-line align-top">
                    <td className="px-4 py-3 font-semibold">{f.entidad}<span className="block text-caption font-normal text-ink-muted">{f.tipo_entidad}</span></td>
                    <td className="px-4 py-3">{f.objeto.length > 160 ? `${f.objeto.slice(0, 160)}…` : f.objeto}</td>
                    <td className="px-4 py-3 font-mono tabular">{f.anio ?? 'SIN DATO'}</td>
                    <td className="px-4 py-3">{f.servicio}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono tabular">{cop(f.valor_cop)}</td>
                    <td className="px-4 py-3 text-caption text-ink-muted">{f.secop_url ? <a className="enlace" href={f.secop_url} rel="noopener noreferrer">SECOP</a> : f.soporte}</td>
                  </tr>))}</tbody>
              </table>
            </div>
          </section>
        </>)}
      </div>
    </Marco>
  );
}
