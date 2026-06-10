/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#030712',
          card: '#080c16',
          border: 'rgba(255, 255, 255, 0.05)',
          glow: '#6366f1',
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#a78bfa',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(99, 102, 241, 0.15)',
        'glow-md': '0 0 20px rgba(99, 102, 241, 0.25)',
        'glow-lg': '0 0 30px rgba(99, 102, 241, 0.35)',
      }
    },
  },
  plugins: [],
}
