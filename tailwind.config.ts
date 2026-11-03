import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Near-black ground, one warm signal. Surface steps are tonal, not bordered.
        paper: "#09090B",
        surface: "#121212",
        raised: "#18181B",
        wash: "#1F1F23",
        line: "rgba(255,255,255,0.08)",
        edge: "rgba(255,255,255,0.16)",
        ink: "#F4F4F5",
        muted: "#8B8B94",
        steel: "#64646C",
        accent: "#FF6B35",
        "accent-soft": "rgba(255,107,53,0.12)",
        "accent-ink": "#FF8A5E",
        gold: "#E0B252",
        positive: {
          DEFAULT: "#4ADE80",
          soft: "rgba(74,222,128,0.10)",
          ink: "#86EFAC",
        },
        negative: {
          DEFAULT: "#F87171",
          soft: "rgba(248,113,113,0.10)",
          ink: "#FCA5A5",
        },
        warn: {
          DEFAULT: "#FBBF24",
          soft: "rgba(251,191,36,0.10)",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "var(--font-space-grotesk)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        heading: [
          "var(--font-space-grotesk)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-jetbrains-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      borderRadius: {
        none: "0px",
        sm: "0px",
        DEFAULT: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
        full: "9999px",
      },
      maxWidth: {
        canvas: "1360px",
        form: "400px",
      },
    },
  },
  plugins: [],
};

export default config;
