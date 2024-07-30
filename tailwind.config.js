/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}"],
  theme: {
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
    },
  },
  plugins: [],
};
