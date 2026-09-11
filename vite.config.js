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
  // Nothing the app logs is for a customer. Most of the console.log calls in
  // this codebase are `console.log(error)` inside a catch, which prints the
  // API's own error payload — route names, validation messages, occasionally
  // an id — into the console of whoever opens dev tools on the live site.
  //
  // Dropped at build time rather than deleted from the source, so the same
  // lines still help while developing and a future one cannot slip out. This
  // applies to the production build only; `vite dev` keeps them.
  esbuild: {
    drop: ['console', 'debugger'],
  },
  test: {
    // Playwright's spec lives in tests-e2e and drives a deployed site through
    // a real browser. Vitest picking it up meant `npm test` failed on an
    // import of @playwright/test that has no business running here.
    exclude: ['node_modules/**', 'tests-e2e/**', 'dist/**'],
  },
})
