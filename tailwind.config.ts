import { withUt } from "uploadthing/tw";
import type { Config } from "tailwindcss";


const config: Config = withUt({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lightBlue: "#d2e3e7",
        lightTeal: "#7ddbde",
        deepBlue: "#28608a",
        softPurple: "#879bbd",
        darkNavy: "#0f3163",
        brightTeal: "#4aabbb",
        softBlue: "#5e80ab",
        skyBlue: "#7cb5d6",
        darkTeal: "#113f59",
        lavender: "#ac94b9",
      },
    },
  },
  plugins: [],
});
export default config;
