/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: '#0a0a0a',
        paper: '#fafaf7',
        cream: '#f5f1e8',
        accent: '#d4502e',
        'accent-dark': '#a13818',
      },
    },
  },
  plugins: [],
};
