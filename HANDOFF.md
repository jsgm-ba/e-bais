# HANDOFF · e-B&Ais · sesión del 05-nov-2026
Rama `feat/sitio-v1` · Pull request: https://github.com/jsgm-ba/e-bais/pull/1

## 1. Enlaces
- Repositorio: https://github.com/jsgm-ba/e-bais
- Pull request: https://github.com/jsgm-ba/e-bais/pull/1 (base `main`, que solo tenía el «Initial commit» de GitHub)
- Vista previa de Vercel: **no existe todavía**. Falta importar el repo en Vercel (Add New → Project → `jsgm-ba/e-bais`); desde ahí, cada push a la rama genera su vista previa. En la vista previa se ven los borradores (`VERCEL_ENV=preview`).

## 2. Gasto
El indicador de uso de la sesión no se actualizó durante el turno de trabajo (se quedó en 0,14 USD), así que esta sesión **no tiene un gasto por fase medido**. El consumo real se revisa en claude.ai → Settings → Usage. Advertencia: el límite de uso de 7 días de la cuenta estaba en estado `allowed_warning`.

## 3. Qué cambió frente al prompt maestro (decisiones de JSGM, 05-nov-2026)
- **Full-stack** en lugar de estático: Next.js con servidor en Vercel, Supabase (Postgres con RLS y Auth por enlace mágico) y CKOP leyendo el Sheets Maestro con una cuenta de servicio.
- El repo llegó vacío: **CLAUDE.md, design/tokens.json y content/ se reconstruyeron** a partir de DESIGN_SYSTEM.md, PROMPT 1B v2 y el Catálogo Maestro xlsx. Si existe el kit original, comparar con CLAUDE.md §6.
- Alcance: cimientos y un piloto de cada superficie. Nuevo: **perfil experto de JSGM** (`/jsgm`) como portafolio consultivo, y **propuestas de colaboración directa** con Juntos de la Mano y Derecho y Formación (`/aliados`, `/aliados/[fundacion]`, imprimibles con Ctrl+P), con hipótesis por validar, oferta, plan de 90 días, métricas, aportes de cada parte y preguntas para la primera reunión.
- Los productos conservan su estado del Catálogo: 39 «En diseño» y 2 «Confirmado» (C4-04 y C4-05). Todos con «Precio en preparación» mientras `aprobado_mmp` sea falso.

## 4. Criterios de aceptación y evidencia
| Criterio | Estado | Evidencia |
|---|---|---|
| El build falla con un elemento sin fuente y con «diploma» en EVA | Cumple | `tests/unit/verificador.test.ts` (reglas 2 y 3); `prebuild` corre `scripts/verificar-contenido.ts` |
| Cero términos prohibidos y cero cifras sin fuente en el HTML | Cumple | Verificador sobre content/ (14 archivos, 0 hallazgos) + `tests/e2e/humo.mjs` recorre el texto renderizado de 16 rutas |
| Catálogo de /eva = catalogo.json | Cumple | 41 productos en `content/catalogo.json`; la página muestra `conteo-catalogo` = 41 en vista previa |
| Ningún aliado, cliente o docente con nombre sin `permiso_ref` | Cumple | Regla `nombre-sin-permiso`; las fundaciones y el FNE solo aparecen en vista previa, como borrador |
| Formularios: sin autorización no envía; sin destino lo dice | Cumple | `Formulario.tsx` y `/api/formularios` (`autorizacion: z.literal(true)`; 503 «Formulario en preparación») |
| axe sin violaciones serias, contraste AA, 360 px sin scroll | Cumple | `pnpm e2e`: 76 de 76 combinaciones (19 rutas × 360/1280 × claro/oscuro); `pnpm contraste`: 72 de 72 parejas AA |
| Un solo acento por pantalla; semáforo con ícono + palabra; sin emoji ni logo reconstruido | Cumple | `data-product` por superficie; `EstadoSemaforo`; marcador `eb-logo-slot` |
| Producción no publica borradores | Cumple | Build con `VERCEL_ENV=production`: páginas en «Contenido en preparación», fichas en 404 y `/sistema` en 404 |
| Rama empujada, PR abierto, vista previa de Vercel | Parcial | Rama y PR #1 sí; vista previa pendiente de importar el repo en Vercel |

Comandos verificados en el contenedor: `pnpm typecheck` · `pnpm lint` · `pnpm test` (26 pruebas) · `pnpm build` · `pnpm e2e`.

## 5. Lo que no se pudo probar en este contenedor
`pnpm conexiones` prueba cada servicio y dice qué falta; la guía paso a paso está en `docs/CONECTAR_DATOS.md`.
- **Supabase**: no hay proyecto ni claves, y `api.supabase.com` está bloqueado por la red del entorno. El esquema, la RLS, el ingreso, el avance de cursos y las decisiones de CKOP están escritos y tipados, pero **no se han ejecutado contra una base real**.
- **Sheets Maestro**: falta la cuenta de servicio. Los encabezados reales de `SEMÁFORO 2026-2` se mapean por alias en `src/lib/sheets.ts` (ALIAS): hay que confirmarlos con la hoja.
- **SECOP II**: `datos.gov.co` está bloqueado por la red. Los nombres de campo del dataset `p6dx-8zbt` en `src/lib/secop.ts` están **sin verificar**.
- **Tutor IA**: sin `ANTHROPIC_API_KEY` queda apagado y lo dice. Usa `claude-opus-5-5` (configurable con `ANTHROPIC_MODEL`), esfuerzo bajo, caché del system prompt y respaldo del lado del servidor ante rechazos.
- **Sitios de las fundaciones**: bloqueados por la red; la oferta para cada una es una propuesta por validar.

## 6. Textos en borrador con datos pendientes
Todo el contenido está en `publicacion: "borrador"`. Además, estos datos están marcados como pendientes:

| Archivo | Clave | Qué falta |
|---|---|---|
| `content/ba.json` | `legado.trayectoria` | confirmar trayectoria con soporte: 25+ años (Perfil-Firma) frente a 30 años (fundación 17-dic-1996) |
| `content/ba.json` | `legado.como_lee.texto` | matriz de particularidades por tipo de entidad de MMP (Fase 1 del 1B) |
| `content/cursos/c6-01.json` | `modulos[1].lecciones[0].piramide[4].norma` | verificar la circular vigente de la Superintendencia de Industria y Comercio sobre IA y datos personales |
| `content/hub.json` | `hero.nota_trayectoria` | confirmar trayectoria (25+ o 30 años) con soporte antes de publicar cifras |
| `content/hub.json` | `senal.nota` | permiso del FNE para nombrarlo como cliente |
| `content/jsgm.json` | `hero.nota_trayectoria` | la cifra de 30 años de B&A requiere el mismo soporte que en /ba/legado |
| `content/jsgm.json` | `construido.nota_metricas` | soporte de la cifra «+40 % de eficiencia operativa» antes de publicarla |
| `content/jsgm.json` | `formacion.nota` | adjuntar los soportes de Anthropic, Microsoft y Google; sin soporte no se publican |
| `content/jsgm.json` | `formacion.siguiente` | confirmar inscripción a la especialización de UNIR en inteligencia empresarial y transformación digital antes de mencionarla |
| `content/jsgm.json` | `formaciones_dictadas.items[0].nota` | el número de contrato difiere entre la HV (FNE-MC-007-2026) y el informe (FNE-161-2026); permiso para nombrar a la entidad |
| `content/jsgm.json` | `formaciones_dictadas.items[1].nota` | permiso para nombrar a la entidad y a la docente invitada |
| `content/jsgm.json` | `aliados.fundaciones[0].nota` | validar con la fundación su misión, población y prioridades (el sitio no fue accesible desde la sesión) y obtener permiso para nombrarla |
| `content/jsgm.json` | `aliados.fundaciones[1].nota` | validar con la fundación sus programas y prioridades (el sitio no fue accesible desde la sesión) y obtener permiso para nombrarla |
| `content/jsgm.json` | `aliados.modelo` | el porcentaje se está formalizando; no publicar hasta firmar |
| `content/legal.json` | `privacidad.secciones[0].p` | dirección y correo de contacto para titulares |
| `content/legal.json` | `privacidad.secciones[5].p` | fecha de entrada en vigencia tras la revisión jurídica |
| `content/legal.json` | `terminos.secciones[4].p` | revisión jurídica |

Otros pendientes que no están en el contenido:
- Las ediciones «ISO 9001:2026», «ISO 14001:2026», «ISO 19011:2026», «MIPG versión 7» y la revisión de ISO 45001 vienen del Catálogo con la etiqueta «VERIFICAR iso.org». No se verificaron en esta sesión.
- Ningún curso ISO tiene `aval_fb_ref`: los 8 cursos `REQUIERE_AVAL_FB` muestran «Aval de FB Certification en trámite».
- Número de contrato del FNE: la HV dice FNE-MC-007-2026 y el informe dice FNE-161-2026.

## 7. Riesgos
1. **Ley 1581**: los textos de autorización y la política de privacidad son borradores; necesitan revisión jurídica antes de recibir datos reales.
2. **Costo del tutor IA**: el endpoint exige sesión en producción, pero todavía no tiene límite de uso por persona.
3. **Plan Carrera confidencial**: solo se usó el posicionamiento profesional; no subir ese PDF al repo.
4. **Tokens reconstruidos**: si llega el `tokens.json` original, reemplazarlo y correr `pnpm contraste`.
5. **El panel CKOP en vista previa** muestra datos de ejemplo a cualquier visitante; en producción exige el rol `equipo_ba`.

## 8. Los 5 siguientes pasos, por valor
1. **Importar el repo en Vercel** y revisar la vista previa del PR con MMP (los textos en borrador se ven etiquetados).
2. **Crear el proyecto Supabase**, aplicar la migración y cargar las claves en Vercel y como secretos del entorno; permitir `*.supabase.co`, `datos.gov.co` y `sheets.googleapis.com` en la red del entorno.
3. **Crear la cuenta de servicio de Google** con lectura sobre el Maestro, compartir la hoja y cargar `GOOGLE_SERVICE_ACCOUNT_JSON`, `SHEETS_MAESTRO_ID` y `CRON_SECRET`; confirmar los encabezados de SEMÁFORO 2026-2.
4. **Aprobaciones de MMP**: precios de la hoja Parametros, nombres de productos y métodos, la trayectoria (25+ o 30 años) y los textos de cada página. Al aprobar: `publicacion: "publicado"` + `aprobado_por`.
5. **Validar con las fundaciones** Juntos de la Mano y Derecho y Formación su oferta y el permiso para nombrarlas; pedir a FB el aval escrito de los 8 cursos ISO.
