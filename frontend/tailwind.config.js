/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-black': '#0B0B15',
        'cosmic-blue': '#1A1A2E',
        'starlight-white': '#EAEAEA',
        'nebula-purple': '#6C63FF',
        'highlight-cyan': '#00F0FF',
        'deep-void': '#050510',
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
