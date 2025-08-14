/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'kenburns': 'kenburns-top-right 20s ease-in-out infinite alternate',
        'fade-in': 'fade-in 0.8s ease-in forwards',
      },
      keyframes: {
        'kenburns-top-right': {
          '0%': {
            transform: 'scale(1) translate(0, 0)',
            'transform-origin': '84% 16%',
          },
          '50%': {
            transform: 'scale(1.1) translate(5px, -3px)',
            'transform-origin': 'right top',
          },
          '100%': {
            transform: 'scale(1.15) translate(10px, -5px)',
            'transform-origin': 'right top',
          },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
  ],
};