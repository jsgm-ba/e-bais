import type { ZodTypeAny } from 'zod';
import * as S from './schemas';

/** Cada archivo de content/ con su esquema. El verificador falla si aparece un JSON sin registrar. */
export const REGISTRO: Record<string, ZodTypeAny> = {
  'comun.json': S.Comun,
  'hub.json': S.Hub,
  'ba.json': S.BA,
  'experiencia.json': S.Experiencia,
  'eva.json': S.EVA,
  'catalogo.json': S.Catalogo,
  'paquetes.json': S.Paquete.array(),
  'ckop.json': S.CKOP,
  'ckop_modulos.json': S.CkopModulos,
  'ckop_demo.json': S.CkopDemo,
  'soluciones.json': S.Soluciones,
  'legal.json': S.Legal,
  'jsgm.json': S.JSGM,
  'aliados.json': S.Aliados,
  'cursos/*.json': S.Curso,
};
