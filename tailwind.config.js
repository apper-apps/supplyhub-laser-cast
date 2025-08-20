/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f0ff',
          100: '#d6e3ff',
          200: '#b5cdff',
          300: '#89a9ff',
          400: '#5c7cff',
          500: '#2196f3',
          600: '#1e3a5f',
          700: '#1a2f4a',
          800: '#162438',
          900: '#121a26',
        },
        secondary: {
          50: '#e0f7ff',
          100: '#b8ebff',
          200: '#7dd3f0',
          300: '#3cb8db',
          400: '#00bcd4',
          500: '#0097a7',
          600: '#00796b',
          700: '#004d5c',
          800: '#003d4a',
          900: '#002d37',
        },
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',
        info: '#2196f3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '8px',
        'button': '6px',
        'input': '4px',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.1)',
        'hover': '0 4px 8px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}