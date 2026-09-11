import { test, expect } from '@playwright/test';

// The one path on this site that makes money: home, shop, a product, add to
// cart, checkout. It stops at the checkout page. The next click after that is
// Bank of America's hosted payment page, and a test that presses it is a test
// that puts fake authorisations through a real merchant account.
//
// Skipped rather than failed when E2E_BASE_URL is unset, so a laptop with no
// preview deployment stays quiet. CI sets it or does not run this file.

const BASE = process.env.E2E_BASE_URL;

test.skip(!BASE, 'E2E_BASE_URL is not set — point it at a Vercel preview to run this.');

// Signed out, all the way through. Requiring an account to buy a phone was the
// biggest thing between a visitor and a sale, so the guest path is the one
// that has to keep working.
test.use({ storageState: { cookies: [], origins: [] } });

test('a guest can get from the home page to checkout', async ({ page }) => {
    // Attached before the first navigation, not after. A listener added at the
    // end of the walk has nothing left to hear, which is an assertion that can
    // only pass.
    const crashes = [];
    page.on('pageerror', (error) => crashes.push(error.message));

    await page.goto('/');
    await expect(page).toHaveTitle(/upcell/i);

    await page.goto('/shop');

    // Wait for a real card rather than for a spinner to go: an empty shop and
    // a slow shop look the same for a second, and only one is a failure.
    const firstProduct = page.locator('a[href^="/product/"]').first();
    await expect(firstProduct).toBeVisible({ timeout: 30_000 });

    const href = await firstProduct.getAttribute('href');
    expect(href).toBeTruthy();

    await firstProduct.click();
    await expect(page).toHaveURL(/\/product\//);

    // Every catalogue row is one physical device, so this button reads "Out of
    // stock" whenever that unit has sold. Skipped rather than failed: the site
    // is working, the shop's first card just is not buyable today.
    const soldOut = page.getByRole('button', { name: /out of stock/i });
    if (await soldOut.count()) {
        test.skip(true, `The first product in the shop has sold: ${href}`);
    }

    const addToCart = page.getByRole('button', { name: /add to cart/i });
    await expect(addToCart).toBeVisible({ timeout: 15_000 });
    await addToCart.click();

    await page.goto('/cart');

    // The cart reads its ids back through the API, so reaching this proves the
    // round trip rather than only that localStorage was written.
    const toCheckout = page.getByRole('link', { name: /proceed to checkout/i }).first();
    await expect(toCheckout).toBeVisible({ timeout: 20_000 });
    await toCheckout.click();

    await expect(page).toHaveURL(/\/checkout\//);

    // The checkout page itself, drawn, with the fields a guest has to fill in.
    // Located by the field's name attribute rather than by a label: the labels
    // here are not wired to their inputs, and a test that silently matches
    // nothing is worse than one that is honest about what it can see.
    await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('input[name="name"]')).toBeVisible();

    // Nothing may have thrown anywhere along the way. A page that renders with
    // a broken component underneath it is the failure this test exists to
    // catch, and it does not show up in a screenshot.
    expect(crashes).toEqual([]);
});
