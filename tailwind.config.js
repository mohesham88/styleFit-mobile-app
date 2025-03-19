/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        secondary: "#1F2937",
        light: {
          100: "#E5E7EB",
          200: "#D1D5DB",
          300: "#9CA3AF",
        },
        dark: {
          100: "#111827",
          200: "#0F172A",
        },
        accent: "#EC4899",
        text: "#F9FAFB",
      },
    },
  },
  plugins: [],
};
