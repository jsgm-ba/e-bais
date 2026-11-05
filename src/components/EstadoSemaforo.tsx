import type { SemaforoEstado } from '@/lib/content/schemas';
import { ETIQUETA_SEMAFORO } from '@/lib/semaforo';
import { IconoCheck, IconoOctagono, IconoTriangulo } from './Iconos';
import { cx } from './ui';

/** Semáforo: siempre ícono + palabra (Viable y No ir tienen luminancia casi igual). */
export function EstadoSemaforo({ estado, tam = 16, className }: { estado: SemaforoEstado | null; tam?: 16 | 20; className?: string }) {
  if (!estado) return <span className="text-caption text-ink-muted">Sin decisión</span>;
  const Icono = { viable: IconoCheck, revisar: IconoTriangulo, noir: IconoOctagono }[estado];
  const tono = { viable: 'bg-viable-soft text-viable', revisar: 'bg-revisar-soft text-revisar', noir: 'bg-noir-soft text-noir' }[estado];
  return (
    <span className={cx('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-px text-caption font-semibold', tono, className)}>
      <Icono tam={tam} />
      {ETIQUETA_SEMAFORO[estado]}
    </span>
  );
}
