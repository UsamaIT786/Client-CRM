import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Custom ProCRM palette tokens
        "procrm-dark": "#1a1b35",
        "procrm-darker": "#111224",
        "procrm-sidebar": "#141527",
        "procrm-border": "#242646",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-from-top-2": {
          "0%": { transform: "translateY(-8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "zoom-in-95": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "in": "fade-in 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-down": "slide-in-from-top-2 0.2s ease-out",
        "zoom-in": "zoom-in-95 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
