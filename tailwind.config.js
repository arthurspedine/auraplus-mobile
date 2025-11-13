/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1F89DA",
        secondary: "rgba(255, 255, 255, 0.2)",
        background: "#111",
        text: "#ffffff",
        foreground: "#ffffff",
        card: "#222222",
        muted: "#cccccc",
      },
    },
  },
  plugins: [],
}