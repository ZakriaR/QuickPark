/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        primary: "#5271ff",
        secondary: "#eff2ff",
      },
      fontSize: {
        '1.5xl': '1.375rem',
      },
    },
  },
  plugins: [],
};
