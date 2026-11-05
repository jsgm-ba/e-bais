import { z } from 'zod';

export const Publicacion = z.enum(['borrador', 'publicado']);
export const Estado = z.object({
  publicacion: Publicacion,
  aprobado_por: z.string().nullable(),
  fuentes: z.array(z.string().min(1)),
});
export type Estado = z.infer<typeof Estado>;

const Enlace = z.object({ t: z.string(), h: z.string() });
const Cliente = z.enum(['C1', 'C2', 'C3', 'C4', 'C5', 'C6']);
export const ClienteEnum = Cliente;
export type Cliente = z.infer<typeof Cliente>;

export const Producto = z.object({
  id: z.string().regex(/^(C[1-6]|IM)-\d{2}$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  cliente: Cliente,
  familia: z.string().nullable(),
  problema: z.string(),
  disparador: z.string().nullable(),
  nombre: z.string(),
  resultado: z.string().nullable(),
  entregable: z.string().nullable(),
  activo_mmp: z.string().nullable(),
  capa_ia: z.string().nullable(),
  norma: z.string().nullable(),
  eje_pic: z.string().nullable(),
  publico: z.string().nullable(),
  formato: z.enum(['asincronico', 'sincronico', 'plus', 'in_company', 'presencial']),
  intensidad_h: z.number().int().nonnegative().nullable(),
  docente: z.string().nullable(),
  regimen: z.enum(['FB', 'REQUIERE_AVAL_FB', 'CONSTANCIA']),
  aval_fb_ref: z.string().nullable(),
  precio: z.object({
    modo: z.enum(['desde', 'cotiza', 'paquete', 'gratis']),
    clave: z.string().nullable(),
    desde_cop: z.number().int().nullable(),
    institucional_bajo_cop: z.number().int().nullable(),
    institucional_alto_cop: z.number().int().nullable(),
    supuesto: z.boolean(),
    aprobado_mmp: z.boolean(),
  }),
  escalon: z.enum(['iman', 'micro', 'curso', 'plus', 'diplomado', 'consultoria', 'membresia']),
  upsell: z.string().nullable(),
  gancho: z.string().nullable(),
  seo: z.string().nullable(),
  estado: z.enum(['en_diseno', 'confirmado']),
  publicacion: Publicacion,
  aprobado_por: z.string().nullable(),
  fuentes: z.array(z.string()),
}).refine((p) => p.regimen !== 'FB' || !!p.aval_fb_ref, { message: 'regimen FB exige aval_fb_ref' });
export type Producto = z.infer<typeof Producto>;
export const Catalogo = z.array(Producto);

export const Paquete = z.object({
  id: z.string(), slug: z.string(), nombre: z.string(), cliente: Cliente,
  componentes: z.array(z.string()), resuelve: z.string(),
  precio: z.object({ desde_cop: z.number().nullable(), institucional_alto_cop: z.number().nullable(), supuesto: z.boolean(), aprobado_mmp: z.boolean() }),
  publicacion: Publicacion, aprobado_por: z.string().nullable(), fuentes: z.array(z.string()),
});
export type Paquete = z.infer<typeof Paquete>;

const Pagina = { _estado: Estado };
const Meta = z.object({ title: z.string(), description: z.string() });

export const Comun = z.object({
  ...Pagina,
  marca: z.record(z.string()),
  nav: z.record(z.array(Enlace)),
  cuenta: z.record(z.string()),
  pie: z.object({ titulo_cruzado: z.string(), enlaces: z.array(Enlace), legal: z.array(Enlace), razon_social: z.string(), aviso_certificacion: z.string() }),
  estados: z.record(z.string()),
  regimen: z.object({ FB: z.string(), REQUIERE_AVAL_FB: z.string(), CONSTANCIA: z.string() }),
  formato: z.record(z.string()),
  clientes: z.record(z.string()),
  escalon: z.record(z.string()),
  no_encontrado: z.object({ titulo: z.string(), texto: z.string(), accion: z.string() }),
});

export const Hub = z.object({
  ...Pagina, meta: Meta,
  hero: z.object({ antetitulo: z.string(), titular: z.string(), bajada: z.string(), nota_trayectoria: z.string().optional() }),
  quien: z.object({ pregunta: z.string(), perfiles: z.array(z.object({ id: z.string(), etiqueta: z.string(), clientes: z.array(Cliente), cta: z.enum(['individual', 'institucional']) })) }),
  que: z.object({ pregunta: z.string(), todos: z.string(), vacio: z.string() }),
  cta: z.object({ individual: z.object({ texto: z.string(), href: z.string() }), institucional: z.object({ texto: z.string(), href: z.string() }) }),
  puertas: z.object({ titulo: z.string(), items: z.array(z.object({ producto: z.enum(['ba', 'eva', 'ckop']), titulo: z.string(), texto: z.string(), href: z.string(), accion: z.string() })) }),
  senal: z.object({ titulo: z.string(), texto: z.string(), fuente: z.string(), fuentes: z.array(z.string()), nota: z.string().optional() }),
});

const Linea = z.object({ slug: z.string(), titulo: z.string(), problema: z.string(), para: z.string(), metodo: z.array(z.string()), entregables: z.array(z.string()), productos: z.array(z.string()), auditoria: z.boolean() });
export type Linea = z.infer<typeof Linea>;
export const BA = z.object({
  ...Pagina, meta: Meta,
  hero: z.object({ antetitulo: z.string(), titular: z.string(), subtitular: z.string(), bajada: z.string(), fuentes: z.array(z.string()).min(1), accion_principal: Enlace, accion_secundaria: Enlace }),
  prueba: z.object({ titulo: z.string(), items: z.array(z.object({ cifra: z.string(), etiqueta: z.string(), fuentes: z.array(z.string()).min(1) })) }),
  etapas: z.object({ titulo: z.string(), fuentes: z.array(z.string()).min(1), items: z.array(z.object({ periodo: z.string(), t: z.string(), d: z.string() })), hilo: z.string() }),
  capacidades: z.object({ titulo: z.string(), bajada: z.string(), fuentes: z.array(z.string()).min(1), items: z.array(z.object({ t: z.string(), n: z.number() })), nota: z.string() }),
  metodo: z.object({ titulo: z.string(), items: z.array(z.object({ t: z.string(), d: z.string() })) }),
  nota_auditoria: z.string(),
  lineas: z.array(Linea),
  experiencia: z.object({ titulo: z.string(), bajada: z.string(), en_validacion: z.string(), columnas: z.array(z.string()) }),
  legado: z.object({ titulo: z.string(), bajada: z.string(), perfil: z.array(z.string()), fuentes: z.array(z.string()), trayectoria: z.string(), como_lee: z.object({ titulo: z.string(), texto: z.string() }) }),
  contacto: z.object({ titulo: z.string(), bajada: z.string(), motivos: z.array(z.object({ v: z.string(), t: z.string() })) }),
});

export const FilaExperiencia = z.object({
  id_rup: z.number().int(), entidad: z.string(), tipo_entidad: z.string(), objeto: z.string(), anio: z.number().int().nullable(),
  valor_cop: z.number().nullable(), servicio: z.string(), normas: z.string().nullable(), soporte: z.string(),
  secop_url: z.string().url().nullable(), permiso_ref: z.string().min(1), publicable: z.boolean(), fuentes: z.array(z.string()).min(1),
});
export type FilaExperiencia = z.infer<typeof FilaExperiencia>;
export const Experiencia = z.object({
  ...Pagina,
  resumen: z.object({ contratos: z.number(), verificados: z.number(), entidades: z.number(), desde: z.number(), hasta: z.number(),
    por_servicio: z.record(z.number()), por_tipo_entidad: z.record(z.number()), fuentes: z.array(z.string()).min(1), nota: z.string() }),
  demanda: z.object({ procesos_historico: z.number(), procesos_semaforo: z.number(), fuentes: z.array(z.string()).min(1) }),
  filas: z.array(FilaExperiencia),
});
export const MMP = z.object({
  ...Pagina, nombre: z.string(), rol: z.string(), inicio_carrera: z.number(),
  resumen_carrera: z.object({ texto: z.string(), fuentes: z.array(z.string()).min(1) }),
  hitos: z.array(z.object({ entidad: z.string(), vinculo: z.string(), desde: z.number().nullable(), hasta: z.number().nullable(), tematica: z.string().nullable() })),
  fuentes: z.array(z.string()).min(1), nota: z.string(),
});
export const RedExpertos = z.object({
  ...Pagina, profesionales: z.number(), auditores_lideres_iaf: z.number(), por_norma: z.record(z.number()), fuentes: z.array(z.string()).min(1), nota: z.string(),
});

export const EVA = z.object({
  ...Pagina, meta: Meta,
  hero: z.object({ titular: z.string(), bajada: z.string() }),
  componentes: z.object({ titulo: z.string(), items: z.array(z.object({ n: z.string(), t: z.string(), d: z.string() })) }),
  filtros: z.record(z.string()), ficha: z.record(z.string()),
  paquetes: z.object({ titulo: z.string(), bajada: z.string() }),
  lista_espera: z.object({ titulo: z.string(), bajada: z.string(), enviar: z.string() }),
  aprender: z.record(z.string()), tutor: z.record(z.string()),
});

export const CKOP = z.object({
  ...Pagina, meta: Meta,
  hero: z.object({ antetitulo: z.string(), titular: z.string(), bajada: z.string() }),
  decisiones: z.array(z.object({ t: z.string(), d: z.string() })),
  como: z.object({ titulo: z.string(), pasos: z.array(z.string()) }),
  principios: z.object({ titulo: z.string(), items: z.array(z.string()) }),
  traccion: z.object({ titulo: z.string(), items: z.array(z.object({ cifra: z.string(), etiqueta: z.string() })), fuentes: z.array(z.string()).min(1) }),
  modulos_titulo: z.string(),
  demo: z.object({ titulo: z.string(), aviso: z.string(), columnas: z.record(z.string()) }),
  ingresar: z.object({ t: z.string(), deshabilitado: z.string() }),
  panel: z.object({
    titulo: z.string(), sin_permiso: z.string(), sin_datos: z.string(),
    kpi: z.record(z.string()), filtros: z.record(z.string()),
    radar: z.record(z.string()), decision: z.record(z.string()), fuente: z.string(),
  }),
});

export const SemaforoEstado = z.enum(['viable', 'revisar', 'noir']);
export type SemaforoEstado = z.infer<typeof SemaforoEstado>;
export const CkopModulos = z.object({ ...Pagina, modulos: z.array(z.object({ id: z.string(), nombre: z.string(), estado: z.enum(['en_construccion', 'planeado', 'disponible']) })), etiquetas: z.record(z.string()) });
export const Hito = z.object({ t: z.string(), fecha: z.string() });
export type Hito = z.infer<typeof Hito>;
export const FilaProceso = z.object({ codigo: z.string(), entidad: z.string(), objeto: z.string(), valor: z.number().nullable(), cierre: z.string().nullable(), estado: SemaforoEstado.nullable(), url: z.string().optional(), modalidad: z.string().optional(), responsable: z.string().optional(), estado_secop: z.string().optional(), hojas: z.array(z.string()).optional(), hitos: z.array(Hito).optional() });
export type FilaProceso = z.infer<typeof FilaProceso>;
export const CkopDemo = z.object({ ...Pagina, dato_ejemplo: z.literal(true), filas: z.array(FilaProceso) });

const Solucion = z.object({ slug: z.string(), titulo: z.string(), problema: z.string(), resultado: z.string(), entregable: z.string(), pasos: z.array(z.string()), para: z.string(), producto_eva: z.string().optional() });
export type Solucion = z.infer<typeof Solucion>;
export const Soluciones = z.object({ ...Pagina, meta: Meta, hero: z.object({ titular: z.string(), bajada: z.string() }), principio: z.string(), items: z.array(Solucion), cta: Enlace, aviso: z.string() });

const Seccion = z.object({ t: z.string(), p: z.string() });
export const Legal = z.object({
  ...Pagina, aviso_juridico: z.string(),
  autorizacion: z.object({ version: z.string(), texto: z.string(), enlace: z.string(), obligatoria: z.string() }),
  formulario: z.record(z.string()),
  privacidad: z.object({ titulo: z.string(), secciones: z.array(Seccion) }),
  terminos: z.object({ titulo: z.string(), secciones: z.array(Seccion) }),
});

const Leccion = z.object({
  id: z.string(), tipo: z.enum(['concepto', 'norma', 'como', 'practica']), titulo: z.string(),
  parrafos: z.array(z.string()), actividad: z.string().optional(),
  piramide: z.array(z.object({ nivel: z.string(), norma: z.string() })).optional(),
});
export type Leccion = z.infer<typeof Leccion>;
export const Curso = z.object({
  producto_id: z.string(), slug: z.string(), publicacion: Publicacion, aprobado_por: z.string().nullable(), fuentes: z.array(z.string()).min(1),
  titulo: z.string(), promesa: z.string(), duracion_h: z.number(), entregable_final: z.string(),
  modulos: z.array(z.object({ id: z.string(), titulo: z.string(), minutos: z.number(), lecciones: z.array(Leccion) })),
  evaluacion: z.array(z.object({ id: z.string(), pregunta: z.string(), opciones: z.array(z.string()).min(2), correcta: z.number().int() })),
  aprobacion_minima: z.number().int(), constancia: z.string(),
});
export type Curso = z.infer<typeof Curso>;

const Servicio = z.object({ slug: z.string(), t: z.string(), problema: z.string(), resultado: z.string(), entregable: z.string(), duracion: z.string(), para: z.array(Cliente), h: z.string().optional(), productos: z.array(z.string()).optional(), estado: z.string().optional() });
export const JSGM = z.object({
  ...Pagina, meta: Meta,
  hero: z.object({ antetitulo: z.string(), nombre: z.string(), rol: z.string(), titular: z.string(), bajada: z.string(), nota_trayectoria: z.string().optional() }),
  tesis: z.object({ titulo: z.string(), parrafos: z.array(z.string()), fuentes: z.array(z.string()) }),
  diferencial: z.object({ titulo: z.string(), items: z.array(z.object({ t: z.string(), d: z.string() })) }),
  construido: z.object({ titulo: z.string(), fuentes: z.array(z.string()), items: z.array(z.object({ t: z.string(), d: z.string(), h: z.string().optional() })), nota_metricas: z.string().optional() }),
  formacion: z.object({ titulo: z.string(), fuentes: z.array(z.string()), academica: z.array(z.string()), credenciales: z.array(z.object({ t: z.string(), soporte: z.boolean() })), nota: z.string().optional(), siguiente: z.string().optional() }),
  formaciones_dictadas: z.object({ titulo: z.string(), fuentes: z.array(z.string()), items: z.array(z.object({ t: z.string(), d: z.string(), nota: z.string().optional() })) }),
  servicios: z.object({ titulo: z.string(), bajada: z.string(), items: z.array(Servicio) }),
  aliados: z.object({ titulo: z.string(), bajada: z.string(), fundaciones: z.array(z.object({ id: z.string(), nombre: z.string(), url: z.string().url(), permiso_ref: z.string().nullable(), propuesta: z.array(z.string()), productos: z.array(z.string()), nota: z.string().optional() })), modelo: z.string() }),
  lineas_contenido: z.object({ titulo: z.string(), items: z.array(z.string()) }),
  cta: Enlace, aviso: z.string(),
});

const Fundacion = z.object({
  id: z.string(), nombre: z.string(), url: z.string().url(), permiso_ref: z.string().nullable(), lectura: z.string(),
  hipotesis: z.array(z.string()), propuesta_valor: z.string(),
  oferta: z.array(z.object({ t: z.string(), d: z.string(), producto: z.string().optional(), estado: z.string().optional() })),
  plan_90: z.array(z.object({ fase: z.string(), t: z.string(), d: z.string() })),
  metricas: z.array(z.string()), aporta_fundacion: z.array(z.string()), aporta_ba: z.array(z.string()), preguntas: z.array(z.string()),
});
export type Fundacion = z.infer<typeof Fundacion>;
export const Aliados = z.object({
  _estado: Estado, meta: z.object({ title: z.string(), description: z.string() }),
  intro: z.object({ titulo: z.string(), bajada: z.string(), principios: z.array(z.string()) }),
  valor_compartido: z.object({ titulo: z.string(), items: z.array(z.object({ t: z.string(), d: z.string() })) }),
  modalidades: z.object({ titulo: z.string(), items: z.array(z.object({ id: z.string(), t: z.string(), d: z.string(), quien_paga: z.string() })) }),
  fundaciones: z.array(Fundacion),
  cta: z.object({ t: z.string(), h: z.string() }), aviso: z.string(),
});
