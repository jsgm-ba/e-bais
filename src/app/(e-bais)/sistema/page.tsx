import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EstadoSemaforo } from '@/components/EstadoSemaforo';
import * as I from '@/components/Iconos';
import { TablaDensa } from '@/components/TablaDensa';
import { Button, Chip, DatoEjemplo, LinkButton, LogoSlot } from '@/components/ui';
import tokens from '../../../../design/tokens.json';
import { auditar } from '@/lib/contraste';
import { contenido } from '@/lib/content';
import { cop, plazo } from '@/lib/formato';
import { esPreview } from '@/lib/preview';

export const metadata: Metadata = { title: 'Sistema de diseño · e-B&Ais', robots: { index: false } };

function Muestra({ producto, tema }: { producto: 'ba' | 'eva' | 'ckop'; tema: 'light' | 'dark' }) {
  const fila = contenido.ckopDemo.filas.slice(0, 3);
  return (
    <section data-product={producto} data-theme={tema} aria-label={`${producto} en tema ${tema === 'light' ? 'claro' : 'oscuro'}`} className="grid gap-4 rounded-[var(--radio)] border border-line p-6">
      <p className="font-mono text-data text-ink-muted">data-product=&quot;{producto}&quot; · {tema}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button>Principal</Button><Button variante="secundario">Secundario</Button><Button variante="fantasma">Fantasma</Button><Button disabled>Deshabilitado</Button>
        <LinkButton href="#">Enlace botón</LinkButton>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip>Neutro</Chip><Chip tono="acento">Acento</Chip><EstadoSemaforo estado="viable" /><EstadoSemaforo estado="revisar" /><EstadoSemaforo estado="noir" /><DatoEjemplo /><LogoSlot />
      </div>
      <div className="flex flex-wrap gap-3 text-ink-muted">
        {[I.IconoCheck, I.IconoTriangulo, I.IconoOctagono, I.IconoInfo, I.IconoEdificio, I.IconoPersona, I.IconoEnlace, I.IconoDosCirculos, I.IconoReloj, I.IconoLapiz].map((C, i) => <C key={i} tam={20} />)}
      </div>
      <TablaDensa titulo={`Tabla densa ${producto} ${tema}`} filas={fila} clave={(f) => f.codigo} columnas={[
        { clave: 'c', titulo: 'Proceso', celda: (f) => <span className="font-mono text-data">{f.codigo}</span> },
        { clave: 'v', titulo: 'Valor', numerica: true, celda: (f) => cop(f.valor) },
        { clave: 'p', titulo: 'Cierre', numerica: true, celda: (f) => plazo(f.cierre!, new Date('2026-11-05T12:00:00-05:00')) },
        { clave: 's', titulo: 'Semáforo', celda: (f) => <EstadoSemaforo estado={f.estado} /> },
      ]} />
    </section>
  );
}

/** Solo vista previa: todos los componentes en los tres productos y ambos temas, más la auditoría de contraste. */
export default function Sistema() {
  if (!esPreview()) notFound();
  return (
    <main id="contenido" className="contenedor-wide grid gap-6 py-8">
      <h1 className="text-h2 font-bold">Sistema de diseño e-B&Ais</h1>
      <div className="grid gap-6 xl:grid-cols-2">
        {(['ba', 'eva', 'ckop'] as const).flatMap((p) => (['light', 'dark'] as const).map((t) => <Muestra key={`${p}-${t}`} producto={p} tema={t} />))}
      </div>
      <section aria-labelledby="contraste"><h2 id="contraste" className="text-h3 font-semibold">Contraste calculado (WCAG 2.2 AA)</h2>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          {(['light', 'dark'] as const).map((t) => (
            <table key={t} className="text-body-sm"><caption className="text-left font-semibold">{t === 'light' ? 'Claro' : 'Oscuro'}</caption>
              <tbody>{auditar(tokens.color[t]).map((f) => <tr key={`${f.texto}-${f.fondo}`} className="border-t border-line"><td className="py-1 font-mono text-data">{f.texto} / {f.fondo}</td><td className="text-right font-mono text-data">{f.razon}:1</td><td className="pl-2">{f.cumple ? 'Cumple' : 'No cumple'}</td></tr>)}</tbody>
            </table>))}
        </div>
      </section>
    </main>
  );
}
