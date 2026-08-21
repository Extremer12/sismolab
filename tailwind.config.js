/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040E1B',
          900: '#061426', // Deep Navy
          850: '#081C33', // Dark Navy
          800: '#0C2746',
          700: '#11355E',
          600: '#18477C',
        },
        brand: {
          blue: '#0D5FFF',
          electric: '#00B8FF',
          cyan: '#22D3EE',
          purple: '#7C3AED',
          yellow: '#FACC15',
          gold: '#F5B83D',
        },
        accent: {
          success: '#22C55E',
          error: '#EF4444',
          gray: '#94A3B8',
          white: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(34, 211, 238, 0.35)',
        'glow-electric': '0 0 25px rgba(0, 184, 255, 0.4)',
        'glow-gold': '0 0 25px rgba(245, 184, 61, 0.4)',
        'glow-purple': '0 0 25px rgba(124, 58, 237, 0.4)',
        'card-navy': '0 8px 32px rgba(4, 14, 27, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'card-hover': '0 12px 40px rgba(0, 184, 255, 0.25), inset 0 1px 0 rgba(34, 211, 238, 0.3)',
      },
      borderRadius: {
        'card': '20px',
        'pill': '100px',
      }
    },
  },
  plugins: [],
}
