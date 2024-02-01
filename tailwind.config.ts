import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import themes from "daisyui/src/theming/themes";
import { withUt } from "uploadthing/tw";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...themes["light"],
          primary: "oklch(65.69% 0.196 275.75)",
          secondary: "oklch(47.5% 0.178 275.75)",
        }
      },
      {
        dark: {
          ...themes["dark"],
          secondary: "oklch(47.5% 0.178 275.75)"
        }
      }
    ],
  },
  safelist: [
    "alert-success",
    "alert-error",
    "alert-info",
    "alert-warning",
  ]
};

export default withUt(config);
