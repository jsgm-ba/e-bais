import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PRIVADAS = ['/cuenta', '/ckop/panel', '/eva/aprender'];

/** Refresca la sesión de Supabase y protege las rutas privadas. Sin Supabase configurado, deja pasar: cada página explica qué falta. */
export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let res = NextResponse.next({ request: req });
  if (!url || !anon) return res;

  const sb = createServerClient(url, anon, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (lista) => {
        lista.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        lista.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await sb.auth.getUser();
  const privada = PRIVADAS.some((p) => req.nextUrl.pathname.startsWith(p));
  // El curso piloto se puede ver en vista previa sin sesión.
  const pilotoEnPreview = req.nextUrl.pathname.startsWith('/eva/aprender') && process.env.VERCEL_ENV !== 'production';
  if (privada && !data.user && !pilotoEnPreview) {
    const destino = req.nextUrl.clone();
    destino.pathname = '/ingresar';
    destino.searchParams.set('volver', req.nextUrl.pathname);
    return NextResponse.redirect(destino);
  }
  return res;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'] };
