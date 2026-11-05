import type { Metadata, Viewport } from 'next';
import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';
import '@fontsource/source-serif-4/600.css';
import '@fontsource/lexend/500.css';
import '@fontsource/lexend/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/600.css';
import './globals.css';

const sitio = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(sitio),
  title: { default: 'e-B&Ais', template: '%s' },
  description: 'Consultoría y auditoría de B&A, cursos de EVA, la torre de control CKOP y soluciones de IA a la medida.',
  openGraph: { type: 'website', locale: 'es_CO', siteName: 'e-B&Ais' },
  robots: process.env.VERCEL_ENV === 'production' ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#ffffff' }, { media: '(prefers-color-scheme: dark)', color: '#0a1222' }],
};

/** Aplica el tema guardado antes de pintar, para evitar parpadeo. */
const temaInicial = `try{var t=localStorage.getItem('tema');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: temaInicial }} /></head>
      <body>{children}</body>
    </html>
  );
}
