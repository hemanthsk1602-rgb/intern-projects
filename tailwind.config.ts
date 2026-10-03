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
          darkBg: "#050914",
          darkSecondary: "#07101F",
          darkCard: "#0B1426",
          darkElevated: "#0F1B31",
          darkText: "#F5F8FF",
          darkSecondaryText: "#8FA3BF",
          darkMuted: "#60738F",
          darkBorder: "rgba(80, 150, 255, 0.15)",

          // Light Mode Foundation
          lightBg: "#F4F8FC",
          lightSurface: "#FFFFFF",
          lightSecondary: "#F8FBFF",
          lightText: "#10213A",
          lightSecondaryText: "#60738F",
          lightMuted: "#8A9BB2",
          lightBorder: "rgba(30, 90, 160, 0.14)",

          // Distinct Fintech Accents
          cyan: "#18D9FF",
          cyanLight: "#00AFCF",
          blue: "#2684FF",
          blueLight: "#1677FF",
          violet: "#8B5CF6",
          violetLight: "#7657E8",
          success: "#20D6A3",
          successLight: "#0BAF83",
          warning: "#F5B942",
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
