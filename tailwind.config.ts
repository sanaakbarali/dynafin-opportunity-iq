import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#F3F0E7",
          50: "#FAF8F3",
          100: "#F3F0E7",
          200: "#E8E3D5",
          300: "#DCD5C1",
          400: "#CBC2A9",
        },
        charcoal: {
          DEFAULT: "#14221E",
          50: "#364B44",
          100: "#2B3F39",
          200: "#223530",
          300: "#1C2E29",
          400: "#182823",
          500: "#14221E",
          600: "#0F1A17",
          700: "#0B1311",
          800: "#070C0B",
          900: "#040706",
        },
        sage: {
          DEFAULT: "#879B78",
          light: "#A4B598",
          dark: "#5E724F",
          muted: "#D0D9CA",
        },
        rust: {
          DEFAULT: "#B66B4D",
          light: "#CF896D",
          dark: "#8D4B31",
          subtle: "#F5ECE7",
        },
        amber: {
          DEFAULT: "#D5A34E",
          light: "#E3BE79",
          dark: "#A67A2E",
          subtle: "#F9F3E7",
        },
        border: {
          light: "#DCD7C9",
          dark: "#263630",
          subtle: "#E5E0D2",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Instrument Serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "Courier New", "monospace"],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        editorial: "0.06em",
        widest: "0.15em",
      },
    },
  },
  plugins: [],
};

export default config;
