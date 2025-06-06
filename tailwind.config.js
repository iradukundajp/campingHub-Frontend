/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF385C',
        'primary-dark': '#E31C5F',
        'gray-dark': '#222222',
      }
    },
  },
  plugins: [],
}