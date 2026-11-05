# F0 · Plan de e-B&Ais (v2, full-stack)
Versión 05-nov-2026 · Sesión en la nube con Opus · Rama `feat/sitio-v1`

## 1. Qué cambió frente al prompt maestro
JSGM aprobó el 05-nov-2026 cambiar el sitio estático por un **producto full-stack**:
- Arquitectura: Next.js (App Router) con servidor en Vercel + Supabase (Postgres y Auth) + sincronización con el Sheets Maestro.
- Acceso: inicio de sesión por correo (Supabase Auth, enlace mágico), con la autorización de la Ley 1581 sin premarcar.
- Siguen vigentes: los límites legales (D1, términos prohibidos, nada de cifras sin fuente), el design system de B&A, el verificador de contenido y la regla de no hacer merge a `main`.
- Se levanta la prohibición de «login, base de datos e integraciones» del prompt v2. **No** se construye pasarela de pago.

## 2. Superficies y módulos
| Superficie | Público | Privado (con sesión) |
|---|---|---|
| `/` Hub e-B&Ais | Encabezado por resultado, selectores «¿Quién eres?» y «¿Qué necesitas resolver?», puertas a B&A, EVA, CKOP y Soluciones | Mi cuenta (perfil, autorizaciones, mis cursos, mis tableros) |
| `/ba` B&A | Servicios por línea, método en pasos, experiencia solo con soporte, legado de MMP, contacto | — |
| `/eva` EVA | Catálogo de los 41 productos («En diseño», «Precio en preparación»), fichas con los 3 componentes, lista de espera | Cursos empaquetados: módulos, lecciones, avance, entregable, tutor IA (borrador), constancia solo cuando aplique D1 |
| `/ckop` CKOP | Página explicativa y tabla de demostración («Dato de ejemplo») | Panel interactivo leído del Sheets Maestro (SEMÁFORO 2026-2 e HISTÓRICO) + torre de control: radar SECOP II, ficha del proceso, semáforo Viable / Revisar / No ir, decisión de quién se presenta y a qué precio, bitácora |
| `/soluciones` Soluciones a la medida | Agentes empleados, segundo cerebro, memoria de compañía, manual de know-how y way-of-work, mapa de jobs-to-be-done; cada uno con problema, resultado, entregable y CTA «Cotiza» | Demo privada del segundo cerebro de B&A (borrador) |

## 3. Arquitectura técnica
- **Web**: Next.js 15, TypeScript estricto, Tailwind con los tokens convertidos a variables CSS, `data-product` y tema claro y oscuro.
- **Datos**: Supabase Postgres con RLS en todas las tablas. Migraciones SQL versionadas en `supabase/migrations/`.
- **Auth**: Supabase Auth con enlace mágico; roles `visitante`, `participante`, `equipo_ba` y `admin`. CKOP privado solo para `equipo_ba`.
- **Contenido editorial**: `content/*.json` validado con zod más el verificador en `prebuild` (se conserva del prompt v2).
- **Sheets Maestro → CKOP**: ruta de servidor con cuenta de servicio de Google (solo lectura) y caché en Postgres (`ckop_proceso`), refrescada por Vercel Cron.
- **SECOP II**: API abierta de datos.gov.co (Socrata) desde el servidor; nada se envía a SECOP desde el sistema.
- **IA (tutor, agentes)**: interfaz preparada y marcada «Borrador · requiere aprobación»; la llamada al modelo va detrás de una variable de entorno y apagada por defecto.
- **Pruebas**: Vitest (verificador, esquemas, reglas del semáforo) + Playwright con axe en 360 y 1280 px.

## 4. Modelo de datos inicial
`perfil` · `autorizacion_datos` (finalidad, versión del texto, fecha) · `lista_espera` · `curso` · `modulo` · `leccion` · `inscripcion` · `avance` · `ckop_proceso` · `ckop_decision` (semáforo, responsable, precio propuesto, quién aprueba) · `ckop_bitacora` · `solicitud_cotizacion`.

## 5. Fases y presupuesto (tope 100 USD)
| Fase | Entrega | Tope acumulado |
|---|---|---|
| F0 | Este plan y las preguntas | 5 |
| F1 | Cimientos: proyecto, tokens, layouts, componentes base, `/_sistema` | 20 |
| F2 | Contenido y verificador, esquema de Supabase, RLS y auth | 35 |
| F3 | Páginas públicas: Hub, B&A, EVA, Soluciones, CKOP | 60 |
| F4 | Privado: Mi cuenta, curso empaquetado (1 curso piloto completo), panel CKOP con Sheets y la torre de control | 85 |
| F5 | Calidad, PR y vista previa | 95 |
| F6 | HANDOFF.md | 100 |
Lo que no quepa en 100 USD (agentes con modelo real, más cursos, CKOP P6-P9) queda listado en HANDOFF.md para la siguiente bolsa.

## 6. Bloqueos y riesgos
1. **El repositorio está vacío**: faltan `CLAUDE.md`, `design/tokens.json` y `content/*.json` del kit. Solo están el DESIGN_SYSTEM.md y el Catálogo Maestro en xlsx (41 filas, 7 paquetes).
2. **Red del entorno**: `datos.gov.co` y `api.supabase.com` están bloqueados; hay que agregarlos a Allowed domains.
3. **Credenciales** (como secretos del entorno y de Vercel, nunca en el repo): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_SERVICE_ACCOUNT_JSON` y el ID del Sheets Maestro.
4. **Alcance**: la visión completa no cabe en 100 USD; el corte de la sección 5 es la propuesta.
5. **Límite de uso de 7 días** de la cuenta en estado de advertencia.
6. **Ley 1581**: los datos personales de CKOP (hojas de vida, aliados) quedan solo en el área privada y con RLS.
