/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: '',
        body: '',
        bebas: ['BebasNeue_400Regular'], // Add loaded font to taillwind font family
        sans: ['BebasNeue_400Regular'],
      },
      colors: {
        darkBlue: '#19639E',
        lightBlue: '#BADEFB',
        darkRed: '#B92916',
        lightRed: '#FFC0B8',
      },
    },
  },
};

