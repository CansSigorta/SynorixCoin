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
          navy: "#0a0e1a",
          ink: "#050810",
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
      },
      boxShadow: {
        glow: "0 0 60px -12px rgba(0, 240, 255, 0.35)",
        "glow-sm": "0 0 24px -8px rgba(0, 240, 255, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
