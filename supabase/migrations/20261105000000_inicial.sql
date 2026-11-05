-- e-B&Ais · esquema inicial (05-nov-2026). RLS activo en todas las tablas.
-- Aplicar con: supabase db push  (o pegar en el SQL Editor del proyecto)

create type rol_usuario as enum ('participante', 'equipo_ba', 'admin');
create type semaforo as enum ('viable', 'revisar', 'noir');

-- Perfil 1:1 con auth.users. El rol solo lo cambia un admin.
create table perfil (
  id uuid primary key references auth.users on delete cascade,
  nombre text,
  organizacion text,
  tipo_cliente text check (tipo_cliente in ('C1','C2','C3','C4','C5','C6')),
  rol rol_usuario not null default 'participante',
  creado timestamptz not null default now()
);

-- Evidencia de autorización Ley 1581: finalidad, versión del texto y fecha.
create table autorizacion_datos (
  id bigint generated always as identity primary key,
  correo text not null,
  usuario uuid references auth.users on delete set null,
  finalidad text not null,
  version_texto text not null,
  origen text not null,
  otorgada timestamptz not null default now(),
  revocada timestamptz
);

create table lista_espera (
  id bigint generated always as identity primary key,
  nombre text not null,
  correo text not null,
  perfil text,
  producto_id text,
  autorizacion_id bigint not null references autorizacion_datos,
  creado timestamptz not null default now()
);

create table solicitud_cotizacion (
  id bigint generated always as identity primary key,
  nombre text not null,
  correo text not null,
  organizacion text,
  motivo text not null,
  mensaje text,
  autorizacion_id bigint not null references autorizacion_datos,
  estado text not null default 'nueva',
  creado timestamptz not null default now()
);

-- EVA: el contenido vive en content/cursos/*.json; la base guarda inscripción y avance.
create table inscripcion (
  usuario uuid not null references auth.users on delete cascade,
  curso text not null,
  creado timestamptz not null default now(),
  primary key (usuario, curso)
);

create table avance (
  usuario uuid not null references auth.users on delete cascade,
  curso text not null,
  leccion text not null,
  completada timestamptz not null default now(),
  primary key (usuario, curso, leccion)
);

create table evaluacion_intento (
  id bigint generated always as identity primary key,
  usuario uuid not null references auth.users on delete cascade,
  curso text not null,
  aciertos int not null,
  total int not null,
  aprobado boolean not null,
  creado timestamptz not null default now()
);

-- CKOP: caché del Sheets Maestro y del radar SECOP II.
create table ckop_proceso (
  codigo text primary key,
  entidad text not null,
  objeto text not null,
  valor bigint,
  cierre timestamptz,
  estado semaforo,
  url text,
  modalidad text,
  responsable text,
  origen text not null check (origen in ('maestro', 'secop')),
  sincronizado timestamptz not null default now()
);

-- Decisión humana sobre un proceso: el agente propone, la persona aprueba.
create table ckop_decision (
  id bigint generated always as identity primary key,
  codigo text not null references ckop_proceso on delete cascade,
  estado semaforo not null,
  responsable text not null,
  precio_propuesto bigint,
  justificacion text not null,
  propuesta_por text not null default 'persona' check (propuesta_por in ('persona', 'agente')),
  aprobada_por uuid references auth.users,
  autor uuid not null references auth.users default auth.uid(),
  creado timestamptz not null default now()
);

create table ckop_bitacora (
  id bigint generated always as identity primary key,
  evento text not null,
  detalle jsonb,
  autor uuid references auth.users,
  creado timestamptz not null default now()
);

-- Funciones de apoyo para RLS
create or replace function es_equipo() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from perfil where id = auth.uid() and rol in ('equipo_ba', 'admin'));
$$;

-- Evita recursión de RLS al consultar el propio rol
create or replace function rol_actual() returns rol_usuario
language sql stable security definer set search_path = public as $$
  select rol from perfil where id = auth.uid();
$$;

-- Crea el perfil al registrarse
create or replace function nuevo_usuario() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into perfil (id) values (new.id) on conflict do nothing;
  return new;
end $$;
create trigger al_crear_usuario after insert on auth.users for each row execute function nuevo_usuario();

-- RLS
alter table perfil enable row level security;
alter table autorizacion_datos enable row level security;
alter table lista_espera enable row level security;
alter table solicitud_cotizacion enable row level security;
alter table inscripcion enable row level security;
alter table avance enable row level security;
alter table evaluacion_intento enable row level security;
alter table ckop_proceso enable row level security;
alter table ckop_decision enable row level security;
alter table ckop_bitacora enable row level security;

create policy "perfil propio: leer" on perfil for select using (id = auth.uid() or es_equipo());
create policy "perfil propio: editar sin cambiar rol" on perfil for update using (id = auth.uid())
  with check (id = auth.uid() and rol = rol_actual());

-- Formularios: solo el servidor (service role) inserta; el equipo lee.
create policy "equipo lee autorizaciones" on autorizacion_datos for select using (es_equipo());
create policy "titular ve sus autorizaciones" on autorizacion_datos for select using (usuario = auth.uid());
create policy "equipo lee lista de espera" on lista_espera for select using (es_equipo());
create policy "equipo lee cotizaciones" on solicitud_cotizacion for select using (es_equipo());
create policy "equipo gestiona cotizaciones" on solicitud_cotizacion for update using (es_equipo());

create policy "inscripcion propia" on inscripcion for all using (usuario = auth.uid()) with check (usuario = auth.uid());
create policy "avance propio" on avance for all using (usuario = auth.uid()) with check (usuario = auth.uid());
create policy "intentos propios: leer" on evaluacion_intento for select using (usuario = auth.uid() or es_equipo());
create policy "intentos propios: crear" on evaluacion_intento for insert with check (usuario = auth.uid());

create policy "equipo lee procesos" on ckop_proceso for select using (es_equipo());
create policy "equipo lee decisiones" on ckop_decision for select using (es_equipo());
create policy "equipo registra decisiones" on ckop_decision for insert with check (es_equipo() and autor = auth.uid());
create policy "equipo lee bitacora" on ckop_bitacora for select using (es_equipo());
create policy "equipo escribe bitacora" on ckop_bitacora for insert with check (es_equipo());
