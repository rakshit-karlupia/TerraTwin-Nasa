/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#02040a',
          900: '#050b14',
          850: '#081120',
          800: '#0d182b',
          700: '#14233e',
          600: '#1f355b',
          500: '#2d4b7c',
        },
        cyan: {
          glow: '#00f2fe',
          dim: '#03829e',
        },
        mars: {
          glow: '#ff5e3a',
          dark: '#3d160e',
          rust: '#a8422b',
        },
        lunar: {
          glow: '#a8b8d0',
          dark: '#1c222d',
          regolith: '#788296',
        },
        earth: {
          blue: '#1e88e5',
          green: '#26a69a',
          glow: '#4facfe',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
        display: ['"Space Grotesk"', '"Inter"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'subtle-grid': 'radial-gradient(rgba(0, 242, 254, 0.08) 1px, transparent 0)',
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 242, 254, 0.4)',
        'glow-cyan-lg': '0 0 50px -10px rgba(0, 242, 254, 0.6)',
        'glow-mars': '0 0 25px -5px rgba(255, 94, 58, 0.4)',
        'glow-lunar': '0 0 25px -5px rgba(168, 184, 208, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-very-slow': 'spin 120s linear infinite',
      }
    },
  },
  plugins: [],
}
