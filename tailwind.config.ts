import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        synorix: {
          cyan: "#00f0ff",
          sky: "#38bdf8",
          violet: "#7c5cff",
          iris: "#a78bfa",
          navy: "#0a0e1a",
          ink: "#050810",
          void: "#02040a",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 240, 255, 0.15), transparent)",
        "mesh":
          "radial-gradient(ellipse 60% 50% at 15% 0%, rgba(124, 92, 255, 0.18), transparent 60%), radial-gradient(ellipse 50% 50% at 90% 10%, rgba(0, 240, 255, 0.14), transparent 55%)",
        "cyan-violet": "linear-gradient(135deg, #00f0ff 0%, #38bdf8 40%, #7c5cff 100%)",
      },
      boxShadow: {
        glow: "0 0 60px -12px rgba(0, 240, 255, 0.35)",
        "glow-sm": "0 0 24px -8px rgba(0, 240, 255, 0.25)",
        "glow-violet": "0 0 60px -12px rgba(124, 92, 255, 0.4)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 50px -20px rgba(0,0,0,0.8)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
