/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finance: {
          dark: '#090D16',
          card: '#0F172A',
          border: '#1E293B',
          accent: '#10B981',
        }
      }
    },
  },
  plugins: [],
}
