/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#F1641D",
          hover: "#D9520F",
          soft: "#FBE8D8",
        },
        im: {
          // Page & surface — near-white, very light (65-75% of design)
          bg: "#FFFFFF",
          surface: "#FFFFFF",
          surfaceAlt: "#F7F7F5",

          // Accent palette (from spec)
          orange: "#D47E30",
          orangeHover: "#B8671E",
          orangeLight: "#FBF0E6",
          orangeSubtle: "#FDF5EE",

          // Cream — soft section tints (15-20% of design)
          cream: "#FDFBD4",
          creamMid: "#FAF8D4",

          // Brown tones
          brown: "#8D5A2B",
          earth: "#825E34",

          // Typography
          text: "#1A1A1A",
          textMid: "#3D3D3D",
          textLight: "#6B6B6B",
          textMuted: "#9A9A9A",

          // Borders — very light
          border: "#EBEBEB",
          borderLight: "#F2F2F0",
          borderWarm: "#EDE8E2",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        headline: ["Space Grotesk", "system-ui", "sans-serif"],
        handwriting: ["Caveat", "cursive"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 12px rgba(0,0,0,0.06)",
        card: "0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
        "card-hover":
          "0 4px 8px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.08)",
        panel: "0 8px 40px rgba(0,0,0,0.06)",
        orange: "0 8px 24px rgba(212,126,48,0.28)",
        "orange-lg": "0 12px 36px rgba(212,126,48,0.36)",
        popover: "0 8px 40px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      transitionDuration: {
        120: "120ms",
        150: "150ms",
        200: "200ms",
        250: "250ms",
        300: "300ms",
        450: "450ms",
        700: "700ms",
        fast: "150ms",
        base: "250ms",
        slow: "450ms",
        xslow: "700ms",
      },
      transitionTimingFunction: {
        "ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
        "ease-spring": "cubic-bezier(0.34, 1.4, 0.64, 1)",
        spring: "cubic-bezier(0.34, 1.4, 0.64, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "deck-settle": {
          "0%": { transform: "scale(0.97) translateY(4px)", opacity: "0.7" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 450ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scale-in 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        shimmer: "shimmer 1.6s linear infinite",
        "draw-line": "draw-line 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slide-up 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "deck-settle": "deck-settle 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};
