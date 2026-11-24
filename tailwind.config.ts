import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#060913",
        stage: "#090E1D",
        primary: "#FFFFFF",
        secondary: "#CBD5E1",
        muted: "#64748B",
        dim: "#475569",
        accent: "#60A5FA",
        warning: "#F59E0B",
        danger: "#F87171",
        success: "#34D399",
        midnight: "#000B58",
        sidebarMidnight: "#000B58",
      },
      fontFamily: {
        sans: [
          "Poppins",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "SF Mono",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      aspectRatio: {
        "16/9": "16 / 9",
      },
    },
  },
  plugins: [],
};

export default config;
