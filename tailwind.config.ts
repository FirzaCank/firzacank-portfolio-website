import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          DEFAULT: "#F5EFE4", // bg base
          deep: "#EBE3D2",
          card: "#FBF8F2",
        },
        sage: {
          DEFAULT: "#5A7058", // primary, AAA on beige (7.1:1)
          soft: "#A8B89E",     // decorative only
          deep: "#3F5040",
        },
        terracotta: {
          DEFAULT: "#B5552E", // accent, AA on beige (4.8:1)
          deep: "#8E3F1F",
        },
        ink: {
          DEFAULT: "#1F2419", // text, AAA (16.8:1 on beige)
          muted: "#4A5145",    // secondary text, AAA (8.2:1)
        },
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Modular scale 1.25
        xs: ["0.8rem", { lineHeight: "1.5" }],
        sm: ["0.9rem", { lineHeight: "1.55" }],
        base: ["1rem", { lineHeight: "1.65" }],
        lg: ["1.125rem", { lineHeight: "1.6" }],
        xl: ["1.25rem", { lineHeight: "1.5" }],
        "2xl": ["1.5rem", { lineHeight: "1.4" }],
        "3xl": ["1.875rem", { lineHeight: "1.25" }],
        "4xl": ["2.5rem", { lineHeight: "1.15" }],
        "5xl": ["3.25rem", { lineHeight: "1.1" }],
        "6xl": ["4.25rem", { lineHeight: "1.05" }],
        "7xl": ["5.5rem", { lineHeight: "1" }],
        "8xl": ["7rem", { lineHeight: "0.95" }],
      },
      maxWidth: {
        prose: "68ch",
        container: "1280px",
      },
      spacing: {
        section: "6rem",
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
