/** @type {import('tailwindcss').Config} */
import tailwindHamburgers from 'tailwind-hamburgers'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindHamburgers
  ],
}

