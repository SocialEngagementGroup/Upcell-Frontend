/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'apple-text': '#1d1d1f',
        'apple-gray': '#86868b',
        'apple-bg': '#f5f5f7',
        'brand-red': '#FF3B30',
        'brand-blue': '#0071e3',
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
