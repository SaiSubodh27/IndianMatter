/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
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
        200: "200ms",
        250: "250ms",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
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
        "fade-in": "fade-in 200ms ease-out",
        "slide-up": "slide-up 250ms ease-out",
        "deck-settle": "deck-settle 200ms ease-out",
      },
    },
  },
  plugins: [],
};
