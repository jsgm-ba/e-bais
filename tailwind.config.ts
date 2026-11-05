import type { Config } from 'tailwindcss';
import tokens from './design/tokens.json';

const nombres = Object.keys(tokens.color.light);
const colores = Object.fromEntries(nombres.map((n) => [n, `var(--${n})`]));

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    colors: {
      ...colores,
      accent: 'var(--accent)',
      'accent-soft': 'var(--accent-soft)',
      'on-accent': 'var(--on-accent)',
      transparent: 'transparent',
      current: 'currentColor',
    },
    fontFamily: {
      sans: [tokens.font.sans],
      serif: [tokens.font.serif],
      eva: [tokens.font.eva],
      mono: [tokens.font.mono],
    },
    fontSize: Object.fromEntries(Object.entries(tokens.size).map(([k, v]) => [k, v])),
    spacing: { 0: '0', px: '1px', ...tokens.space, 10: '40px', 11: '44px' },
    borderRadius: { none: '0', ...tokens.radius },
    boxShadow: { none: 'none', ...tokens.shadow },
    extend: {
      maxWidth: { container: tokens.layout['container-max'], wide: tokens.layout['container-wide'], measure: tokens.layout.measure },
      height: { control: tokens.layout['control-height'], 'control-ckop': tokens.layout['control-height-ckop'], row: tokens.layout['row-dense'] },
      minHeight: { touch: tokens.layout['touch-min'], control: tokens.layout['control-height'] },
      screens: { md: tokens.layout['bp-md'], lg: tokens.layout['bp-lg'] },
    },
  },
  plugins: [],
};

export default config;
