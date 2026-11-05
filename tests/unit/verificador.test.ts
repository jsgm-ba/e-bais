import { describe, expect, it } from 'vitest';
import { verificarContenido } from '@/lib/verificador';

const reglas = (archivo: string, d: unknown) => verificarContenido(archivo, d).map((h) => h.regla);
const pub = { publicacion: 'publicado', aprobado_por: 'MMP', fuentes: ['Soporte X'] };

describe('regla 2: publicado exige fuentes y aprobación', () => {
  it('falla sin fuentes', () => {
    expect(reglas('eva.json', { _estado: { publicacion: 'publicado', aprobado_por: 'MMP', fuentes: [] } })).toContain('publicado-sin-fuentes');
  });
  it('falla sin aprobado_por', () => {
    expect(reglas('catalogo.json', [{ publicacion: 'publicado', aprobado_por: null, fuentes: ['x'], nombre: 'Curso' }])).toContain('publicado-sin-aprobacion');
  });
  it('pasa con fuentes y aprobación', () => {
    expect(reglas('eva.json', { _estado: pub, hero: { titular: 'Aprende resolviendo' } })).toEqual([]);
  });
  it('un borrador no exige fuentes', () => {
    expect(reglas('eva.json', { _estado: { publicacion: 'borrador', aprobado_por: null, fuentes: [] } })).toEqual([]);
  });
});

describe('regla 3: términos prohibidos', () => {
  it('detecta «diploma» en EVA, sin importar mayúsculas', () => {
    expect(reglas('eva.json', { _estado: pub, hero: { titular: 'Obtén tu DIPLOMA' } })).toContain('termino-prohibido');
  });
  it('no confunde «diplomado» con «diploma»', () => {
    expect(reglas('eva.json', { _estado: pub, x: 'Ruta larga tipo diplomado' })).toEqual([]);
  });
  it('detecta «título» con y sin tilde', () => {
    expect(reglas('eva.json', { x: 'Recibe tu título' })).toContain('termino-prohibido');
    expect(reglas('eva.json', { x: 'Recibe tu titulo' })).toContain('termino-prohibido');
  });
  it('detecta «B&A certifica» y «EVA está acreditada»', () => {
    expect(reglas('ba.json', { x: 'B&A certifica tu sistema' })).toContain('termino-prohibido');
    expect(reglas('eva.json', { x: 'EVA está acreditada por el ministerio' })).toContain('termino-prohibido');
  });
  it('permite «organismo de certificación acreditado»', () => {
    expect(reglas('ba.json', { x: 'La auditoría la realiza un organismo de certificación acreditado; B&A trabaja con un aliado.' })).toEqual([]);
  });
  it('«certificado» solo se permite con régimen FB y aval', () => {
    const frase = 'Certificado de aprobación expedido por FB Certification SAS, en alianza con B&A';
    expect(reglas('catalogo.json', [{ regimen: 'REQUIERE_AVAL_FB', aval_fb_ref: null, fuentes: ['x'], d: frase }])).toContain('termino-prohibido');
    expect(reglas('catalogo.json', [{ regimen: 'FB', aval_fb_ref: 'Carta FB 2026-11', fuentes: ['x'], d: frase }])).toEqual([]);
  });
  it('permite el nombre de un documento en una cita de fuente, pero no en el texto', () => {
    expect(reglas('ba.json', { a: { t: 'Desde 1996', fuentes: ['Certificado RUP 2026'] } })).toEqual([]);
    expect(reglas('ba.json', { a: { t: 'Entregamos un certificado', fuentes: ['x'] } })).toContain('termino-prohibido');
  });
  it('detecta frases vacías', () => {
    expect(reglas('hub.json', { x: 'Soluciones integrales de alta calidad' })).toContain('termino-prohibido');
  });
  it('ignora términos dentro de un [[PENDIENTE]]', () => {
    expect(reglas('hub.json', { x: '[[PENDIENTE: ¿se puede decir diploma?]]' })).toEqual([]);
  });
});

describe('regla 4: cifras de trayectoria con fuente', () => {
  it('falla «30 años» sin fuente en el objeto', () => {
    expect(reglas('hub.json', { _estado: { publicacion: 'borrador', aprobado_por: null, fuentes: ['x'] }, hero: { t: 'Más de 30 años' } })).toContain('cifra-sin-fuente');
  });
  it('falla «89 contratos» y «$ 5.294 millones» sin fuente', () => {
    expect(reglas('ba.json', { a: { t: '89 contratos' } })).toContain('cifra-sin-fuente');
    expect(reglas('ba.json', { a: { t: '$ 5.294 millones' } })).toContain('cifra-sin-fuente');
  });
  it('pasa con fuentes en el mismo objeto', () => {
    expect(reglas('ba.json', { a: { t: '65 contratos', fuentes: ['RUP 19-ago-2026'] } })).toEqual([]);
  });
});

describe('regla 5 y permisos', () => {
  it('falla un [[PENDIENTE]] en un elemento publicado', () => {
    expect(reglas('ba.json', { _estado: pub, x: 'Texto [[PENDIENTE: dato]]' })).toContain('pendiente-publicado');
  });
  it('falla un nombre sin permiso_ref en publicado', () => {
    expect(reglas('jsgm.json', { _estado: pub, f: [{ nombre: 'Fundación X', permiso_ref: null }] })).toContain('nombre-sin-permiso');
  });
});
