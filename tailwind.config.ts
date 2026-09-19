import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF8F5", // Warm cream/off-white as in reference images
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F3EFEA",
          tertiary: "#EBE6DF",
        },
        border: {
          DEFAULT: "#EBE7DF",
          subtle: "#F0ECE6",
          dark: "#D6CEBF",
        },
        brand: {
          DEFAULT: "#F26522", // Warm orange from the reference screenshot
          hover: "#E05310",
          light: "#FFF4ED",
        },
        dark: {
          DEFAULT: "#181D27", // Deep charcoal for primary CTA buttons and text
          secondary: "#2B313B",
          muted: "#535862",
        },
        risk: {
          healthy: "#16A34A",
          warning: "#F59E0B",
          danger: "#F26522",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        elevated: "0 10px 30px -5px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
        glow: "0 0 25px rgba(242, 101, 34, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
