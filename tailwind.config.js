/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        'apple-text': '#0c0c0c',
        'apple-gray': '#86868b',
        'apple-bg': '#ededed',
        'ink-soft': '#302f2f',
        'surface': '#f7f7f7',
        'surface-alt': '#ededed',
        'brand-red': '#d90b0f',
      },
      maxWidth: {
        'site': '1440px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      borderRadius: {
        'premium': '32px',
      },
      boxShadow: {
        'premium': '0 20px 80px rgba(15, 23, 42, 0.10)',
        'surface': '0 18px 60px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
}
