import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        brand: ['var(--font-barlow-condensed)', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'var(--font-noto-sans-thai)', 'sans-serif'],
        thai: ['var(--font-noto-sans-thai)', 'var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f7f6',
          100: '#dbece9',
          200: '#b7d9d4',
          300: '#8bbfb8',
          400: '#619f97',
          500: '#46837c',
          600: '#366863',
          700: '#2d5451',
          800: '#274543',
          900: '#233b3a',
          950: '#112221',
        },
        cobalt: {
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        macro: {
          protein: '#2563eb', // cobalt
          carb: '#d97706',    // amber
          fat: '#e11d48',     // rose
        },
      },
    },
  },
  plugins: [],
};

export default config;
