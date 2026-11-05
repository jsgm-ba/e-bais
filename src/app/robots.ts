import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const sitio = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const produccion = process.env.VERCEL_ENV === 'production';
  return {
    rules: produccion ? { userAgent: '*', allow: '/', disallow: ['/cuenta', '/ckop/panel', '/eva/aprender', '/api/', '/sistema'] } : { userAgent: '*', disallow: '/' },
    sitemap: `${sitio}/sitemap.xml`,
  };
}
