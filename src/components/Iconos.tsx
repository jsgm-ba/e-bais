/** Íconos de línea propios: trazo 1.75px, puntas redondeadas, currentColor. Decorativos con aria-hidden. */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { tam?: 16 | 20 | 24 };
const Base = ({ tam = 16, children, ...p }: P) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75 * (24 / tam)} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...p}>
    {children}
  </svg>
);

export const IconoCheck = (p: P) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="m8 12.5 2.5 2.5L16 9.5" /></Base>;
export const IconoTriangulo = (p: P) => <Base {...p}><path d="M12 3.5 21 19.5H3z" /><path d="M12 10v4" /><path d="M12 17h.01" /></Base>;
export const IconoOctagono = (p: P) => <Base {...p}><path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3z" /><path d="m9.5 9.5 5 5m0-5-5 5" /></Base>;
export const IconoInfo = (p: P) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></Base>;
export const IconoEdificio = (p: P) => <Base {...p}><path d="M4 21V5l8-2v18" /><path d="M12 9h8v12" /><path d="M3 21h18M7.5 8h1M7.5 12h1M7.5 16h1M15.5 13h1M15.5 17h1" /></Base>;
export const IconoPersona = (p: P) => <Base {...p}><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></Base>;
export const IconoEnlace = (p: P) => <Base {...p}><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" /><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" /></Base>;
export const IconoDosCirculos = (p: P) => <Base {...p}><circle cx="9" cy="12" r="5.5" /><circle cx="15" cy="12" r="5.5" /></Base>;
export const IconoReloj = (p: P) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Base>;
export const IconoLapiz = (p: P) => <Base {...p}><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></Base>;
export const IconoFlecha = (p: P) => <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>;
export const IconoSol = (p: P) => <Base {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Base>;
export const IconoLuna = (p: P) => <Base {...p}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></Base>;
