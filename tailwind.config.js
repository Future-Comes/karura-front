const colors = require("./constants/colors.json");

module.exports = {
  content: ["./app/**/*.{html,tsx}"],
  theme: {
    extend: {
      colors,
      fontSize: {
        "6xl": "3.5rem",
      },
    },
    fontFamily: {
      sans: ["Space Grotesk", "sans-serif"],
    },
  },
};
