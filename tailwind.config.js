/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#b42318',
        'brand-red-hover': '#8f1d14',
        'obsidian': '#09090b',
        'apple-gray': '#6e6e73',
        'apple-text': '#1d1d1f',
        'surface': '#f8f8fa',
        'surface-alt': '#f3f4f6',
        'border-light': '#d2d2d7',
        'border-faint': '#e8e8ed',
        'zinc-muted': '#a1a1aa',
        'zinc-dark': '#71717a',
        'zinc-text': '#424245',
        'chrome': '#fafafc',
        'ink-soft': '#515154',
        'platinum': '#e9eaee',
      },
      fontFamily: {
        'sans': ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        'site': '1480px',
      },
      borderRadius: {
        '4xl': '32px',
        '5xl': '40px',
        '6xl': '60px',
      },
      boxShadow: {
        'soft': '0 18px 60px rgba(15, 23, 42, 0.06)',
        'medium': '0 30px 90px rgba(15, 23, 42, 0.12)',
        'glass': '0 20px 80px rgba(15, 23, 42, 0.10)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-out': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
      },
    },
  },
  plugins: [],
}
