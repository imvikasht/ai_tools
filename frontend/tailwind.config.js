/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d8ebff",
          300: "#7bb8ff",
          400: "#4699ff",
          500: "#0b7cff",
          600: "#005fd4"
        }
      },
      boxShadow: {
        glow: "0 20px 45px rgba(11, 124, 255, 0.18)"
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top left, rgba(11,124,255,0.22), transparent 32%), radial-gradient(circle at top right, rgba(16,185,129,0.16), transparent 28%), linear-gradient(135deg, rgba(15,23,42,0.96), rgba(2,6,23,1))"
      }
    }
  },
  plugins: []
};
