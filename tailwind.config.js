/** @type {import('tailwindcss').Config} */
const plugin = require('tailwind-hamburgers', 'daisyui', 'headlessui');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin
  ],
}

