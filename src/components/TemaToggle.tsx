'use client';
import { useEffect, useState } from 'react';
import { IconoLuna, IconoSol } from './Iconos';

/** Cambia entre tema claro y oscuro. En CKOP el tema vive en su contenedor y arranca en oscuro. */
export function TemaToggle({ ambito = 'html' }: { ambito?: 'html' | 'ckop' }) {
  const clave = ambito === 'ckop' ? 'tema-ckop' : 'tema';
  const [tema, setTema] = useState<'light' | 'dark' | null>(null);

  const objetivo = () => (ambito === 'ckop' ? document.querySelector<HTMLElement>('[data-ambito="ckop"]') : document.documentElement);

  useEffect(() => {
    let t: string | null = null;
    try { t = localStorage.getItem(clave); } catch { /* sin almacenamiento */ }
    const actual = (t as 'light' | 'dark' | null) ?? (ambito === 'ckop' ? 'dark' : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTema(actual);
    objetivo()?.setAttribute('data-theme', actual);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function cambiar() {
    const nuevo = tema === 'dark' ? 'light' : 'dark';
    setTema(nuevo);
    objetivo()?.setAttribute('data-theme', nuevo);
    try { localStorage.setItem(clave, nuevo); } catch { /* sin almacenamiento */ }
  }

  return (
    <button type="button" onClick={cambiar} aria-label={tema === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radio,8px)] text-ink-muted hover:bg-accent-soft hover:text-accent md:h-10 md:w-10">
      {tema === 'dark' ? <IconoSol /> : <IconoLuna />}
    </button>
  );
}
