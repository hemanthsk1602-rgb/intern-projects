import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        orbit: {
          darkBg: "#05070D",
          darkCard: "#0B1120",
          darkSurface: "#0F172A",
          darkBorder: "#1E293B",
          darkHover: "#1E2B45",
          lightBg: "#F5F7FB",
          lightCard: "#FFFFFF",
          lightSurface: "#F8FAFC",
          lightBorder: "#E2E8F0",
          lightHover: "#EDF2F7",
          cyan: "#00F0FF",
          cyanGlow: "rgba(0, 240, 255, 0.4)",
          electric: "#3B82F6",
          electricGlow: "rgba(59, 130, 246, 0.4)",
          violet: "#8B5CF6",
          violetGlow: "rgba(139, 92, 246, 0.4)",
          emerald: "#10B981",
          emeraldGlow: "rgba(16, 185, 129, 0.4)",
          rose: "#F43F5E",
          amber: "#F59E0B"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-dark": "radial-gradient(at 0% 0%, rgba(6, 182, 212, 0.12) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(59, 130, 246, 0.12) 0px, transparent 50%)",
        "mesh-light": "radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.08) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(8, 145, 178, 0.08) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(124, 58, 237, 0.05) 0px, transparent 50%)",
      },
      boxShadow: {
        "glow-cyan": "0 0 25px -5px rgba(0, 240, 255, 0.35)",
        "glow-electric": "0 0 25px -5px rgba(59, 130, 246, 0.35)",
        "glow-violet": "0 0 25px -5px rgba(139, 92, 246, 0.35)",
        "glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.35)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        "glass-light": "0 8px 30px 0 rgba(0, 0, 0, 0.06)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "orbit-rotate": "rotate 30s linear infinite",
        "spin-reverse": "spin-reverse 25s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "spin-reverse": {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
