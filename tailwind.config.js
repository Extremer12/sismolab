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
          950: '#061321', // Fondo base oficial
          900: '#0D2235', // Superficies y tarjetas oficiales
          850: '#122B43', // Elevación sutil
          800: '#173654',
          700: '#20466B',
          600: '#2B5784',
        },
        brand: {
          blue: '#0D5FFF',
          electric: '#20D9F5',
          cyan: '#20D9F5',   // Acciones y estados activos (#20D9F5)
          purple: '#8B5CF6', // Categorías y Jóvenes/Adultos (#8B5CF6)
          yellow: '#F6C453', // Recompensas y logros (#F6C453)
          gold: '#F6C453',   // Recompensas excepcionales
        },
        surface: {
          base: '#061321',
          card: '#0D2235',
          cardHover: '#122B43',
          border: 'rgba(255, 255, 255, 0.08)',
          borderActive: 'rgba(32, 217, 245, 0.4)',
        },
        accent: {
          success: '#22C55E',
          error: '#EF4444',
          gray: '#94A3B8',
          white: '#E8F1FA',  // Texto principal de alto contraste
        }
      },
      fontFamily: {
        sans: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        apache: ['"Plus Jakarta Sans"', '"Outfit"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Outfit"', 'sans-serif'],
        tech: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(32, 217, 245, 0.35)',
        'glow-electric': '0 0 20px rgba(32, 217, 245, 0.35)',
        'glow-gold': '0 0 20px rgba(246, 196, 83, 0.35)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.35)',
        'card-navy': '0 6px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'card-hover': '0 10px 30px rgba(6, 19, 33, 0.6), inset 0 1px 0 rgba(32, 217, 245, 0.25)',
      },
      borderRadius: {
        'card': '20px',
        'pill': '100px',
      }
    },
  },
  plugins: [],
}
