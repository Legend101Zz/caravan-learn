import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Caravan Orange Theme
        primary: {
          DEFAULT: "#E8813B",
          dark: "#C66D2D",
          light: "#F5A05A",
          50: "#FEF3E8",
          100: "#FDE7D1",
          200: "#FBCFA3",
          300: "#F9B775",
          400: "#F79F47",
          500: "#E8813B",
          600: "#BA672F",
          700: "#8B4D23",
          800: "#5D3318",
          900: "#2E1A0C",
        },
        // Background colors
        bg: {
          primary: "#0A0A0B",
          secondary: "#121214",
          tertiary: "#1A1A1D",
          card: "#1E1E22",
        },
        // Text colors
        text: {
          primary: "#F5F5F5",
          secondary: "#A0A0A0",
          muted: "#666666",
        },
        // Border
        border: {
          DEFAULT: "#2A2A2E",
        },
        // Package colors
        "pkg-bitcoin": "#E8813B",
        "pkg-psbt": "#6366F1",
        "pkg-wallets": "#10B981",
        "pkg-clients": "#06B6D4",
        "pkg-multisig": "#F59E0B",
        "pkg-fees": "#EC4899",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#F5F5F5",
            a: {
              color: "#E8813B",
              "&:hover": {
                color: "#F5A05A",
              },
            },
            code: {
              color: "#E8813B",
              backgroundColor: "#1A1A1D",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.25rem",
              fontWeight: "400",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
