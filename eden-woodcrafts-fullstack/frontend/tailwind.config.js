/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "rgb(var(--color-forest) / <alpha-value>)",
          light: "rgb(var(--color-forest-light) / <alpha-value>)"
        },
        wood: {
          DEFAULT: "rgb(var(--color-wood) / <alpha-value>)",
          light: "rgb(var(--color-wood-light) / <alpha-value>)"
        },
        warmwhite: "rgb(var(--color-warmwhite) / <alpha-value>)",
        gold: "rgb(var(--color-gold) / <alpha-value>)",
        charcoal: "rgb(var(--color-charcoal) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "page-bg": "rgb(var(--color-page-bg) / <alpha-value>)",
        "page-ink": "rgb(var(--color-page-ink) / <alpha-value>)"
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        sans: ["system-ui", "sans-serif"]
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};
