/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#818CF8',
        cta: '#22C55E',
        background: '#EEF2FF',
        textPrimary: '#312E81',
      },
      fontFamily: {
        heading: ['"Baloo 2"', 'cursive'],
        body: ['"Comic Neue"', 'cursive'],
      },
      borderRadius: {
        'clay': '16px',
        'clay-lg': '24px',
      },
      boxShadow: {
        'clay': '4px 4px 8px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(255, 255, 255, 0.7)',
        'clay-lg': '6px 6px 12px rgba(0, 0, 0, 0.15), -3px -3px 8px rgba(255, 255, 255, 0.8)',
        'clay-pressed': 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -1px -1px 3px rgba(255, 255, 255, 0.7)',
      },
    },
  },
  plugins: [],
}
