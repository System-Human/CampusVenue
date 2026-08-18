/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          600: '#4F46E5', // Primary Deep Indigo
        },
        slate: {
          900: '#0F172A', // Slate Neutral
        },
        emerald: {
          500: '#10B981', // Confirmed Green
        },
        amber: {
          500: '#F59E0B', // Maintenance Amber
        },
        rose: {
          500: '#EF4444', // Error Rose
        }
      }
    },
  },
  plugins: [],
}

