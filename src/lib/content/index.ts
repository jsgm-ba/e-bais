import 'server-only';
import * as S from './schemas';
import comun from '@content/comun.json';
import hub from '@content/hub.json';
import ba from '@content/ba.json';
import experiencia from '@content/experiencia.json';
import eva from '@content/eva.json';
import catalogo from '@content/catalogo.json';
import paquetes from '@content/paquetes.json';
import ckop from '@content/ckop.json';
import ckopModulos from '@content/ckop_modulos.json';
import ckopDemo from '@content/ckop_demo.json';
import soluciones from '@content/soluciones.json';
import legal from '@content/legal.json';
import jsgm from '@content/jsgm.json';
import aliados from '@content/aliados.json';
import cursoC601 from '@content/cursos/c6-01.json';
import { esPreview } from '../preview';

/** El build ya validó todo en prebuild; aquí se vuelve a parsear para tener tipos estrictos. */
export const contenido = {
  comun: S.Comun.parse(comun),
  hub: S.Hub.parse(hub),
  ba: S.BA.parse(ba),
  experiencia: S.Experiencia.parse(experiencia),
  eva: S.EVA.parse(eva),
  ckop: S.CKOP.parse(ckop),
  ckopModulos: S.CkopModulos.parse(ckopModulos),
  ckopDemo: S.CkopDemo.parse(ckopDemo),
  soluciones: S.Soluciones.parse(soluciones),
  legal: S.Legal.parse(legal),
  jsgm: S.JSGM.parse(jsgm),
  aliados: S.Aliados.parse(aliados),
};

const todosLosProductos = S.Catalogo.parse(catalogo);
const todosLosPaquetes = S.Paquete.array().parse(paquetes);
const todosLosCursos = [S.Curso.parse(cursoC601)];

/** Un elemento se muestra si está publicado, o si es borrador y estamos en vista previa. */
export const visible = (e: { publicacion: 'borrador' | 'publicado' }) => e.publicacion === 'publicado' || esPreview();

export const productos = () => todosLosProductos.filter(visible);
export const producto = (slug: string) => productos().find((p) => p.slug === slug);
export const productoPorId = (id: string) => todosLosProductos.find((p) => p.id === id && visible(p));
export const paquetes_ = () => todosLosPaquetes.filter(visible);
export const cursos = () => todosLosCursos.filter(visible);
export const curso = (slug: string) => cursos().find((c) => c.slug === slug);
export const cursoDeProducto = (id: string) => cursos().find((c) => c.producto_id === id);
export const conteoCatalogo = () => ({ total: todosLosProductos.length });
