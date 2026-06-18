import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware surface scale (values come from CSS variables)
        surface: {
          950: "var(--surface-950)",
          900: "var(--surface-900)",
          800: "var(--surface-800)",
          700: "var(--surface-700)",
          600: "var(--surface-600)",
          500: "var(--surface-500)",
        },
        // Theme-aware text scale
        ink: {
          50: "var(--ink-50)",
          100: "var(--ink-100)",
          200: "var(--ink-200)",
          300: "var(--ink-300)",
          400: "var(--ink-400)",
        },
        // Theme-aware accent colors
        accent: {
          green: "var(--accent-green)",
          greenHover: "var(--accent-green-hover)",
          greenDim: "var(--accent-green-dim)",
          red: "var(--accent-red)",
          redHover: "var(--accent-red-hover)",
          redDim: "var(--accent-red-dim)",
          yellow: "var(--accent-yellow)",
        },
        // Legacy aliases — kept for backward compat during migration
        beige: {
          500: "#98908b",
          100: "#f8f4f0",
          200: "#f2f3f7",
        },
        grey: {
          900: "#201f24",
          500: "#696868",
          300: "#b3b3b3",
          100: "#f2f2f2",
        },
        secondary: {
          green: "#277c78",
          greenHover: "#339e96",
          yellow: "#f2cdac",
          cyan: "#82c9d7",
          navy: "#626070",
          red: "#c94736",
          redHover: "#ed564a",
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
        sans: ["Inter", "sans-serif"],
      },
      screens: {
        "max-sm": { max: "500px" },
        "max-md": { max: "768px" },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
} satisfies Config;
