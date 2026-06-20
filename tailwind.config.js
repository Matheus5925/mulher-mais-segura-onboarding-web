/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FDF5F9',
          100: '#FCE4EC',
          200: '#F8BBD0',
          300: '#F48FB1',
          400: '#F06292',
          500: '#EC407A',
          600: '#E91E8C',
          700: '#C2185B',
          800: '#AD1457',
          900: '#880E4F',
        },
        sidebar: '#0A0010',
      },
      fontFamily: {
        sans:    ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn .25s ease',
        'slide-up':   'slideUp .3s ease',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },                   to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'none' } },
      },
    },
  },
  plugins: [],
}
