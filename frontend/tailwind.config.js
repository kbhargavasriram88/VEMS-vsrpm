/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#0a0f1d',
        darkCard: '#111827',
        accentGold: '#fbbf24',
        accentGoldDark: '#d97706',
        textSecondary: '#94a3b8',
        whatsappGreen: '#25d366',
        primary: '#1E3A8A', // Keep for backward compatibility during transition
        secondary: '#D97706',
        accent: '#FBBF24',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
}
