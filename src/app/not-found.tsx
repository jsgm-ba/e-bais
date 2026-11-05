import { Marco } from '@/components/Marco';
import { LinkButton } from '@/components/ui';
import { contenido } from '@/lib/content';

export default function NoEncontrado() {
  const n = contenido.comun.no_encontrado;
  return (
    <Marco s="hub">
      <div className="contenedor py-24">
        <p className="font-mono text-data text-ink-muted">404</p>
        <h1 className="mt-2 text-h2 font-bold">{n.titulo}</h1>
        <p className="mt-2 text-ink-muted">{n.texto}</p>
        <LinkButton href="/" className="mt-6">{n.accion}</LinkButton>
      </div>
    </Marco>
  );
}
