module.exports = {
  mode: 'jit',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'], // remove unused styles in production
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
      },
      screens: {
        sm: '768px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
