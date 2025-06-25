import { createSystem, defaultConfig } from "@chakra-ui/react";

// Implantei brand colors based on the actual design system
const implanteiTheme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        // Primary brand colors (correct purple palette)
        brand: {
          50: { value: "#F2F4FF" }, // Lightest purple from palette
          100: { value: "#E8EBFF" },
          200: { value: "#D1D6FF" },
          300: { value: "#B4BCFF" },
          400: { value: "#8B97FF" },
          500: { value: "#6517FF" }, // Main purple from palette
          600: { value: "#4E20E3" }, // Primary purple from palette
          700: { value: "#351B89" }, // Darker purple from palette
          800: { value: "#201835" }, // Darkest purple from palette
          900: { value: "#1A1428" },
        },
        // Keep brandDark as variations of the main purple
        brandDark: {
          50: { value: "#F2F4FF" },
          100: { value: "#E8EBFF" },
          200: { value: "#D1D6FF" },
          300: { value: "#B4BCFF" },
          400: { value: "#8B97FF" },
          500: { value: "#6517FF" },
          600: { value: "#4E20E3" },
          700: { value: "#351B89" },
          800: { value: "#201835" },
          900: { value: "#1A1428" },
        },
        // Accent color (yellow from palette)
        accent: {
          50: { value: "#FEFEF0" },
          100: { value: "#FEFDE8" },
          200: { value: "#FEFBD0" },
          300: { value: "#FDF8A8" },
          400: { value: "#FCF553" }, // Main yellow from palette
          500: { value: "#FBF237" },
          600: { value: "#F0E71A" },
          700: { value: "#D4CA15" },
          800: { value: "#B8AD13" },
          900: { value: "#9C9011" },
        },
        // Neutral grays
        gray: {
          25: { value: "#FAFBFC" },
          50: { value: "#F9FAFB" },
          100: { value: "#F3F4F6" },
          200: { value: "#E5E7EB" },
          300: { value: "#D1D5DB" },
          400: { value: "#9CA3AF" },
          500: { value: "#6B7280" },
          600: { value: "#4B5563" },
          700: { value: "#374151" },
          800: { value: "#1F2937" },
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
        "2xl": { value: "1.5rem" },
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
          subtle: { value: "gray.25" },
          muted: { value: "gray.50" },
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
