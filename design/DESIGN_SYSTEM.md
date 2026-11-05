e-B&Ais es la marca digital de Business & Auditing Consultores (B&A): un mismo sistema azul y blanco para tres superficies con oficios distintos. Escriba siempre en español de Colombia.

## Tres superficies, una familia

| Superficie | Carácter | Acento | Densidad | Radios | Titulares |
|---|---|---|---|---|---|
| Sitio B&A | Sobrio y confiable | `ba` | Amplia (`space-16` entre secciones) | `radius-md` | `display-ba`, `h1-ba` (Source Serif 4) |
| CKOP | Torre de control densa estilo terminal, legible | `ckop` | Densa (`row-dense`, `space-1`–`space-4`) | `radius-xs`, `radius-sm` | `h4`, `overline`; cifras en `kpi`/`data` (IBM Plex Mono) |
| EVA | Educativo y cálido dentro del azul | `eva` | Amplia | `radius-lg`, `radius-xl` | `display-eva`, `h-eva` (Lexend) |

- Ponga `data-product="ba|ckop|eva"` en el contenedor de cada superficie: reasigna `accent`, `accent-soft` y `on-accent`. Los componentes pintan con `accent`, nunca con un acento fijo.
- Use un solo acento por pantalla. `ba` sigue siendo el color de enlaces del pie y del foco en las tres superficies.
- CKOP se diseña primero para el tema oscuro (uso prolongado frente a datos) y debe funcionar igual en claro.

## Voz y contenido

- Directa, precisa, sin adornos: «Cierra en 24 horas. Faltan 2 documentos.» Nada de signos de exclamación, emoji ni superlativos.
- Trate de usted en el sitio B&A; de tú en EVA; en CKOP, frases nominales cortas («Experiencia acreditada 3/3»).
- Mayúscula solo inicial en títulos y botones. Siglas como se escriben oficialmente: SECOP II, UNSPSC, NIT, UT, ISO 9001.
- Cifras en es-CO: miles con punto, decimales con coma, moneda `$ 48.200.000`; plazos `D-3 · 14:00`; fechas `30 oct. 2026`.
- Toda cifra, cliente, aliado o experiencia publicada lleva fuente. En prototipos y previews marque «Dato de ejemplo».
- Palabras prohibidas en EVA mientras no haya licencia: «certificado», «certificación oficial», «diploma», «título». Use «constancia de asistencia».
- B&A no es organismo de certificación: nunca escriba «B&A certifica».

## Color

- Base: blanco (`surface`) y azul B&A (`ba`). El negro (`ink`) es solo tipografía; no lo use como fondo ni como relleno de bloques. El tema oscuro es azul noche (`surface` #0a1222), no negro.
- Acentos por producto, todos en la familia azul y separados por tono **y** por luminosidad para que no se confundan entre sí:
  - `ba` #1d4ed8 (azul real) — la marca madre, institucional; es el ancla del sistema.
  - `ckop` #0a6c8c (cian petróleo; #3ccfea en oscuro) — evoca radar y pantalla de datos, se lee bien en fondo oscuro y no compite con el azul de enlaces.
  - `eva` #4338ca (índigo) — el azul más cálido de la familia; sugiere aula y estudio sin salir del azul. Sin degradados azul-violeta.
- Texto sobre relleno de acento: `on-ba`, `on-ckop`, `on-eva` (blanco en claro, azul noche en oscuro), nunca blanco literal.
- Divisores en `line`; bordes de control en `line-strong`.

## Semáforo

- Tres estados funcionales, mínimos: `viable` (verde), `revisar` (ámbar), `noir` (rojo, «No ir»). Úselos solo para estado de decisión, alertas y errores; nunca como decoración ni en ilustraciones.
- Cada estado lleva siempre **ícono + palabra**: check en círculo «Viable», triángulo «Revisar», X en octágono «No ir». Viable y No ir tienen luminancia casi igual (1.17:1 entre sí): la forma del ícono y la palabra son las que los distinguen para personas con daltonismo.
- El texto del estado va en su color sobre su `*-soft` o sobre las superficies; el cuerpo de una alerta va en `ink`.

## Contraste (WCAG 2.2 AA, calculado)

Razones calculadas con la fórmula de luminancia relativa WCAG sobre los hex de `tokens.json`, en ambos temas. Todas las parejas de uso cumplen.

| Texto / marca | Fondo | Claro | Oscuro | Mínimo exigido |
|---|---|---|---|---|
| `ink` | `surface` | 19.18:1 | 16.65:1 | 4.5:1 (texto) |
| `ink` | `surface-sunken` | 17.71:1 | 17.41:1 | 4.5:1 (texto) |
| `ink` | `surface-raised` | 19.18:1 | 15.14:1 | 4.5:1 (texto) |
| `ink` | `ba-soft` | 16.65:1 | 13.42:1 | 4.5:1 (texto) |
| `ink` | `ckop-soft` | 16.93:1 | 13.38:1 | 4.5:1 (texto) |
| `ink` | `eva-soft` | 16.59:1 | 14.26:1 | 4.5:1 (texto) |
| `ink-muted` | `surface` | 7.51:1 | 8.93:1 | 4.5:1 (texto) |
| `ink-muted` | `surface-raised` | 7.51:1 | 8.12:1 | 4.5:1 (texto) |
| `ink-muted` | `ba-soft` | 6.52:1 | 7.19:1 | 4.5:1 (texto) |
| `ba` | `surface` | 6.70:1 | 8.50:1 | 4.5:1 (texto) |
| `ba` | `surface-sunken` | 6.19:1 | 8.88:1 | 4.5:1 (texto) |
| `ba` | `ba-soft` | 5.82:1 | 6.84:1 | 4.5:1 (texto) |
| `on-ba` | `ba` | 6.70:1 | 8.50:1 | 4.5:1 (texto) |
| `ckop` | `surface` | 5.94:1 | 10.07:1 | 4.5:1 (texto) |
| `ckop` | `surface-raised` | 5.94:1 | 9.16:1 | 4.5:1 (texto) |
| `ckop` | `ckop-soft` | 5.24:1 | 8.09:1 | 4.5:1 (texto) |
| `on-ckop` | `ckop` | 5.94:1 | 10.07:1 | 4.5:1 (texto) |
| `eva` | `surface` | 7.90:1 | 9.42:1 | 4.5:1 (texto) |
| `eva` | `eva-soft` | 6.84:1 | 8.07:1 | 4.5:1 (texto) |
| `on-eva` | `eva` | 7.90:1 | 9.42:1 | 4.5:1 (texto) |
| `viable` | `surface` | 5.63:1 | 9.96:1 | 4.5:1 (texto) |
| `viable` | `viable-soft` | 4.95:1 | 8.21:1 | 4.5:1 (texto) |
| `revisar` | `surface` | 5.59:1 | 10.28:1 | 4.5:1 (texto) |
| `revisar` | `revisar-soft` | 5.04:1 | 8.66:1 | 4.5:1 (texto) |
| `noir` | `surface` | 6.57:1 | 8.48:1 | 4.5:1 (texto) |
| `noir` | `noir-soft` | 5.71:1 | 7.43:1 | 4.5:1 (texto) |
| `line-strong` | `surface` | 3.73:1 | 4.63:1 | 3:1 (borde de control) |
| `line-strong` | `surface-sunken` | 3.45:1 | 4.85:1 | 3:1 (borde de control) |

- El foco (`focus-ring`: 2px del fondo + 2px de `focus` = `ba`) mide como mínimo 6.19:1 sobre cualquier superficie, en ambos temas.
- `line` (#d6deea) no llega a 3:1: es solo decorativo; nunca delimite un control solo con `line`.

## Tipografía

Familias gratuitas de Google Fonts (licencia OFL); cárguelas con `next/font/google`.

- `sans` Public Sans — toda la interfaz y el texto corrido de las tres superficies. Escala 1.25 desde `body` 16px: `caption` 12 · `body-sm`/`label` 14 · `body` 16 · `h4`/`body-lg` 18 · `h3` 22 · `h2` 28.
- `serif` Source Serif 4 — solo titulares del sitio B&A (`display-ba` 48, `h1-ba` 36). Da el tono institucional.
- `eva` Lexend — solo titulares de EVA (`display-eva` 40, `h-eva` 22). Diseñada para facilitar la lectura.
- `mono` IBM Plex Mono con cifras tabulares — cifras, códigos, plazos y horas en CKOP (`kpi` 32, `data-lg` 18, `data` 13, `data-sm` 12). Nunca para párrafos.
- Mínimo absoluto 12px. Párrafos a `measure` (68ch). En móvil, los display bajan un paso (`display-ba` → 32/40px).

## Espaciado, grilla y layout

- Base 4px: `space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 · `space-5` 20 · `space-6` 24 · `space-8` 32 · `space-12` 48 · `space-16` 64 · `space-24` 96.
- Grilla de `grid-columns` 12 en escritorio (`bp-lg` 1024px), 8 en tableta (`bp-md` 768px), 4 en móvil. Medianil y margen lateral `gutter-mobile` 16px, `gutter-desktop` 24px. Sin desplazamiento horizontal de página: las tablas se desplazan dentro de su contenedor.
- Contenedor `container-max` 1200px (sitio, EVA); `container-wide` 1600px (CKOP).
- Controles: `control-height` 40px (32px en CKOP); objetivo táctil `touch-min` 44px en móvil. Filas de tabla `row-dense` 32px.

## Radios, bordes y sombras

- CKOP casi recto (`radius-xs` 2, `radius-sm` 4); B&A medio (`radius-md` 8); EVA suave (`radius-lg` 12, `radius-xl` 20). Chips y etiquetas de semáforo: `radius-full`.
- Separe con bordes antes que con sombras. `shadow-1` para tarjetas en reposo, `shadow-2` para hover y menús, `shadow-3` para diálogos. En oscuro la elevación la da `surface-raised`.
- Nada de tarjetas con borde lateral de color.

## Iconografía

- Íconos de línea, trazo 1.75px, puntas redondeadas, en 16px (interfaz) y 20px (alertas), color `currentColor`. Los de este sistema son trazos geométricos propios (check, triángulo, octágono, información, edificio, persona, enlace, dos círculos, reloj, lápiz). Para el resto use un set de línea de código abierto con el mismo trazo (pendiente de elegir).
- Un ícono nunca va solo si comunica estado: siempre con palabra. Íconos decorativos con `aria-hidden="true"`.
- Sin emoji, sin ilustraciones de personas generadas, sin logos de terceros.

## Logo

- El logo oficial de B&A no está en el sistema: use el marcador `eb-logo-slot` («LOGO B&A», 96×32, borde punteado) hasta recibir el archivo vectorial. No dibuje ni reconstruya un logo. CKOP y EVA se escriben como texto (CKOP en `mono`, EVA en `eva`) hasta tener sus marcas.

## Estados e interacción

- Hover: fondo `accent-soft` (navegación, filas, secundarios) o relleno oscurecido (principal).
- Foco de teclado: `focus-ring` en todo elemento interactivo; nunca quite el foco sin reemplazo.
- Deshabilitado: `surface-sunken` + `ink-muted`, con texto que explique por qué.
- Movimiento: transiciones de 150 ms en color y sombra; respete `prefers-reduced-motion`.

## Datos y privacidad

- Público: servicios, metodologías y clientes con permiso o públicos en SECOP. Hojas de vida, datos personales y datos de aliados solo tras inicio de sesión (Ley 1581 de 2012).
- Los agentes proponen, la persona aprueba: todo borrador de agente se marca «Borrador · requiere aprobación».
