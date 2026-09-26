import type { Config } from "tailwindcss";

// Serayu UI - token namespace: sd-
// Tailwind utility classes stay clean (no prefix), e.g. bg-background
// which resolves to var(--sd-background).
const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./playground/**/*.{ts,tsx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--sd-background)",
        foreground: "var(--sd-foreground)",
        surface: "var(--sd-surface)",
        "surface-foreground": "var(--sd-surface-foreground)",
        card: "var(--sd-card)",
        "card-foreground": "var(--sd-card-foreground)",
        muted: "var(--sd-muted)",
        "muted-foreground": "var(--sd-muted-foreground)",
        border: "var(--sd-border)",
        input: "var(--sd-input)",
        ring: "var(--sd-ring)",
        brand: "var(--sd-brand)",
        "brand-foreground": "var(--sd-brand-foreground)",
        success: "var(--sd-success)",
        "success-foreground": "var(--sd-success-foreground)",
        warning: "var(--sd-warning)",
        "warning-foreground": "var(--sd-warning-foreground)",
        danger: "var(--sd-danger)",
        "danger-foreground": "var(--sd-danger-foreground)",
        info: "var(--sd-info)",
        "info-foreground": "var(--sd-info-foreground)",
      },
      borderRadius: {
        sm: "var(--sd-radius-sm)",
        md: "var(--sd-radius-md)",
        lg: "var(--sd-radius-lg)",
        xl: "var(--sd-radius-xl)",
      },
      boxShadow: {
        sm: "var(--sd-shadow-sm)",
        md: "var(--sd-shadow-md)",
        lg: "var(--sd-shadow-lg)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
