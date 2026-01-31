/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/royalty-calculator/**/*.{html,ts}',
    './libs/royalty-calculator/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        merch: {
          primary: '#0f172a',
          'primary-light': '#1e293b',
          'primary-dark': '#020617',
          accent: '#3b82f6',
          'accent-hover': '#2563eb',
          'accent-muted': '#93c5fd',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
