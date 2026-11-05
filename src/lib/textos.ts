import 'server-only';
import { contenido } from './content';
import type { TextosTarjeta } from '@/components/ProductoTarjeta';

export const textosTarjeta = (): TextosTarjeta => {
  const c = contenido.comun;
  return { estados: c.estados, formato: c.formato, clientes: c.clientes, regimen: c.regimen, escalon: c.escalon, cotiza: contenido.hub.cta.institucional.texto };
};

/** Formularios: activos si hay Supabase con service role o un endpoint externo. */
export const formularioActivo = () => Boolean((process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) || process.env.NEXT_PUBLIC_FORM_ENDPOINT);
