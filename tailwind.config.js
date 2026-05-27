/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a0f2e',
        secondary: '#2d1b4e',
        accent: '#7c3aed',
        'glass-light': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(0, 0, 0, 0.4)',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
