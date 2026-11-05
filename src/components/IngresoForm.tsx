'use client';
import { useState, type FormEvent } from 'react';
import { clienteNavegador } from '@/lib/supabase/navegador';
import { Button } from './ui';

/** Ingreso por enlace mágico de correo (Supabase Auth). Sin Supabase configurado, lo dice y no envía. */
export function IngresoForm({ volver }: { volver: string }) {
  const [estado, setEstado] = useState<'reposo' | 'enviando' | 'enviado' | 'error'>('reposo');
  const sb = clienteNavegador();
  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!sb) return;
    setEstado('enviando');
    const correo = String(new FormData(e.currentTarget).get('correo') ?? '');
    const { error } = await sb.auth.signInWithOtp({ email: correo, options: { emailRedirectTo: `${location.origin}/auth/callback?volver=${encodeURIComponent(volver)}` } });
    setEstado(error ? 'error' : 'enviado');
  }
  if (estado === 'enviado') return <p role="status" className="rounded-md bg-viable-soft p-4 font-semibold text-viable">Te enviamos un enlace de ingreso. Revisa tu correo.</p>;
  return (
    <form onSubmit={enviar} className="grid max-w-md gap-4">
      <div>
        <label htmlFor="correo" className="text-label font-semibold">Correo electrónico</label>
        <input id="correo" name="correo" type="email" required autoComplete="email" className="mt-1 min-h-touch w-full rounded-md border border-line-strong bg-surface px-3 md:min-h-control" />
      </div>
      <Button type="submit" disabled={!sb || estado === 'enviando'}>{!sb ? 'Ingreso en preparación' : estado === 'enviando' ? 'Enviando' : 'Recibir enlace de ingreso'}</Button>
      {!sb && <p className="text-body-sm text-ink-muted">Falta configurar la base de datos del sitio (Supabase).</p>}
      <p aria-live="polite" className="text-body-sm text-noir">{estado === 'error' ? 'No pudimos enviar el enlace. Intenta de nuevo.' : ''}</p>
    </form>
  );
}
