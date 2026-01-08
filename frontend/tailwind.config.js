module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
    './src/services/**/*.{js,ts,jsx,tsx}',
    './node_modules/@sk-web-gui/*/dist/**/*.js',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-to-45': 'linear-gradient(45deg, var(--tw-gradient-stops))',
      },
      animation: {
        skeleton: 'skeleton 2s ease infinite',
      },
      keyframes: {
        skeleton: {
          '0%, 50%': { 'background-position': '0% 50%' },
          '75%': { 'background-position': '100% 50%' },
        },
      },
    },
    // extend: {
    // if you want to override max content width
    // maxWidth: {
    //   content: screens['desktop-max'], // default in core is based on screens
    // },
  },
  darkMode: 'class', // or 'media' or 'class'
  presets: [require('@sk-web-gui/core').preset()],
  // plugins: [require('@tailwindcss/forms'), require('@sk-web-gui/core')],
};
