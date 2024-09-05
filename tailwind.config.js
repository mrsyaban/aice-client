const defaultTheme = require("tailwindcss/defaultTheme");


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM", ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'button-color': 'linear-gradient(112.8deg, #6A36FF -15.76%, #AC5FE6 102.86%)',
        'navbar-color': 'linear-gradient(83.79deg, #1B45B4 3.25%, #1C2792 96.85%)',
      },
      colors: {
        primary: {
          white: '#EBF7FF',
          blue: '#14358A',
        },
      },
    },
  },
  plugins: [],
}