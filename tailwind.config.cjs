/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        eerieBlack: '#141414',
        softLilac: '#f6ebf4',
        customPurple: '#482673',
        digiDenim: '#301008',
        skyGreen: '#97e1c8',
        mustardBrown: '#3e363f',
        darkGreen: '#4A756E',
        deepTeal: '#1B4B43'
      },
      fontFamily: {
        poppins: ['Poppins'],
      }
    },
  },
  plugins: [],
}
