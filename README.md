# e-B&Ais

Hub de e-B&Ais con cuatro superficies enlazadas: **B&A** (`/ba`, consultoría y auditoría), **EVA** (`/eva`, academia con cursos empaquetados), **CKOP** (`/ckop`, torre de control de licitaciones con panel sobre el Sheets Maestro) y **Soluciones** (`/soluciones` y `/jsgm`, agentes, segundo cerebro, memoria de compañía, manual de know-how y JTBD).

- Reglas de negocio y legales: [`CLAUDE.md`](CLAUDE.md)
- Plan y alcance: [`docs/F0_PLAN.md`](docs/F0_PLAN.md) · Estado y siguientes pasos: [`HANDOFF.md`](HANDOFF.md)
- Contenido: [`content/LEEME_CONTENIDO.md`](content/LEEME_CONTENIDO.md) · Diseño: [`design/DESIGN_SYSTEM.md`](design/DESIGN_SYSTEM.md)

## Stack
Next.js 15 (App Router, servidor en Vercel) · TypeScript estricto · Tailwind con los tokens de `design/tokens.json` · Supabase (Postgres con RLS y Auth por enlace mágico) · Google Sheets API con una cuenta de servicio · datos abiertos de SECOP II · SDK de Anthropic para el tutor de EVA (apagado sin clave).

## Comandos
```bash
pnpm install
cp .env.example .env.local     # completar lo que haya
pnpm dev                       # vista previa local con borradores
pnpm verificar                 # verificador de contenido
pnpm contraste                 # contraste AA de los tokens
pnpm typecheck && pnpm lint && pnpm test && pnpm build
BASE=http://localhost:3000 pnpm e2e   # humo Playwright + axe en 360 y 1280 px
```

## Base de datos
Crear un proyecto en Supabase, aplicar `supabase/migrations/20261105000000_inicial.sql` (SQL Editor o `supabase db push`) y cargar las variables de `.env.example` en Vercel. Para dar acceso al panel CKOP: `update perfil set rol = 'equipo_ba' where id = '<uuid>';`
