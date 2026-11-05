-- CKOP · hitos del flujo SECOP II leídos del Maestro Licitaciones (docs/FLUJO_SECOP_II.md §7)
alter table ckop_proceso add column if not exists estado_secop text;
alter table ckop_proceso add column if not exists hojas text[];
alter table ckop_proceso add column if not exists hitos jsonb not null default '[]'::jsonb;
