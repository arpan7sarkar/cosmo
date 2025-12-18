/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#050505',
        'brand-dark': '#0A0A0A',
        'brand-darker': '#080808',
        'brand-gray': '#1F1F1F',
        'brand-light-gray': '#2A2A2A',
        'brand-text': '#FFFFFF',
        'brand-text-muted': '#A1A1AA',
        'brand-accent': '#FFFFFF',
        
        // Keeping legacy for compatibility until refactor complete, but mapping them to new theme roughly
        'space-black': '#050505',
        'cosmic-blue': '#0A0A0A', 
        'starlight-white': '#FFFFFF',
        'nebula-purple': '#FFFFFF', // Monochromatized
        'highlight-cyan': '#FFFFFF', // Monochromatized
        'deep-void': '#000000',
      },
      fontFamily: {
        plaster: ['Plaster', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
         'grid-pattern': "linear-gradient(to right, #1f1f1f 1px, transparent 1px), linear-gradient(to bottom, #1f1f1f 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px #6C63FF' },
          '50%': { opacity: '.5', boxShadow: '0 0 20px #6C63FF' },
        }
      }
    },
  },
  plugins: [],
}
