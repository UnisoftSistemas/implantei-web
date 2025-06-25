import { createSystem, defaultConfig } from "@chakra-ui/react";

// Implantei brand colors based on the design system
const implanteiTheme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        // Primary brand colors (purples from the design)
        brand: {
          50: { value: "#f5f3ff" },
          100: { value: "#ede9fe" },
          200: { value: "#ddd6fe" },
          300: { value: "#c4b5fd" },
          400: { value: "#a78bfa" },
          500: { value: "#8b5cf6" }, // Main purple
          600: { value: "#7c3aed" }, // Primary purple from design
          700: { value: "#6d28d9" },
          800: { value: "#5b21b6" },
          900: { value: "#4c1d95" },
        },
        // Secondary brand colors (darker purples)
        brandDark: {
          50: { value: "#faf7ff" },
          100: { value: "#f3efff" },
          200: { value: "#e9dfff" },
          300: { value: "#d4c4ff" },
          400: { value: "#b794f6" },
          500: { value: "#9f7aea" },
          600: { value: "#805ad5" },
          700: { value: "#6b46c1" }, // Secondary purple from design
          800: { value: "#553c9a" },
          900: { value: "#44337a" },
        },
        // Accent color (yellow from design)
        accent: {
          50: { value: "#fffbeb" },
          100: { value: "#fef3c7" },
          200: { value: "#fde68a" },
          300: { value: "#fcd34d" },
          400: { value: "#fbbf24" }, // Yellow from design
          500: { value: "#f59e0b" },
          600: { value: "#d97706" },
          700: { value: "#b45309" },
          800: { value: "#92400e" },
          900: { value: "#78350f" },
        },
        // Neutral grays
        gray: {
          50: { value: "#f9fafb" },
          100: { value: "#f3f4f6" },
          200: { value: "#e5e7eb" },
          300: { value: "#d1d5db" },
          400: { value: "#9ca3af" },
          500: { value: "#6b7280" },
          600: { value: "#4b5563" },
          700: { value: "#374151" },
          800: { value: "#1f2937" },
          900: { value: "#111827" },
        },
      },
      fonts: {
        heading: {
          value:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        },
        body: {
          value:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        },
      },
      fontSizes: {
        xs: { value: "0.75rem" },
        sm: { value: "0.875rem" },
        md: { value: "1rem" },
        lg: { value: "1.125rem" },
        xl: { value: "1.25rem" },
        "2xl": { value: "1.5rem" },
        "3xl": { value: "1.875rem" },
        "4xl": { value: "2.25rem" },
        "5xl": { value: "3rem" },
      },
      radii: {
        sm: { value: "0.375rem" },
        md: { value: "0.5rem" },
        lg: { value: "0.75rem" },
        xl: { value: "1rem" },
      },
      shadows: {
        sm: { value: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
        md: {
          value:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
        lg: {
          value:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        },
        xl: {
          value:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        },
      },
    },
    semanticTokens: {
      colors: {
        // App specific semantic tokens
        bg: {
          default: { value: "white" },
          subtle: { value: "gray.50" },
          muted: { value: "gray.100" },
        },
        fg: {
          default: { value: "gray.900" },
          muted: { value: "gray.600" },
          subtle: { value: "gray.500" },
        },
        border: {
          default: { value: "gray.200" },
          muted: { value: "gray.100" },
        },
      },
    },
  },
});

export default implanteiTheme;
