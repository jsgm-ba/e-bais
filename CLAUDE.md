# CLAUDE.md · e-B&Ais
Reconstruido el 05-nov-2026 a partir del PROMPT 1B v2, el DESIGN_SYSTEM.md y el tablero PRIORIZACIÓN JSGM, porque el CLAUDE.md original del kit no estaba en el repo. Si llega el original, prevalece este solo en lo que JSGM haya aprobado después (sección 6).

## 1. Identidad
- **B&A**: Business & Auditing Consultores Ltda., NIT 830.026.351-4. Consultoría, auditoría interna, control interno y capacitación para el sector público.
- **MMP**: Marisol Muñoz Peralta, directora técnica. No presentarla como socia ni como representante legal.
- **JSGM**: Juan Sebastián González Muñoz. Lidera e-B&Ais, EVA y CKOP.
- **e-B&Ais**: la transformación inteligente y digital del legado de MMP y B&A. Hub que aloja EVA (academia), CKOP (torre de control de licitaciones) y Soluciones a la medida.
- Aliado certificador: FB Certification SAS, OEC acreditado por ONAC con código 15-CSG-002 (ISO/IEC 17021-1:2015). B&A **no** es organismo de certificación ni tiene acreditación ONAC.

## 2. Límites legales (no negociables)
1. Nunca escribir que B&A, EVA o e-B&Ais «certifican», «están acreditados» o «expiden títulos».
2. Ningún nombre de docente aliado, cliente, logo o testimonio sin `permiso_ref`. Nada de testimonios inventados.
3. La experiencia publicable sale solo de soportes (EXP CONTRACTUAL), con enlace a SECOP cuando sea público.
4. Ley 1581 de 2012 en cada formulario: autorización no premarcada, finalidad explícita, enlace a /privacidad. Sin rastreadores de terceros mientras no haya política aprobada.
5. No prometer fechas de la licencia ETDH, de la homologación con UNIR ni de lanzamiento. ETDH: «en trámite».
6. Los precios finales los decide MMP. Mientras `aprobado_mmp` sea falso, se muestra «Precio en preparación».
7. Los agentes proponen y la persona aprueba: todo borrador de agente lleva «Borrador · requiere aprobación».
8. Nada se envía a SECOP II desde el sistema.

## 3. Decisiones D1-D5 (aprobadas el 04-nov-2026)
- **D1 · Certificación, doble régimen**: cursos ISO con aval escrito de FB → «certificado de aprobación expedido por FB Certification SAS, en alianza con B&A» (`regimen="FB"` y `aval_fb_ref`). Sin aval → `REQUIERE_AVAL_FB`, se muestra «Aval de FB en trámite». El resto → «constancia de asistencia» o «constancia de aprobación» de B&A.
- **D2 · Portafolio**: macro por cliente (C1 consultores y auditores, C2 empresas privadas, C3 ESAL, C4 entidades públicas, C5 entidades con disparador, C6 servidor público individual); micro por problema a resolver.
- **D3 · Prioridad de growth**: C1 → C2 → C6 → decisores B2G.
- **D4 · Precios híbridos**: «desde» para lo individual; «Cotiza tu PIC o tu plan» para C4 y C5. Todo precio es [SUPUESTO] hasta que lo apruebe MMP.
- **D5 · Marca**: dos sitios enlazados (B&A institucional y e-B&Ais growth) dentro de un mismo proyecto con rutas `/ba`, `/eva`, `/ckop`, `/soluciones`. Tráfico cruzado obligatorio.

## 4. Términos prohibidos (los vigila `scripts/verificar-contenido.ts`)
- En cualquier texto: «B&A certifica», «EVA certifica», «certificamos», «acreditados», «acreditada por ONAC» (referido a B&A o EVA), «expedimos títulos», «título», «diploma», «certificación oficial», «conducente a», «IETDH».
- «certificado» solo dentro de la frase del régimen FB y solo en cursos con `regimen="FB"` y `aval_fb_ref` no vacío.
- Frases vacías: «soluciones integrales», «de alta calidad», «expertos comprometidos», «en un mundo cambiante», «potencia tu», «de vanguardia».

## 5. Reglas de contenido
- Todo texto público sale de `content/*.json`; ningún texto de negocio se escribe en el código.
- Elemento con `publicacion="publicado"` exige `fuentes` (al menos una) y `aprobado_por`.
- Los elementos en `publicacion="borrador"` solo se ven en vista previa (desarrollo o `VERCEL_ENV=preview`, o `NEXT_PUBLIC_PREVIEW=1`) con la etiqueta «Borrador · requiere aprobación».
- Cifras en es-CO: `$ 48.200.000`, `30 oct. 2026`, `D-3 · 14:00`. Datos de prueba rotulados «Dato de ejemplo».
- Voz: usted en B&A, tú en EVA, frases nominales en CKOP. Sin exclamaciones, emoji ni superlativos.

## 6. Decisiones del 05-nov-2026 (esta sesión)
- Producto **full-stack**: Next.js con servidor en Vercel, Supabase (Postgres y Auth por enlace mágico de correo) y CKOP leyendo el Sheets Maestro con una cuenta de servicio de Google. Sin pasarela de pago.
- Los 41 productos del catálogo se muestran con su estado del Catálogo Maestro y «Precio en preparación».
- Alcance de esta sesión: cimientos y un piloto de cada superficie (ver `docs/F0_PLAN.md`).

## 7. Cómo trabajar
- `pnpm verificar` antes de cada commit; `pnpm typecheck && pnpm test && pnpm build` antes de abrir un PR.
- El Catálogo Maestro (`data/*.xlsx`) es la fuente única: `python3 scripts/importar_catalogo.py` regenera `content/catalogo.json` y `content/paquetes.json`. No editar esos JSON a mano.
- Commits en español. Nunca hacer merge a `main` ni promover a producción.
