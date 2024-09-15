import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
     center: true,
     padding: '1rem',
     screens: {
       sm: '100%', // Small screens (e.g., phones)
       md: '720px', // Medium screens (e.g., tablets)
       lg: '924px', // Large screens (e.g., laptops)
       xl: '1080px', // Extra-large screens (e.g., desktops)
       '2xl': '1240px',
       '3xl': '1420px',
     },
   },
   extend: {
     backgroundImage: {
       "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
       "gradient-conic":
         "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
     },
     colors:{
       mainColor:"#0f4e7a",
       subColor:"#0d0f25",
     }
   },
 },
  plugins: [],
};
export default config;
