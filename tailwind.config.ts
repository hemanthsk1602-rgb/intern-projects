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
        brand: {
          // Dark Mode Foundation
          darkBg: "#03060D",
          darkSecondary: "#060B14",
          darkCard: "#09111F",
          darkElevated: "#0D182B",
          darkText: "#F4F7FB",
          darkSecondaryText: "#A8B4C7",
          darkMuted: "#64748B",
          darkBorder: "rgba(0, 217, 255, 0.15)",

          // Light Mode Foundation
          lightBg: "#F5F8FC",
          lightSurface: "#FFFFFF",
          lightSecondary: "#F8FBFF",
          lightText: "#0F172A",
          lightSecondaryText: "#475569",
          lightMuted: "#64748B",
          lightBorder: "rgba(15, 23, 42, 0.10)",

          // Distinct Fintech Accents
          cyan: "#00D9FF",
          cyanLight: "#0891B2",
          blue: "#3B82F6",
          blueLight: "#2563EB",
          violet: "#8B5CF6",
          violetLight: "#7C3AED",
          success: "#10B981",
          successLight: "#059669",
          warning: "#F59E0B",
          pink: "#EC4899",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Space Grotesk", "Inter", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "glow-cyan": "0 0 20px -3px rgba(24, 217, 255, 0.25)",
        "glow-blue": "0 0 20px -3px rgba(38, 132, 255, 0.25)",
        "glow-subtle": "0 0 15px -3px rgba(24, 217, 255, 0.15)",
        "card-dark": "0 8px 30px rgba(5, 9, 20, 0.6)",
        "card-light": "0 4px 24px -2px rgba(22, 119, 255, 0.08), 0 2px 8px -1px rgba(16, 33, 58, 0.04)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "orbit-rotate": "rotate 35s linear infinite",
        "spin-reverse": "spin-reverse 30s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
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
