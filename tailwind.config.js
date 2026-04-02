/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#D6001C',
        'brand-red-hover': '#B50018',
        'obsidian': '#09090B',
        'apple-gray': '#86868B',
        'apple-text': '#1D1D1F',
        'surface': '#FBFBFC',
        'surface-alt': '#F5F5F7',
        'border-light': '#D2D2D7',
        'border-faint': '#EDEDEF',
        'zinc-muted': '#A1A1AA',
        'zinc-dark': '#71717A',
        'zinc-text': '#424245',
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        'site': '1440px',
      },
      borderRadius: {
        '4xl': '32px',
        '5xl': '40px',
        '6xl': '60px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-out': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
      },
    },
  },
  plugins: [],
}
