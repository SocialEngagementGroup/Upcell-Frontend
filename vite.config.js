import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendTarget = process.env.VITE_API_URL || 'http://localhost:5001';
const backendRoutes = [
  '^/product(/|$)',
  '^/products(/|$)',
  '^/allSameParentProducts(/|$)',
  '^/searchproducts(/|$)',
  '^/all-products-single-variation(/|$)',
  '^/shop-categories(/|$)',
  '^/product-family(/|$)',
  '^/cart(/|$)',
  '^/orders(/|$)',
  '^/trade-in(/|$)',
  '^/newsletter(/|$)',
  '^/contact(/|$)',
  '^/analytics-events(/|$)',
  '^/stripe(/|$)',
  '^/checkout-customer(/|$)',
  '^/add-run-form-submit(/|$)',
  '^/this-month-sold-items(/|$)',
];

const proxy = Object.fromEntries(
  backendRoutes.map((route) => [
    route,
    {
      target: backendTarget,
      changeOrigin: true,
    },
  ])
);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy,
  },
})
