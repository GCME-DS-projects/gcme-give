import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Primary giving colors - warm, compassionate, trustworthy
        primary: {
          50: "#E0E3EB",
          100: "#B8C0D4",
          200: "#8E9BBF",
          300: "#6476AA",
          400: "#3A5195",
          500: "#102C80",
          600: "#0E276E",
          700: "#0C215C",
          800: "#0A1C4A",
          900: "#081638",
          950: "#050B1B",
        },
        // Secondary compassion colors - soft, nurturing blues
        secondary: {
          50: "#f0f9ff", // Very light sky blue
          100: "#e0f2fe", // Light sky blue
          200: "#bae6fd", // Soft sky blue
          300: "#7dd3fc", // Medium sky blue
          400: "#38bdf8", // Bright sky blue
          500: "#0ea5e9", // Primary compassion blue
          600: "#0284c7", // Deeper blue
          700: "#0369a1", // Rich blue
          800: "#075985", // Deep blue
          900: "#0c4a6e", // Very deep blue
          950: "#082f49", // Darkest blue
        },
        // Success/hope colors - fresh, life-giving greens
        success: {
          50: "#f0fdf4", // Very light green
          100: "#dcfce7", // Light green
          200: "#bbf7d0", // Soft green
          300: "#86efac", // Medium green
          400: "#4ade80", // Bright green
          500: "#22c55e", // Primary success green
          600: "#16a34a", // Deeper green
          700: "#15803d", // Rich green
          800: "#166534", // Deep green
          900: "#14532d", // Very deep green
          950: "#052e16", // Darkest green
        },
        // Urgency/action colors - motivating reds
        urgent: {
          50: "#fef2f2", // Very light red
          100: "#fee2e2", // Light red
          200: "#fecaca", // Soft red
          300: "#fca5a5", // Medium red
          400: "#f87171", // Bright red
          500: "#ef4444", // Primary urgent red
          600: "#dc2626", // Deeper red
          700: "#b91c1c", // Rich red
          800: "#991b1b", // Deep red
          900: "#7f1d1d", // Very deep red
          950: "#450a0a", // Darkest red
        },
        // Neutral colors - warm, welcoming grays
        neutral: {
          50: "#fafaf9", // Very light warm white
          100: "#f5f5f4", // Light warm gray
          200: "#e7e5e4", // Soft warm gray
          300: "#d6d3d1", // Medium warm gray
          400: "#a8a29e", // Balanced warm gray
          500: "#78716c", // Primary neutral gray
          600: "#57534e", // Deeper warm gray
          700: "#44403c", // Rich warm gray
          800: "#292524", // Deep warm gray
          900: "#1c1917", // Very deep warm gray
          950: "#0c0a09", // Darkest warm gray
        },
        extend: {
          colors: {
            primary: {
              50: "#E0E3EB",
              100: "#B8C0D4",
              200: "#8E9BBF",
              300: "#6476AA",
              400: "#3A5195",
              500: "#102C80", // ← navy blue
              600: "#0E276E",
              700: "#0C215C",
              800: "#0A1C4A",
              900: "#081638",
              950: "#050B1B",
            },
          }
        },

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "missionary-slide": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-50% - 1rem))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "missionary-slide": "missionary-slide 60s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;
