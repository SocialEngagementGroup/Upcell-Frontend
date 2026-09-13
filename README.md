# UpCell — Frontend

The shop at upcellit.com, and the admin panel behind it.

**Read [`../PIPELINE.md`](../PIPELINE.md) too.** This file says how the app is
put together; PIPELINE.md says what is not finished.

---

## The shape of it

- **React 18** + **Vite 4**, **React Router 6**, **Tailwind**
- **React Query v5** for every server read. There is no Redux and no global
  store: server state lives in the query cache and UI state lives in the
  component that owns it
- **Clerk** for auth, **MUI icons** for iconography, **sonner** for toasts
- **1 context**, `UserContextProvider`, plus a cart context in `App.jsx`
- **44 unit tests** (`npm test`, Vitest) and **one Playwright smoke test**
  (`npm run test:e2e`)

**Not Bootstrap, not styled-components, not react-toastify** — the earlier
README listed all three and none is used.

---

## Environment

| Variable | Required | What it does |
|---|---|---|
| `VITE_API_URL` | yes | The API base. Must end in a slash |
| `VITE_CLERK_PUBLISHABLE_KEY` | yes | Without it the app renders a "missing key" page, which passes a build and ships a dead site |
| `VITE_CLOUDINARY_CLOUD_NAME` | for uploads | Admin image upload |
| `VITE_GTM_ID` | no | Google Tag Manager. **Absent means no analytics at all** — the container is not loaded rather than loaded and idle |
| `VITE_SHOW_CARD_BRANDS` | no | Exactly `"true"` shows the card-network logos at checkout. Off until Bank of America confirms which networks the merchant agreement covers — see D13 in PIPELINE.md |
| `E2E_BASE_URL` | no | A deployed URL for the Playwright smoke test. Unset, the test skips |

`.env` for local work, Vercel project settings for deployed.

---

## Layout

```
src/
  main.jsx            Every route, and the provider nesting
  App.jsx            The shell, and the cart
  pages/             One folder per area (see below)
  components/        Shared UI. Admin*, Reviews/, Seo/, layout/
  queries/           React Query hooks, one file per area. keys.js holds every cache key
  utilities/         axiosInstance, auth, formValidation, gtm, downloadCsv, useCartSync
  constants/         deviceGrades, orderStatus, cardBrands
tests-e2e/           The Playwright smoke test
```

### Pages

| Folder | Covers |
|---|---|
| `Home` | Landing |
| `Shop` | Catalogue, filters, search |
| `ProductDetail` | A product page, its accessories, and its reviews |
| `Cart` / `Checkout` / `ThankYou` | Buying, through the bank's hosted page |
| `MyAccount` | Orders, returns, trade-ins, reviews to write |
| `OrderLookup` | A guest's order, and recovering the link to it |
| `Returns` | Answering a revised refund offer |
| `TradeIn` | The quote flow, and answering a revised trade-in offer |
| `Wholesale` / `Legal` / `Auxiliary` | Enquiries, policies, support |
| `Auth` | Clerk sign-in and sign-up |
| `Admin` | The whole panel — 20 screens under `/admin-secret` |

### Queries

Every server read goes through a hook in `src/queries/`. Two rules:

1. **Cache keys live in `keys.js`, never inline.** Two files inventing the same
   key differently is two caches that never invalidate each other — a real bug
   here was a price change that never reached the customer-facing page because
   an invalidation named `['tradeInCatalog']` and the query used
   `['tradeIn', 'catalog']`.
2. **A mutation invalidates every list a record can move between,** not the one
   it came from. A return that moves status leaves both tabs stale.

---

## Things worth knowing before changing anything

**The cart is a flat array of id strings, and duplicates mean quantity.**
`CartProduct.jsx` removes a line *by its position*, because the same case can
sit under two different devices and only one of them is being removed. Sorting
or deduplicating the cart array removes the wrong thing.

**A signed-in customer's cart is also on the server** (`useCartSync`). The merge
on sign-in puts the local cart first and appends only ids it has never seen, so
signing in can add to a cart and can never multiply it.

**Every money figure comes from the server.** The page displays `*Cents`
fields; it does not compute totals. The receipt page used to add tax twice
because it re-derived the shipping line, and it was wrong on 18 of 18 orders.

**`font-extrabold` and `font-black` do not exist.** Roboto is loaded at 400,
500 and 700 only, so both render as faked bold. Use `font-bold`. The brand
guideline is in the `upcell-brand` skill; the palette is locked.

**Console logging is stripped from production builds** (`esbuild.drop` in
`vite.config.js`). Most `console.log(error)` calls in this codebase print the
API's own error payload, which is not for customers. The lines still work in
`vite dev`.

**Some API paths collide with page paths.** `/cart` is both a POST endpoint and
a React route. The dev proxy tells them apart by `Accept: text/html` — see the
comment in `vite.config.js` before touching the proxy list.

**A download from a protected endpoint cannot be a plain link.** A link
navigation sends no `Authorization` header, so it answers 401 and bounces to
login. Use `utilities/downloadCsv.js`.

---

## Running it

```bash
npm install
npm run dev              # Vite, proxying the API to localhost:5001
npm test                 # Vitest, 44 tests
npm run build            # the real gate — see below
npm run test:e2e         # Playwright, needs E2E_BASE_URL
```

**`npm run build` is the gate, not `npm test`.** There are 44 unit tests and no
component tests, so a broken import or a missing export is caught by Vite
rather than by Vitest. CI runs both, in that order, because a failing build
makes a test result meaningless.

A passing build is not proof a UI change works. Load the page and look at it.

---

## The smoke test

One Playwright test walks the only path on this site that makes money: home,
shop, a product, add to cart, checkout — signed out the whole way, because
requiring an account to buy a phone was the biggest thing between a visitor and
a sale.

It stops at the checkout page. The next click is Bank of America's hosted
payment page, and a test that presses it puts fake authorisations through a real
merchant account.

It runs against a **deployed** URL rather than a local server, because every
part of that path needs real products, real images and real Clerk. Set the
`E2E_BASE_URL` repository variable in GitHub to turn the CI job on; without it
the test skips rather than failing.
