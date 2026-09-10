/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#111111',
          charcoal: '#1D1D1D',
          cream: '#F2EFE9',
          white: '#FFFFFF',
          gold: '#E6D19A',
          'gold-dark': '#C9A24D',
          gray: '#8C8C8C',
          border: '#D9D6D0',
          accent: '#A65F3B',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Bodoni Moda"', 'Didot', 'Georgia', 'serif'],
        sans: ['Montserrat', 'Inter', 'Manrope', 'sans-serif'],
        script: ['"Pinyon Script"', '"Playfair Display"', 'cursive'],
      },
      boxShadow: {
        'gold-glow': '0 4px 20px -2px rgba(230, 209, 154, 0.25)',
        'luxury': '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
