/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        apple: {
          dark: '#0A0D14',
          card: '#161B26',
          border: '#262F42',
          blue: '#0A84FF',
          green: '#30D158',
          orange: '#FF9F0A',
          yellow: '#FFD60A',
          red: '#FF453A',
        },
      },
    },
  },
  plugins: [],
};
