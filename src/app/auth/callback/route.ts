import { NextResponse } from 'next/server';
import { clienteServidor } from '@/lib/supabase/server';

/** Retorno del enlace mágico: intercambia el código por la sesión y vuelve a la ruta pedida. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const volver = url.searchParams.get('volver') ?? '/cuenta';
  const destino = volver.startsWith('/') && !volver.startsWith('//') ? volver : '/cuenta';
  const sb = await clienteServidor();
  if (code && sb) await sb.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL(destino, url.origin));
}
