/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FF6A00",
        "primary-dark": "#E65C00",
        "primary-light": "#FFA24D",

        background: "#140A00",
        surface: "#1F1208",
        "surface-dark": "#140A00",
        "surface-light": "#2A180C",

        foreground: "#FFF8F2",
        "foreground-muted": "#D9B8A0",
        "foreground-subtle": "#9A7B66",

        accent: "#FF8C42",
        "accent-secondary": "#FFC857",

        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#FF5C5C",

        border: "#3A2414",
        "border-light": "#4A2E1A",
      },
      fontFamily: {
        sans: ["GoogleSans-Regular"],
        "sans-medium": ["GoogleSans-Medium"],
        "sans-bold": ["GoogleSans-Bold"],
      },
    },
  },
  plugins: [],
};
