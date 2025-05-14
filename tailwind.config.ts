import type { Config } from "tailwindcss";

export default {
  // Update content array to include all template paths
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.css",  // Add this line
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        spin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'float': 'float 8s ease-in-out infinite',
        'float-spin': 'float 12s ease-in-out infinite, spin 20s linear infinite',
        'pulse': 'pulse 3s infinite ease-in-out'
      }
    },
  },
  plugins: [],
} satisfies Config;