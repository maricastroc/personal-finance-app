import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          500: "#98908b",
          100: "#f8f4f0",
          200: "#f2f3f7",
        },
        gray: {
          900: "#201f24",
          500: "#696868",
          300: "#b3b3b3",
          100: "#f2f2f2",
        },
        secondary: {
          green: "#277c78",
          yellow: "#f2cdac",
          cyan: "#82c9d7",
          navy: "#626070",
          red: "#c94736",
          purple: "#826cb0",
          lightPurple: "#af81ba",
          turquoise: "#597c7c",
          brown: "#93674f",
          magenta: "#934f6f",
          blue: "#3f82b2",
          navyGrey: "#97a0ac",
          amyGreen: "#7f9161",
          gold: "#cab361",
          orange: "#b36c49",
          white: "#ffffff",
        },
      },
      fontSize: {
        "3xl": "2rem",
        "2xl": "1.75rem",
        xl: "1.25rem",
        base: "1rem",
        sm: "0.875rem",
        xs: "0.8rem",
        xxs: "0.75rem",
      },
      fontFamily: {
        sans: ["Public Sans", "sans-serif"], 
      },
      screens: {
        'max-sm': { 'max': '500px' },
        'max-md': { 'max': '768px' },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
} satisfies Config;
