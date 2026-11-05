import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient as crearAdmin } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseConfigurado, supabaseUrl } from './config';

export type Rol = 'participante' | 'equipo_ba' | 'admin';
export type Sesion = { id: string; correo: string; rol: Rol } | null;

export async function clienteServidor() {
  if (!supabaseConfigurado()) return null;
  const almacen = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => almacen.getAll(),
      setAll: (lista) => {
        try { lista.forEach(({ name, value, options }) => almacen.set(name, value, options)); } catch { /* en Server Components no se pueden escribir cookies */ }
      },
    },
  });
}

/** Cliente con service role: solo en rutas de servidor que ya validaron permisos (cron, formularios). */
export function clienteAdmin() {
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !clave) return null;
  return crearAdmin(supabaseUrl, clave, { auth: { persistSession: false } });
}

export async function sesionActual(): Promise<Sesion> {
  const sb = await clienteServidor();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  if (!data.user) return null;
  const { data: perfil } = await sb.from('perfil').select('rol').eq('id', data.user.id).maybeSingle();
  return { id: data.user.id, correo: data.user.email ?? '', rol: (perfil?.rol as Rol) ?? 'participante' };
}

export const esEquipo = (s: Sesion) => s?.rol === 'equipo_ba' || s?.rol === 'admin';
