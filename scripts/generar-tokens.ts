/** Genera src/app/tokens.css desde design/tokens.json (fuente única). */
import { writeFileSync } from 'node:fs';
import tokens from '../design/tokens.json';

const vars = (p: Record<string, string>) => Object.entries(p).map(([k, v]) => `  --${k}: ${v};`).join('\n');
const css = `/* Generado por scripts/generar-tokens.ts. No editar a mano. */
:root {
${vars(tokens.color.light)}
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${vars(tokens.color.dark)}
    color-scheme: dark;
  }
}
:root[data-theme="dark"], [data-theme="dark"] {
${vars(tokens.color.dark)}
  color-scheme: dark;
}
[data-theme="light"] {
${vars(tokens.color.light)}
  color-scheme: light;
}
:root, [data-product="ba"] { --accent: var(--ba); --accent-soft: var(--ba-soft); --on-accent: var(--on-ba); --radio: ${tokens.radius.md}; }
[data-product="ckop"] { --accent: var(--ckop); --accent-soft: var(--ckop-soft); --on-accent: var(--on-ckop); --radio: ${tokens.radius.sm}; }
[data-product="eva"] { --accent: var(--eva); --accent-soft: var(--eva-soft); --on-accent: var(--on-eva); --radio: ${tokens.radius.lg}; }
`;
writeFileSync(new URL('../src/app/tokens.css', import.meta.url), css);
console.log('tokens.css generado');
