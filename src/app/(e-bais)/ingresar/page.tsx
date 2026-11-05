import type { Metadata } from 'next';
import { IngresoForm } from '@/components/IngresoForm';
import { Marco } from '@/components/Marco';

export const metadata: Metadata = { title: 'Ingresar · e-B&Ais', robots: { index: false } };

export default async function Ingresar({ searchParams }: { searchParams: Promise<{ volver?: string }> }) {
  const v = (await searchParams).volver ?? '/cuenta';
  const volver = v.startsWith('/') && !v.startsWith('//') ? v : '/cuenta';
  return (
    <Marco s="hub">
      <div className="contenedor py-12">
        <h1 className="text-h2 font-bold">Ingresar</h1>
        <p className="mt-2 max-w-measure text-ink-muted">Te enviamos un enlace a tu correo. No usamos contraseñas.</p>
        <div className="mt-8"><IngresoForm volver={volver} /></div>
      </div>
    </Marco>
  );
}
