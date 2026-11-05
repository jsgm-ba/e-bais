/** prebuild: el build falla si el contenido no cumple esquema, fuentes o términos (CLAUDE.md §4 y §5). */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { REGISTRO } from '../src/lib/content/registro';
import { verificarContenido, type Hallazgo } from '../src/lib/verificador';

const RAIZ = join(__dirname, '..', 'content');
const archivos = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? archivos(p) : n.endsWith('.json') ? [p] : [];
  });

const hallazgos: Hallazgo[] = [];
for (const ruta of archivos(RAIZ)) {
  const rel = relative(RAIZ, ruta).replace(/\\/g, '/');
  const clave = rel.startsWith('cursos/') ? 'cursos/*.json' : rel;
  const esquema = REGISTRO[clave];
  let datos: unknown;
  try { datos = JSON.parse(readFileSync(ruta, 'utf-8')); } catch (e) {
    hallazgos.push({ archivo: rel, ruta: '', regla: 'json-invalido', detalle: String(e) }); continue;
  }
  if (!esquema) { hallazgos.push({ archivo: rel, ruta: '', regla: 'sin-esquema', detalle: 'registrar en src/lib/content/registro.ts' }); continue; }
  const r = esquema.safeParse(datos);
  if (!r.success) for (const i of r.error.issues) hallazgos.push({ archivo: rel, ruta: i.path.join('.'), regla: 'esquema', detalle: i.message });
  hallazgos.push(...verificarContenido(rel, datos));
}

if (hallazgos.length) {
  for (const h of hallazgos) console.error(`✗ ${h.archivo} ${h.ruta} [${h.regla}] ${h.detalle}`);
  console.error(`\n${hallazgos.length} hallazgos. Corrige content/ antes de construir.`);
  process.exit(1);
}
console.log(`Contenido verificado: ${archivos(RAIZ).length} archivos sin hallazgos.`);
