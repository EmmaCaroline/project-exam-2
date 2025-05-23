export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Chivo", "sans-serif"],
        body: ["Tinos", "serif"],
      },
      colors: {
        primary: "#B2C5D1",
        secondary: "#3A515F",
        customButton: "#FEC156",
      },
    },
  },
  plugins: [],
};
