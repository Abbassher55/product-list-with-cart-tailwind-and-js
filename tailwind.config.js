/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      colors: {
        "rose-50": "#FCF8F6",
        "rose-100": "#F5EEEC",
        "rose-300": "#CAAFA7",
        "rose-400": "#AD8A85",
        "rose-500": "#87635A",
        "rose-900": "#260F08",
        red: "#C73B0F",
        green: "#1EA575",
      },
      fontFamily: {
        "red-hat": ['"Red Hat Text"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
