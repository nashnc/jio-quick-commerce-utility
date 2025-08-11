/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3827fa",
      },
      backgroundColor: {
        primary: "#3872fa",
      },
    },
  },
  plugins: [],
};
