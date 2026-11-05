import type { Metadata } from 'next';
import { Formulario } from '@/components/Formulario';
import { Marco } from '@/components/Marco';
import { contenido } from '@/lib/content';
import { formularioActivo } from '@/lib/textos';

const c = contenido.ba.contacto;
const f = contenido.legal.formulario;
export const metadata: Metadata = { title: 'Contacto · B&A', description: c.bajada, alternates: { canonical: '/ba/contacto' } };

export default async function Contacto({ searchParams }: { searchParams: Promise<{ motivo?: string }> }) {
  const { motivo } = await searchParams;
  const valido = c.motivos.some((m) => m.v === motivo) ? motivo : undefined;
  return (
    <Marco s="ba">
      <div className="contenedor py-12">
        <h1 className="font-serif text-h1-ba font-semibold">{c.titulo}</h1>
        <p className="mt-4 max-w-measure text-body-lg text-ink-muted">{c.bajada}</p>
        <div className="mt-8">
          <Formulario tipo="cotizacion" activo={formularioActivo()} textos={f} autorizacion={contenido.legal.autorizacion}
            campos={[
              { nombre: 'nombre', etiqueta: f.nombre!, requerido: true, autocompletar: 'name' },
              { nombre: 'correo', etiqueta: f.correo!, tipo: 'email', requerido: true, autocompletar: 'email' },
              { nombre: 'organizacion', etiqueta: f.organizacion!, autocompletar: 'organization' },
              { nombre: 'motivo', etiqueta: f.motivo!, tipo: 'select', requerido: true, opciones: c.motivos, valor: valido },
              { nombre: 'mensaje', etiqueta: f.mensaje!, tipo: 'textarea' },
            ]} />
        </div>
      </div>
    </Marco>
  );
}
