/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './donate.html',
    './about.html',
    './getinvolved.html',
    './work.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        moss: '#2E6B47',
        'moss-mid': '#3D8A5C',
        'moss-light': '#EBF4EE',
        terra: '#C25A3A',
        gold: '#B8892A',
        'gold-pale': '#FBF3E2',
        ink: '#1A1916',
        slate: '#4A4744',
        mist: '#7A7672',
        border: '#E2DDD6',
      },
      fontFamily: {
        serif: ['Lora', 'serif'],
        sans: ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
