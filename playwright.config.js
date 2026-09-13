import { defineConfig, devices } from '@playwright/test';

// One smoke test, run against a deployed site rather than a local build.
//
// The path it walks — home, shop, a product, add to cart, checkout — is the
// only path on this site that makes money, and every part of it depends on
// something Vite cannot serve: real products from the API, real images from
// Cloudinary, real Clerk. A local dev server would prove the bundle compiles,
// which `npm run build` already proves in a second.
//
// So there is no webServer here on purpose. E2E_BASE_URL points at a Vercel
// preview, and without it the run is skipped rather than failed — see
// tests-e2e/checkout.spec.js.

const baseURL = process.env.E2E_BASE_URL;

export default defineConfig({
    testDir: './tests-e2e',
    // A smoke test that needs a retry is telling you something. One retry on
    // CI only, for the genuine network flake; locally a failure should fail.
    retries: process.env.CI ? 1 : 0,
    // Serial. One test, and a shop where every row is a single physical device
    // is not a place to run parallel checkouts.
    workers: 1,
    reporter: process.env.CI ? 'list' : 'html',
    timeout: 60_000,
    expect: { timeout: 15_000 },
    use: {
        baseURL,
        // Kept only for a failure. A passing smoke test produces nothing worth
        // storing, and a video of every green run is how an artifacts bucket
        // fills up.
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'off',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
});
