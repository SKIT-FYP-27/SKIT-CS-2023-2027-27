/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5F2EC",
        ink: "#1C1D22",
        navy: {
          DEFAULT: "#16233E",
          light: "#24365C",
          50: "#EBEEF3",
        },
        gold: {
          DEFAULT: "#B4872A",
          light: "#D9B45E",
        },
        slate: {
          DEFAULT: "#6B7280",
        },
        rise: "#3F7A5C",
        alert: "#A6423A",
        line: "#E3DFD6",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "4px",
      },
    },
  },
  plugins: [],
}
