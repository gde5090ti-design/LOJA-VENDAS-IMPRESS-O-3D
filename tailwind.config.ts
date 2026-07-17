import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1A1A18",
        paper: "#FAFAF8",
        surface: "#F2F1ED",
        signal: "#B54708",
        signal_dark: "#8A3606",
        signal_soft: "#FCEEE3",
        border_soft: "#E4E2DC",
        muted: "#8A8779",
        success: "#166534",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "16px",
        xl: "22px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,26,24,0.04), 0 10px 30px -14px rgba(26,26,24,0.16)",
        cardHover: "0 2px 4px rgba(26,26,24,0.06), 0 20px 40px -16px rgba(26,26,24,0.22)",
        soft: "0 1px 3px rgba(26,26,24,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
