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

// Some backend routes share a name with a page: /cart is both a POST API and
// the React cart page. Proxying every /cart request sent the browser's own
// page request to the API, which answers "Cannot GET /cart" — so opening or
// refreshing the cart URL directly was broken in development. Clicking through
// the site worked, because React Router never asks the server.
//
// A browser asking for a page sends Accept: text/html. The app's own calls go
// through axios, which does not. That difference is enough to tell them apart:
// page requests fall through to Vite, API calls still reach the backend.
//
// Production is unaffected — vercel.json already rewrites everything to the app.
const bypassPageRequests = (req) => {
  const wantsHtml = req.method === "GET" && req.headers.accept?.includes("text/html");
  return wantsHtml ? "/index.html" : null;
};

const proxy = Object.fromEntries(
  backendRoutes.map((route) => [
    route,
    {
      target: backendTarget,
      changeOrigin: true,
      bypass: bypassPageRequests,
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
