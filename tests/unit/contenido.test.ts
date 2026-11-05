import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import tokens from '../../design/tokens.json';
import catalogo from '../../content/catalogo.json';
import { Catalogo, Curso } from '@/lib/content/schemas';
import { auditar } from '@/lib/contraste';
import { verificarContenido } from '@/lib/verificador';

describe('contenido real', () => {
  it('el catálogo tiene los 41 productos del Catálogo Maestro y cumple el esquema', () => {
    const c = Catalogo.parse(catalogo);
    expect(c).toHaveLength(41);
    expect(new Set(c.map((p) => p.slug)).size).toBe(41);
    expect(c.every((p) => p.precio.aprobado_mmp === false)).toBe(true);
  });
  it('ningún archivo de content/ tiene hallazgos', () => {
    const dir = new URL('../../content/', import.meta.url);
    const archivos = [...readdirSync(dir).filter((f) => f.endsWith('.json')), ...readdirSync(new URL('cursos/', dir)).map((f) => `cursos/${f}`)];
    for (const f of archivos) expect(verificarContenido(f, JSON.parse(readFileSync(new URL(f, dir), 'utf-8')))).toEqual([]);
  });
  it('el curso piloto cumple el esquema y su evaluación es coherente', () => {
    const c = Curso.parse(JSON.parse(readFileSync(new URL('../../content/cursos/c6-01.json', import.meta.url), 'utf-8')));
    for (const q of c.evaluacion) expect(q.correcta).toBeLessThan(q.opciones.length);
    expect(c.aprobacion_minima).toBeLessThanOrEqual(c.evaluacion.length);
  });
});

describe('contraste AA', () => {
  for (const tema of ['light', 'dark'] as const) {
    it(`todas las parejas cumplen en tema ${tema}`, () => {
      expect(auditar(tokens.color[tema]).filter((f) => !f.cumple)).toEqual([]);
    });
  }
});
