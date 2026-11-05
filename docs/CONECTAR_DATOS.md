# Conectar los datos reales (unos 30 minutos)
Al terminar, corre `pnpm conexiones`: cada línea debe decir OK.

## 0. Red del entorno de Claude Code (solo si una sesión en la nube va a probarlo)
claude.ai/code → menú del entorno en la barra de título → Edit → Network access → Allowed domains (deja marcada «Allow package managers»):
`*.supabase.co`, `api.supabase.com`, `datos.gov.co`, `www.datos.gov.co`, `sheets.googleapis.com`, `oauth2.googleapis.com`, `fundacionjuntosdelamano.org`, `fundacionderechoyformacion.org`.

## 1. Supabase (base de datos e ingreso por correo)
1. supabase.com → New project (región São Paulo). Guarda la contraseña de la base.
2. SQL Editor → pega `supabase/migrations/20261105000000_inicial.sql` → Run.
3. Authentication → URL Configuration: Site URL = la URL de Vercel; Redirect URLs = `https://*.vercel.app/auth/callback` y tu dominio.
4. Project Settings → API: copia `URL`, `anon public` y `service_role`.
5. Cuando ingreses por primera vez, date el rol del equipo: `update perfil set rol = 'admin' where id = (select id from auth.users where email = 'tu-correo');`

## 2. Cuenta de servicio de Google (Sheets Maestro, solo lectura)
1. console.cloud.google.com → proyecto nuevo → APIs → habilita **Google Sheets API**.
2. IAM → Service accounts → Create → sin roles → Keys → Add key → JSON. Descárgala.
3. En el Sheets Maestro → Compartir → pega el correo de la cuenta de servicio (`...@...iam.gserviceaccount.com`) como **Lector**.
4. El ID del **Maestro Licitaciones** está en su URL: `docs.google.com/spreadsheets/d/<ID>/edit`. Cárgalo en `SHEETS_MAESTRO_ID` (en Vercel, no en el repo). CKOP lee las hojas de `SHEETS_PESTANAS` (por defecto `SEMÁFORO 2026-2,OPORTUNIDADES`) y calcula los hitos desde las columnas de fechas (ver `docs/FLUJO_SECOP_II.md` §7).
   Cuando la cuenta de servicio funcione, **quita el acceso «cualquiera con el enlace»** de la hoja: tiene valores ofertados, competidores y estrategia.
5. Corre `pnpm conexiones`: muestra los encabezados reales de SEMÁFORO 2026-2. Si alguno no se reconoce, agrégalo a `ALIAS` en `src/lib/sheets.ts`.

## 3. Variables en Vercel (Project → Settings → Environment Variables)
| Variable | Valor | Entornos |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública | Production |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Paso 1.4 | Todos |
| `SUPABASE_SERVICE_ROLE_KEY` | Paso 1.4 (secreta) | Todos |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | El JSON completo en una línea (secreto) | Todos |
| `SHEETS_MAESTRO_ID` | Paso 2.4 | Todos |
| `SHEETS_PESTANAS` | Opcional. Por defecto `SEMÁFORO 2026-2,OPORTUNIDADES` | Todos |

Si ya existía la base, aplica también `supabase/migrations/20261105010000_ckop_hitos.sql`.
| `CRON_SECRET` | Una cadena aleatoria larga | Todos |
| `ANTHROPIC_API_KEY` | Opcional: enciende el tutor de EVA | Todos |

Para desarrollo local, copia `.env.example` a `.env.local` con los mismos valores. Nunca subas `.env.local` al repo.

## 4. Verificar
- `pnpm conexiones` → todo OK.
- Llama una vez a la sincronización: `curl -H "Authorization: Bearer $CRON_SECRET" https://<tu-url>/api/ckop/sync` → `{"ok":true,"filas":N}`. Después corre sola cada día a las 6:17 a. m. de Bogotá (`vercel.json`).
- Ingresa por `/ingresar`, date el rol (paso 1.5) y abre `/ckop/panel`: verás el Maestro real y podrás registrar decisiones.
