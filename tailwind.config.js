/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        midnightblue: {
          500: '#191970',
          600: '#9599AD',
          // Add more shades if needed
        },
        nightblue: {
          600: '#000080',
          800: '#000033',
          // Add more shades if needed
        },
      },
    },
    screens: {
      xxs: '320px',
      xs: '480px',
      ss: '620px',
      sm: '768px',
      md: '1060px',
      lg: '1200px',
      xl: '1700px',
    },
  },
  plugins: [],
}
