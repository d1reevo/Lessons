/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        dark: {
          bg: '#0f0f1a',
          card: '#1a1a2e',
          border: '#2a2a4a',
          hover: '#252545',
        },
        accent: {
          purple: '#6366f1',
          blue: '#3b82f6',
          pink: '#ec4899',
        }
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
