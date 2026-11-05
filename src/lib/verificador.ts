/**
 * Verificador de contenido (CLAUDE.md §4 y §5). Funciones puras: las usa
 * scripts/verificar-contenido.ts en `prebuild` y las pruebas de Vitest.
 */

export type Hallazgo = { archivo: string; ruta: string; regla: string; detalle: string };

export const normalizar = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Frase permitida solo en cursos con régimen FB y aval escrito (D1). */
export const FRASE_FB = 'certificado de aprobacion expedido por fb certification sas';

export const TERMINOS_PROHIBIDOS: { patron: RegExp; etiqueta: string }[] = [
  { patron: /\b(b&a|eva|e-b&ais|ebais)\s+(certifica|certifican|acredita)\b/, etiqueta: '«B&A/EVA certifica»' },
  { patron: /\bcertificamos\b/, etiqueta: '«certificamos»' },
  { patron: /\b(estamos|somos|esta|son)\s+acreditad[oa]s?\b/, etiqueta: '«estamos acreditados»' },
  { patron: /\b(b&a|eva|e-b&ais)\b[^.;]{0,40}\bacreditad[oa]s?\b/, etiqueta: '«B&A/EVA acreditado»' },
  { patron: /\bexpedimos\b/, etiqueta: '«expedimos»' },
  { patron: /\btitulos?\b/, etiqueta: '«título»' },
  { patron: /\bdiplomas?\b/, etiqueta: '«diploma»' },
  { patron: /\bcertificacion oficial\b/, etiqueta: '«certificación oficial»' },
  { patron: /\bconducente a\b/, etiqueta: '«conducente a»' },
  { patron: /\bietdh\b/, etiqueta: '«IETDH»' },
  { patron: /\bcertificado\b/, etiqueta: '«certificado»' },
  { patron: /\bsoluciones integrales\b/, etiqueta: '«soluciones integrales»' },
  { patron: /\bde alta calidad\b/, etiqueta: '«de alta calidad»' },
  { patron: /\bexpertos comprometidos\b/, etiqueta: '«expertos comprometidos»' },
  { patron: /\ben un mundo cambiante\b/, etiqueta: '«en un mundo cambiante»' },
  { patron: /\bpotencia tu\b/, etiqueta: '«potencia tu»' },
  { patron: /\bde vanguardia\b/, etiqueta: '«de vanguardia»' },
];

/** Cifra de trayectoria: número seguido de años, contratos, %, millones o auditores; o un monto en pesos. */
export const CIFRA_TRAYECTORIA = /(\d[\d.,]*\s*\+?\s*(anos|contratos|%|millones|auditores)\b)|(\$\s?\d)/;
const PENDIENTE = /\[\[PENDIENTE[^\]]*\]\]/g;
const HAY_PENDIENTE = /\[\[PENDIENTE/;
const CLAVES_NO_TEXTO = new Set(['h', 'href', 'url', 'slug', 'id', 'producto_id', 'v', 'permiso_ref', 'aval_fb_ref', 'aprobado_por', 'clave']);

type Ctx = {
  archivo: string;
  ruta: string;
  publicado: boolean;
  conFuentes: boolean;
  fbConAval: boolean;
  esRaiz: boolean;
};

const tieneFuentes = (o: Record<string, unknown>) => Array.isArray(o.fuentes) && o.fuentes.length > 0;

export function verificarTexto(texto: string, ctx: Pick<Ctx, 'archivo' | 'ruta' | 'fbConAval'>, permitirFB = false): Hallazgo[] {
  let t = normalizar(texto.replace(PENDIENTE, ' '));
  if (permitirFB || ctx.fbConAval) t = t.split(FRASE_FB).join(' ');
  return TERMINOS_PROHIBIDOS.filter(({ patron }) => patron.test(t)).map(({ etiqueta }) => ({
    archivo: ctx.archivo, ruta: ctx.ruta, regla: 'termino-prohibido', detalle: `${etiqueta} en «${texto.slice(0, 120)}»`,
  }));
}

function recorrer(valor: unknown, ctx: Ctx, out: Hallazgo[]) {
  if (typeof valor === 'string') {
    const clave = ctx.ruta.split('.').pop() ?? '';
    if (CLAVES_NO_TEXTO.has(clave)) return;
    const permitirFB = ctx.archivo.endsWith('comun.json') && ctx.ruta === 'regimen.FB';
    // Las citas de fuente nombran documentos reales («Certificado RUP»): no son afirmaciones de B&A.
    const esCita = /(^|\.)fuentes?(\[\d+\])?$/.test(ctx.ruta);
    if (!esCita) out.push(...verificarTexto(valor, ctx, permitirFB));
    const sinPendiente = normalizar(valor.replace(PENDIENTE, ' '));
    if (!clave.startsWith('fuente') && CIFRA_TRAYECTORIA.test(sinPendiente) && !ctx.conFuentes) {
      out.push({ archivo: ctx.archivo, ruta: ctx.ruta, regla: 'cifra-sin-fuente', detalle: `«${valor.slice(0, 120)}»` });
    }
    if (ctx.publicado && HAY_PENDIENTE.test(valor)) {
      out.push({ archivo: ctx.archivo, ruta: ctx.ruta, regla: 'pendiente-publicado', detalle: valor.slice(0, 120) });
    }
    return;
  }
  if (Array.isArray(valor)) {
    valor.forEach((v, i) => recorrer(v, { ...ctx, ruta: `${ctx.ruta}[${i}]`, esRaiz: false }, out));
    return;
  }
  if (valor && typeof valor === 'object') {
    const o = valor as Record<string, unknown>;
    const estado = (o._estado ?? o) as Record<string, unknown>;
    let publicado = ctx.publicado;
    if (estado.publicacion === 'publicado') {
      publicado = true;
      if (!tieneFuentes(estado)) out.push({ archivo: ctx.archivo, ruta: ctx.ruta || '(raíz)', regla: 'publicado-sin-fuentes', detalle: 'publicacion="publicado" exige al menos una fuente' });
      if (!estado.aprobado_por) out.push({ archivo: ctx.archivo, ruta: ctx.ruta || '(raíz)', regla: 'publicado-sin-aprobacion', detalle: 'publicacion="publicado" exige aprobado_por' });
    } else if (estado.publicacion === 'borrador') {
      publicado = false;
    }
    if (publicado && 'permiso_ref' in o && !o.permiso_ref) {
      out.push({ archivo: ctx.archivo, ruta: ctx.ruta, regla: 'nombre-sin-permiso', detalle: 'nombre de aliado, cliente o docente sin permiso_ref' });
    }
    // Las fuentes de la raíz de una página no cubren cifras: la fuente debe ir en el mismo objeto o en un objeto contenedor que no sea la raíz.
    const conFuentes = ctx.conFuentes || (!ctx.esRaiz && tieneFuentes(o));
    const fbConAval = ctx.fbConAval || (o.regimen === 'FB' && typeof o.aval_fb_ref === 'string' && o.aval_fb_ref.length > 0);
    for (const [k, v] of Object.entries(o)) {
      if (k === '_estado') continue;
      recorrer(v, { ...ctx, ruta: ctx.ruta ? `${ctx.ruta}.${k}` : k, publicado, conFuentes, fbConAval, esRaiz: false }, out);
    }
  }
}

/** Verifica un archivo de contenido ya parseado. */
export function verificarContenido(archivo: string, datos: unknown): Hallazgo[] {
  const out: Hallazgo[] = [];
  recorrer(datos, { archivo, ruta: '', publicado: false, conFuentes: false, fbConAval: false, esRaiz: !Array.isArray(datos) }, out);
  return out;
}
