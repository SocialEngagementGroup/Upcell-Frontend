// vite.config.js
import { defineConfig } from "file:///C:/Users/USER/Desktop/client%20project/Upcell/Frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/USER/Desktop/client%20project/Upcell/Frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
var backendTarget = process.env.VITE_API_URL || "http://localhost:5001";
var backendRoutes = [
  "^/product(/|$)",
  "^/products(/|$)",
  "^/allSameParentProducts(/|$)",
  "^/searchproducts(/|$)",
  "^/all-products-single-variation(/|$)",
  "^/shop-categories(/|$)",
  "^/product-family(/|$)",
  "^/cart(/|$)",
  "^/orders(/|$)",
  "^/trade-in(/|$)",
  "^/newsletter(/|$)",
  "^/contact(/|$)",
  "^/analytics-events(/|$)",
  "^/stripe(/|$)",
  "^/checkout-customer(/|$)",
  "^/add-run-form-submit(/|$)",
  "^/this-month-sold-items(/|$)"
];
var proxy = Object.fromEntries(
  backendRoutes.map((route) => [
    route,
    {
      target: backendTarget,
      changeOrigin: true
    }
  ])
);
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    proxy
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVU0VSXFxcXERlc2t0b3BcXFxcY2xpZW50IHByb2plY3RcXFxcVXBjZWxsXFxcXEZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVU0VSXFxcXERlc2t0b3BcXFxcY2xpZW50IHByb2plY3RcXFxcVXBjZWxsXFxcXEZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9VU0VSL0Rlc2t0b3AvY2xpZW50JTIwcHJvamVjdC9VcGNlbGwvRnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtcdUZFRkZpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXHJcblxyXG5jb25zdCBiYWNrZW5kVGFyZ2V0ID0gcHJvY2Vzcy5lbnYuVklURV9BUElfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjUwMDEnO1xyXG5jb25zdCBiYWNrZW5kUm91dGVzID0gW1xyXG4gICdeL3Byb2R1Y3QoL3wkKScsXHJcbiAgJ14vcHJvZHVjdHMoL3wkKScsXHJcbiAgJ14vYWxsU2FtZVBhcmVudFByb2R1Y3RzKC98JCknLFxyXG4gICdeL3NlYXJjaHByb2R1Y3RzKC98JCknLFxyXG4gICdeL2FsbC1wcm9kdWN0cy1zaW5nbGUtdmFyaWF0aW9uKC98JCknLFxyXG4gICdeL3Nob3AtY2F0ZWdvcmllcygvfCQpJyxcclxuICAnXi9wcm9kdWN0LWZhbWlseSgvfCQpJyxcclxuICAnXi9jYXJ0KC98JCknLFxyXG4gICdeL29yZGVycygvfCQpJyxcclxuICAnXi90cmFkZS1pbigvfCQpJyxcclxuICAnXi9uZXdzbGV0dGVyKC98JCknLFxyXG4gICdeL2NvbnRhY3QoL3wkKScsXHJcbiAgJ14vYW5hbHl0aWNzLWV2ZW50cygvfCQpJyxcclxuICAnXi9zdHJpcGUoL3wkKScsXHJcbiAgJ14vY2hlY2tvdXQtY3VzdG9tZXIoL3wkKScsXHJcbiAgJ14vYWRkLXJ1bi1mb3JtLXN1Ym1pdCgvfCQpJyxcclxuICAnXi90aGlzLW1vbnRoLXNvbGQtaXRlbXMoL3wkKScsXHJcbl07XHJcblxyXG5jb25zdCBwcm94eSA9IE9iamVjdC5mcm9tRW50cmllcyhcclxuICBiYWNrZW5kUm91dGVzLm1hcCgocm91dGUpID0+IFtcclxuICAgIHJvdXRlLFxyXG4gICAge1xyXG4gICAgICB0YXJnZXQ6IGJhY2tlbmRUYXJnZXQsXHJcbiAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgIH0sXHJcbiAgXSlcclxuKTtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcHJveHksXHJcbiAgfSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErVixTQUFTLG9CQUFvQjtBQUM1WCxPQUFPLFdBQVc7QUFFbEIsSUFBTSxnQkFBZ0IsUUFBUSxJQUFJLGdCQUFnQjtBQUNsRCxJQUFNLGdCQUFnQjtBQUFBLEVBQ3BCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGO0FBRUEsSUFBTSxRQUFRLE9BQU87QUFBQSxFQUNuQixjQUFjLElBQUksQ0FBQyxVQUFVO0FBQUEsSUFDM0I7QUFBQSxJQUNBO0FBQUEsTUFDRSxRQUFRO0FBQUEsTUFDUixjQUFjO0FBQUEsSUFDaEI7QUFBQSxFQUNGLENBQUM7QUFDSDtBQUdBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
