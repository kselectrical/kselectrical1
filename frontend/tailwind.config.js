/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: "#0F172A", // Primary Dark Navy
          "blue-dark": "#020617",
          "blue-light": "#F1F5F9",
          orange: "#F97316", // Accent Orange
          "orange-dark": "#EA580C",
          success: "#22C55E",
          charcoal: "#1E293B",
          dark: "#0F172A",
          gray: "#64748B",
          light: "#F8FAFC",
          silver: "#E2E8F0",
        }
      },
      boxShadow: {
        'card': '0 16px 35px -18px rgba(15, 23, 42, 0.2), 0 6px 12px -8px rgba(15, 23, 42, 0.1)',
        'card-hover': '0 24px 45px -20px rgba(15, 23, 42, 0.24), 0 10px 16px -10px rgba(15, 23, 42, 0.12)',
        'dropdown': '0 24px 50px -20px rgba(15, 23, 42, 0.24), 0 14px 22px -12px rgba(15, 23, 42, 0.15)',
        'search': '0 18px 45px -18px rgba(15, 23, 42, 0.16)',
        'button': '0 12px 24px -12px rgba(15, 23, 42, 0.22)',
        'soft': '0 10px 25px -16px rgba(15, 23, 42, 0.18)',
      }
    },
  },
  plugins: [],
}
