import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Marco } from '@/components/Marco';
import { Button } from '@/components/ui';
import { clienteServidor, esEquipo, sesionActual } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Mi cuenta · e-B&Ais', robots: { index: false } };
export const dynamic = 'force-dynamic';

async function salir() {
  'use server';
  const sb = await clienteServidor();
  await sb?.auth.signOut();
  redirect('/');
}

export default async function Cuenta() {
  const sesion = await sesionActual();
  if (!sesion) {
    return <Marco s="hub"><div className="contenedor py-12"><h1 className="text-h2 font-bold">Mi cuenta</h1><p className="mt-4"><Link href="/ingresar" className="enlace">Ingresa con tu correo</Link> para ver tus cursos y autorizaciones.</p></div></Marco>;
  }
  const sb = (await clienteServidor())!;
  const [{ data: avance }, { data: autorizaciones }] = await Promise.all([
    sb.from('avance').select('curso, leccion'),
    sb.from('autorizacion_datos').select('finalidad, version_texto, otorgada, revocada').order('otorgada', { ascending: false }),
  ]);
  const porCurso = Object.entries((avance ?? []).reduce<Record<string, number>>((a, r) => ({ ...a, [r.curso]: (a[r.curso] ?? 0) + 1 }), {}));
  return (
    <Marco s="hub">
      <div className="contenedor grid gap-8 py-12">
        <div>
          <h1 className="text-h2 font-bold">Mi cuenta</h1>
          <p className="mt-2 text-ink-muted">{sesion.correo}</p>
        </div>
        <section aria-labelledby="mis-cursos"><h2 id="mis-cursos" className="text-h3 font-semibold">Mis cursos</h2>
          {porCurso.length === 0 ? <p className="mt-2"><Link href="/eva/aprender" className="enlace">Empieza el curso piloto</Link></p> : (
            <ul className="mt-2 grid gap-2">{porCurso.map(([c, n]) => <li key={c}><Link href={`/eva/aprender/${c}`} className="enlace">{c}</Link> · {n} lecciones completadas</li>)}</ul>)}
        </section>
        {esEquipo(sesion) && <section aria-labelledby="eq"><h2 id="eq" className="text-h3 font-semibold">Equipo B&A</h2><p className="mt-2"><Link href="/ckop/panel" className="enlace">Abrir el panel CKOP</Link></p></section>}
        <section aria-labelledby="aut"><h2 id="aut" className="text-h3 font-semibold">Autorizaciones de datos</h2>
          {(autorizaciones ?? []).length === 0 ? <p className="mt-2 text-ink-muted">Sin autorizaciones registradas con tu cuenta.</p> : (
            <ul className="mt-2 grid gap-2 text-body-sm">{autorizaciones!.map((a) => <li key={`${a.finalidad}-${a.otorgada}`}>{a.finalidad} · versión {a.version_texto}{a.revocada ? ' · revocada' : ''}</li>)}</ul>)}
          <p className="mt-2 text-body-sm text-ink-muted">Para revocar una autorización o suprimir tus datos, escríbenos desde <Link href="/ba/contacto" className="enlace">contacto</Link>.</p>
        </section>
        <form action={salir}><Button type="submit" variante="secundario">Salir</Button></form>
      </div>
    </Marco>
  );
}
