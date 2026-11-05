import type { Metadata } from 'next';
import { Formulario } from '@/components/Formulario';
import { Marco } from '@/components/Marco';
import { contenido, productoPorId, productos } from '@/lib/content';
import { formularioActivo } from '@/lib/textos';

const l = contenido.eva.lista_espera;
const f = contenido.legal.formulario;
export const metadata: Metadata = { title: `${l.titulo} · EVA`, description: l.bajada, alternates: { canonical: '/eva/lista-de-espera' } };

export default async function ListaEspera({ searchParams }: { searchParams: Promise<{ producto?: string }> }) {
  const id = (await searchParams).producto;
  const elegido = id ? productoPorId(id) : undefined;
  return (
    <Marco s="eva">
      <div className="contenedor py-12">
        <h1 className="font-eva text-display-eva font-semibold leading-tight">{l.titulo}</h1>
        <p className="mt-4 max-w-measure text-body-lg text-ink-muted">{l.bajada}</p>
        <div className="mt-8">
          <Formulario tipo="lista_espera" activo={formularioActivo()} textos={{ ...f, enviar: l.enviar }} autorizacion={contenido.legal.autorizacion}
            campos={[
              { nombre: 'nombre', etiqueta: f.nombre!, requerido: true, autocompletar: 'name' },
              { nombre: 'correo', etiqueta: f.correo!, tipo: 'email', requerido: true, autocompletar: 'email' },
              { nombre: 'perfil', etiqueta: f.perfil!, tipo: 'select', requerido: true, opciones: contenido.hub.quien.perfiles.map((p) => ({ v: p.id, t: p.etiqueta })) },
              { nombre: 'producto_id', etiqueta: f.interes!, tipo: 'select', opciones: productos().map((p) => ({ v: p.id, t: p.nombre })), valor: elegido?.id },
            ]} />
        </div>
      </div>
    </Marco>
  );
}
