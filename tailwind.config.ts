import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./app/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        'dark-btn': '#3B3C3E',

        // background layers
        bgPri: "var(--bg-primary)",
        bgSec: "var(--bg-secondary)",

        // background layers
        bgHoverPri: "var(--bg-hover-primary)",
        bgHoverSec: "var(--bg-hover-secondary)",

        // text roles
        textPri: "var(--text-primary)",
        textSec: "var(--text-secondary)",

        // borders
        borderPri: "var(--border-primary)",
      },
    },
  },
  plugins: [],
} satisfies Config;
