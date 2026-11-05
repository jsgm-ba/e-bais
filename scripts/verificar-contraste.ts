import tokens from '../design/tokens.json';
import { auditar } from '../src/lib/contraste';

let fallas = 0;
for (const tema of ['light', 'dark'] as const) {
  for (const f of auditar(tokens.color[tema])) {
    if (!f.cumple) fallas++;
    console.log(`${f.cumple ? 'OK ' : 'FALLA'} ${tema.padEnd(5)} ${f.texto} / ${f.fondo}: ${f.razon}:1 (mín. ${f.minimo}:1)`);
  }
}
if (fallas) { console.error(`${fallas} parejas no cumplen AA`); process.exit(1); }
