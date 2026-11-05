/** Contraste WCAG 2.2 calculado con la fórmula de luminancia relativa. */
export function luminancia(hex: string): number {
  const h = hex.replace('#', '');
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const [r, g, b] = c.map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function razon(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m) as [number, number];
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
}

/** Parejas de uso del DESIGN_SYSTEM.md: [texto, fondo, mínimo]. */
export const PAREJAS: [string, string, number][] = [
  ...['surface', 'surface-sunken', 'surface-raised', 'ba-soft', 'ckop-soft', 'eva-soft'].map((f) => ['ink', f, 4.5] as [string, string, number]),
  ...['surface', 'surface-raised', 'surface-sunken', 'ba-soft'].map((f) => ['ink-muted', f, 4.5] as [string, string, number]),
  ['ba', 'surface', 4.5], ['ba', 'surface-sunken', 4.5], ['ba', 'ba-soft', 4.5], ['on-ba', 'ba', 4.5],
  ['ckop', 'surface', 4.5], ['ckop', 'surface-raised', 4.5], ['ckop', 'ckop-soft', 4.5], ['on-ckop', 'ckop', 4.5],
  ['eva', 'surface', 4.5], ['eva', 'eva-soft', 4.5], ['on-eva', 'eva', 4.5],
  ['viable', 'surface', 4.5], ['viable', 'viable-soft', 4.5], ['viable', 'surface-raised', 4.5],
  ['revisar', 'surface', 4.5], ['revisar', 'revisar-soft', 4.5], ['revisar', 'surface-raised', 4.5],
  ['noir', 'surface', 4.5], ['noir', 'noir-soft', 4.5], ['noir', 'surface-raised', 4.5],
  ['line-strong', 'surface', 3], ['line-strong', 'surface-sunken', 3], ['line-strong', 'surface-raised', 3],
  ['focus', 'surface', 3], ['focus', 'surface-sunken', 3], ['focus', 'surface-raised', 3],
];

export function auditar(paleta: Record<string, string>) {
  return PAREJAS.map(([t, f, min]) => {
    const r = razon(paleta[t]!, paleta[f]!);
    return { texto: t, fondo: f, razon: r, minimo: min, cumple: r >= min };
  });
}
