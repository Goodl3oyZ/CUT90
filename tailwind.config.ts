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
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'var(--font-thai)', 'sans-serif'],
        thai: ['var(--font-thai)', 'var(--font-sans)', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],  // 11px
        xs: ['0.75rem', { lineHeight: '1.25rem' }],     // 12px
        sm: ['0.875rem', { lineHeight: '1.5rem' }],     // 14px
        base: ['1rem', { lineHeight: '1.65rem' }],      // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }],    // 18px
        xl: ['1.25rem', { lineHeight: '1.85rem' }],     // 20px
        '2xl': ['1.75rem', { lineHeight: '2.25rem' }],  // 28px
        '3xl': ['2.25rem', { lineHeight: '2.75rem' }],  // 36px
        '4xl': ['2.75rem', { lineHeight: '3.25rem' }],  // 44px
        '5xl': ['3.5rem', { lineHeight: '4rem' }],      // 56px
        '6xl': ['4.5rem', { lineHeight: '5rem' }],      // 72px
      },
      colors: {
        obsidian: {
          950: '#060807',
          900: '#090C0B',
          850: '#101412',
          800: '#161C19',
          750: '#1D2521',
          700: '#27322D',
        },
        brass: {
          50: '#FAF7ED',
          100: '#F3EDD2',
          200: '#E7D9A5',
          300: '#D4AF37', // Primary dark accent
          400: '#C5A059',
          500: '#B8860B',
          600: '#A37F28',
          700: '#8C6D1F', // Primary light accent (high contrast)
          800: '#6E5414',
          900: '#4D3A0B',
        },
        paper: {
          50: '#FFFFFF',
          100: '#F7F6F2',
          200: '#EFECE6',
          300: '#E2DEC6',
        },
        ink: {
          900: '#121614',
          800: '#1A211E',
          700: '#2D3732',
          500: '#4D5C4A',
          400: '#687A65',
          300: '#8E9C8A',
          200: '#B8C4B5',
        },
        macro: {
          protein: '#3B82F6',
          carb: '#D97706',
          fat: '#EC4899',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'brass-glow': '0 0 20px -5px rgba(212, 175, 55, 0.25)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
