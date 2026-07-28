/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
        serif: ['Fraunces', 'Noto Serif SC', 'Songti SC', 'Source Han Serif SC', 'serif'],
      },
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'today-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.45)' },
          '50%': { boxShadow: '0 0 0 7px rgba(249, 115, 22, 0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        shimmer: 'shimmer 2.5s linear infinite',
        'today-pulse': 'today-pulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
