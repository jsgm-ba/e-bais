// Humo: Playwright (preinstalado en el entorno) + axe-core en 360 y 1280 px.
// Uso: BASE=http://localhost:3000 node tests/e2e/humo.mjs
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const axe = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = process.env.BASE ?? 'http://localhost:3000';
const RUTAS = ['/', '/ba', '/ba/servicios/fenecimiento', '/ba/contacto', '/ba/experiencia', '/ba/legado', '/eva', '/eva/usa-la-ia-en-tu-trabajo-sin-poner-en-riesgo-tu-firma', '/eva/lista-de-espera', '/eva/aprender/usa-la-ia-en-tu-trabajo-sin-poner-en-riesgo-tu-firma', '/ckop', '/ckop/panel', '/soluciones', '/jsgm', '/aliados', '/aliados/juntos-de-la-mano', '/aliados/derecho-y-formacion', '/privacidad', '/ingresar', '/no-existe'];
const PROHIBIDOS = [/\bdiplomas?\b/i, /\bt[íi]tulos?\b/i, /\bcertificamos\b/i, /B&A certifica/i, /soluciones integrales/i, /de vanguardia/i];

const navegador = await chromium.launch();
let fallas = 0;
for (const ancho of [360, 1280]) {
  const pagina = await navegador.newPage({ viewport: { width: ancho, height: 900 } });
  for (const ruta of RUTAS) {
    for (const tema of ['light', 'dark']) {
      await pagina.emulateMedia({ colorScheme: tema });
      const r = await pagina.goto(BASE + ruta, { waitUntil: 'networkidle' });
      const estado = r?.status();
      const scroll = await pagina.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      await pagina.addScriptTag({ content: axe });
      const res = await pagina.evaluate(async () => await window.axe.run(document, { resultTypes: ['violations'] }));
      const serias = res.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      const texto = await pagina.evaluate(() => document.body.innerText);
      const terminos = PROHIBIDOS.filter((p) => p.test(texto)).map(String);
      const ok = (estado === 200 || (ruta === '/no-existe' && estado === 404)) && scroll <= 0 && serias.length === 0 && terminos.length === 0;
      if (!ok) fallas++;
      console.log(`${ok ? 'OK   ' : 'FALLA'} ${String(ancho).padStart(4)}px ${tema.padEnd(5)} ${ruta} [${estado}] scroll=${scroll} axe=${serias.map((v) => `${v.id}(${v.nodes.length})`).join(',') || 0} terminos=${terminos.join(',') || 0}`);
      if (serias.length && process.env.DETALLE) for (const v of serias) console.log('   ', v.id, v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | '));
    }
  }
  await pagina.close();
}
await navegador.close();
console.log(fallas ? `\n${fallas} combinaciones con fallas` : '\nTodo en verde');
process.exit(fallas ? 1 : 0);
