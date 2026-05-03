import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0b',
        surface: '#111113',
        surface2: '#18181b',
        border: '#27272a',
        muted: '#a1a1aa',
        accent: '#f59e0b',
        ok: '#22c55e',
        warn: '#eab308',
        bad: '#ef4444'
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace']
      }
    }
  },
  plugins: []
};

export default config;
