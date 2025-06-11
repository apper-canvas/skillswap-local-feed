/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C6E49',
        secondary: '#52B788',
        accent: '#FF6B6B',
        surface: '#FEFAE0',
        background: '#FFFEF7',
        success: '#40916C',
        warning: '#F4A460',
        error: '#E63946',
        info: '#457B9D',
surface: {
          100: '#FEFAE0',
          200: '#F8F4D3',
          300: '#F2EFC6',
          400: '#ECE9B9',
          500: '#E6E4AC',
          600: '#CFC99F',
          700: '#B8B392',
          800: '#A19E85',
          900: '#8A8878'
        }
      },
      fontFamily: { 
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'], 
        heading: ['Fredoka One', 'ui-sans-serif', 'system-ui'] 
      },
      borderRadius: {
        'xl': '16px',
        'lg': '12px'
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.15)'
      }
    },
  },
  plugins: [],
}