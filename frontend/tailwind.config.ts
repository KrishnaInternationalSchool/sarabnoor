import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: "#f7f2ea",
        cream: "#fdfaf6",
        sage: "#9eb0a3",
        stone: "#8b7d72",
        ink: "#362f2a",
        blush: "#e9d8cf"
      },
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        serif: ["var(--font-heading)", "serif"]
      },
      boxShadow: {
        soft: "0 24px 60px rgba(91, 69, 52, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
