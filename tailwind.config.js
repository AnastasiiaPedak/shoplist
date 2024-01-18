/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
  ],
  theme: {
    extend: {},
    colors: {
      'main-green': '#0AB6AB',
      'main-green-hover': '#089188',
      'main-gray': '#151515',
      'gray-400': '#9ca3af',
      'background-gray': '#4C4B4B',
      'error': '#f87171'
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
  },
  plugins: [],
}

