import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        notebook: {
          cream: '#fefce8',
          'line-blue': '#bfdbfe',
          'margin-red': '#fca5a5',
        },
        surface: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        }
      },
      fontFamily: {
        caveat: ['Caveat', 'cursive'],
        kalam: ['Kalam', 'cursive'],
        patrick: ['Patrick Hand', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        notebook: '2px',
      },
      boxShadow: {
        'notebook-page': '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
};

export default config;
