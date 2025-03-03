import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        swanky: ['var(--font-swanky)'],
      },
    },
  },
  plugins: [],
};

export default config;
