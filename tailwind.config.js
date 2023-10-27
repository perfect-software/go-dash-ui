/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens:{
      'sml': {'max': '1000px'},
      'sm': {'max': '695px'},
       'smp':  {'max': '541px'},
     
     
    },
    extend: {
      colors: {
        customGrey: '#5b5b5b',
        customWhite: '#F8F9F9',
      },
    },
  },
  plugins: [],
}

