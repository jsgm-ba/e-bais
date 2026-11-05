# Contenido de e-B&Ais

Todo el texto público sale de estos JSON. El código no contiene textos de negocio. Cada archivo tiene su esquema zod en `src/lib/content/schemas.ts` y su registro en `src/lib/content/registro.ts`.

## Reglas (las vigila `pnpm verificar`, que corre antes de cada build)
1. Cada JSON cumple su esquema.
2. `publicacion: "publicado"` exige `fuentes` (al menos una) y `aprobado_por`.
3. Sin términos prohibidos (CLAUDE.md §4). «certificado» solo en cursos con `regimen: "FB"` y `aval_fb_ref`.
4. Una cifra de trayectoria (años, contratos, %, millones, auditores, $) necesita `fuentes` en el mismo objeto o en un objeto contenedor que no sea la raíz.
5. Ningún `[[PENDIENTE: ...]]` en un elemento publicado.
6. Un elemento publicado con `permiso_ref` vacío falla: aplica a fundaciones, clientes y docentes.

## Estados
- `_estado` (o `publicacion` en el catálogo y los cursos) controla la visibilidad: `borrador` solo se ve en la vista previa (desarrollo, Vercel Preview o `NEXT_PUBLIC_PREVIEW=1`), con la etiqueta «Borrador · requiere aprobación».
- `estado` en el catálogo es el estado del producto: `en_diseno` o `confirmado`.
- `[[PENDIENTE: qué falta]]` marca un dato por confirmar; en vista previa se ve resaltado y en producción no se muestra.

## Archivos
| Archivo | Qué contiene | Cómo se actualiza |
|---|---|---|
| `catalogo.json`, `paquetes.json` | 41 productos y 6 paquetes del Catálogo Maestro 1B | **Solo** con `python3 -I scripts/importar_catalogo.py data/<xlsx>` |
| `comun.json` | Navegación, pie, etiquetas de estado, régimen D1 | A mano |
| `hub.json`, `ba.json`, `eva.json`, `ckop.json`, `soluciones.json`, `jsgm.json` | Textos de cada superficie | A mano |
| `experiencia.json` | Contratos publicables (`publicable`, `permiso_ref`, `fuentes`, `secop_url`) | Solo desde EXP CONTRACTUAL con soporte |
| `ckop_modulos.json`, `ckop_demo.json` | Estado de los módulos y datos de ejemplo del radar | A mano; la demo siempre rotulada «Dato de ejemplo» |
| `legal.json` | Autorización Ley 1581, formulario, privacidad y términos | Tras la revisión jurídica |
| `cursos/*.json` | Cursos empaquetados de EVA (módulos, lecciones, evaluación) | A mano; un archivo por curso, enlazado por `producto_id` |

## Para aprobar un texto
Cambia `publicacion` a `"publicado"`, escribe quién aprobó en `aprobado_por` (por ejemplo «MMP, 12-nov-2026»), revisa las `fuentes` y quita los `[[PENDIENTE]]`. Corre `pnpm verificar`.
