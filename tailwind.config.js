/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'Arial'],
      },
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',   /* principal (rosado) */
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        gold: {
          400: '#E2C044',
          500: '#C9A227',
          600: '#A88905'
        }
      },
      boxShadow: {
        'polaroid': '0 8px 30px rgba(0,0,0,0.15)',
      },
      rotate: {
        '2.5': '2.5deg',
        '-2.5': '-2.5deg',
        '8': '8deg',
        '-8': '-8deg',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,221,128,0.4) 50%, rgba(255,255,255,0) 100%)',
      }
    },
  },
  plugins: [],
};
