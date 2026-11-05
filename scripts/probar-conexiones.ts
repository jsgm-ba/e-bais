/**
 * Prueba cada conexión real y dice qué falta. Uso: pnpm conexiones (lee .env.local si existe).
 * No escribe nada en ningún servicio: solo lecturas.
 */
import { existsSync, readFileSync } from 'node:fs';

if (existsSync('.env.local')) for (const l of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m && !process.env[m[1]!]) process.env[m[1]!] = m[2]!.replace(/^"|"$/g, '');
}
const env = (k: string) => process.env[k] ?? '';
type R = { servicio: string; ok: boolean; detalle: string };
const out: R[] = [];
async function main() {
const intentar = async (servicio: string, f: () => Promise<string>) => {
  try { out.push({ servicio, ok: true, detalle: await f() }); } catch (e) { out.push({ servicio, ok: false, detalle: e instanceof Error ? e.message : String(e) }); }
};

await intentar('Supabase (anon)', async () => {
  if (!env('NEXT_PUBLIC_SUPABASE_URL') || !env('NEXT_PUBLIC_SUPABASE_ANON_KEY')) throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const r = await fetch(`${env('NEXT_PUBLIC_SUPABASE_URL')}/auth/v1/settings`, { headers: { apikey: env('NEXT_PUBLIC_SUPABASE_ANON_KEY') } });
  if (!r.ok) throw new Error(`Auth respondió ${r.status}`);
  return 'Auth disponible';
});
await intentar('Supabase (esquema)', async () => {
  if (!env('SUPABASE_SERVICE_ROLE_KEY')) throw new Error('Falta SUPABASE_SERVICE_ROLE_KEY');
  const r = await fetch(`${env('NEXT_PUBLIC_SUPABASE_URL')}/rest/v1/ckop_proceso?select=codigo&limit=1`, { headers: { apikey: env('SUPABASE_SERVICE_ROLE_KEY'), Authorization: `Bearer ${env('SUPABASE_SERVICE_ROLE_KEY')}` } });
  if (r.status === 404) throw new Error('La tabla ckop_proceso no existe: aplica supabase/migrations/20261105000000_inicial.sql');
  if (!r.ok) throw new Error(`REST respondió ${r.status}`);
  return 'Migración aplicada';
});
await intentar('Sheets Maestro', async () => {
  if (!env('GOOGLE_SERVICE_ACCOUNT_JSON') || !env('SHEETS_MAESTRO_ID')) throw new Error('Faltan GOOGLE_SERVICE_ACCOUNT_JSON y SHEETS_MAESTRO_ID');
  const { leerRango, filasAProcesos } = await import('../src/lib/sheets');
  const v = await leerRango(env('SHEETS_RANGO_SEMAFORO') || 'SEMÁFORO 2026-2!A1:Z1000');
  const f = filasAProcesos(v);
  const sinCodigo = f.filter((x) => x.codigo.startsWith('FILA-')).length;
  return `${f.length} filas · encabezados: ${(v[0] ?? []).join(' | ')} · sin código: ${sinCodigo} · sin semáforo: ${f.filter((x) => !x.estado).length}`;
});
await intentar('SECOP II (datos.gov.co)', async () => {
  const { construirConsulta } = await import('../src/lib/secop');
  const r = await fetch(construirConsulta(undefined, 3));
  if (!r.ok) throw new Error(`datos.gov.co respondió ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const d = (await r.json()) as unknown[];
  return `${d.length} procesos de muestra · campos: ${Object.keys((d[0] as object) ?? {}).join(', ')}`;
});
await intentar('Anthropic (tutor EVA)', async () => {
  if (!env('ANTHROPIC_API_KEY')) throw new Error('Falta ANTHROPIC_API_KEY (el tutor queda apagado; no es obligatorio)');
  const r = await fetch('https://api.anthropic.com/v1/models', { headers: { 'x-api-key': env('ANTHROPIC_API_KEY'), 'anthropic-version': '2023-06-01' } });
  if (!r.ok) throw new Error(`API respondió ${r.status}`);
  return 'Clave válida';
});
await intentar('Formularios', async () => {
  if (env('SUPABASE_SERVICE_ROLE_KEY')) return 'Destino: Supabase';
  if (env('NEXT_PUBLIC_FORM_ENDPOINT')) return 'Destino: endpoint externo';
  throw new Error('Sin destino: los formularios muestran «Formulario en preparación»');
});

for (const r of out) console.log(`${r.ok ? 'OK   ' : 'FALTA'} ${r.servicio.padEnd(26)} ${r.detalle}`);
}
main();
