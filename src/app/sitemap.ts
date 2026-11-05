import type { MetadataRoute } from 'next';
import { contenido, productos } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitio = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const rutas = ['/', '/ba', '/ba/servicios', '/ba/experiencia', '/ba/legado', '/ba/contacto', '/eva', '/eva/lista-de-espera', '/ckop', '/soluciones', '/jsgm', '/aliados', '/privacidad', '/terminos',
    ...contenido.ba.lineas.map((l) => `/ba/servicios/${l.slug}`),
    ...contenido.soluciones.items.map((s) => `/soluciones/${s.slug}`),
    ...productos().map((p) => `/eva/${p.slug}`)];
  return rutas.map((r) => ({ url: `${sitio}${r}` }));
}
