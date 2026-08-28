// Content for the mobile home page.
//
// The layout follows the reference screenshots. The words and the numbers do
// not: those screenshots are another retailer's, and their terms are not
// UpCell's. Specifically —
//
//   "36 Months Installments"  → UpCell publishes no instalment plan.
//   "2 Years Replacement"     → UpCell's warranty is 12 months.
//
// Both are replaced below with terms UpCell actually publishes, which keeps
// the four-tile shape the design needs without promising something the
// business does not offer.
//
// Anything still standing in for real content is marked `demo: true` and
// listed at the bottom of this comment so it is easy to find later:
//
//   * PROMO_CARDS — two campaign slots. UpCell runs no campaign right now, so
//     these point at real pages (/shop, /trade-in) rather than a landing page
//     that does not exist.
//   * CATEGORIES — the tiles beyond iPhone / iPad / MacBook. UpCell sells
//     Apple only; the reference's Android, Laptop, AirPods and Gaming console
//     tiles have no catalogue behind them.

import { STATIC_IMAGES } from '../../../constants/staticImages';
import { MODEL_GROUP_IMAGES, shopFamilyPath } from '../../../components/layout/Header/navigationData';

// The banner across the top. One image, one line, one destination.
export const HERO_BANNER = {
    eyebrow: 'Certified Premium',
    title: 'Just as impressive as the new one',
    copy: 'iPhone, iPad and MacBook — inspected, graded, and backed by a 12-month warranty.',
    cta: { label: 'Shop all devices', to: '/shop' },
    image: STATIC_IMAGES.HERO_IPHONE_15,
};

// The two cards under the banner. Both destinations are real pages.
export const PROMO_CARDS = [
    {
        id: 'deals',
        title: 'Price drops',
        copy: 'Our biggest savings right now',
        to: '/shop',
        image: STATIC_IMAGES.CATEGORY_MACBOOK,
        demo: true,
    },
    {
        id: 'trade-in',
        title: 'Trade in',
        copy: 'Turn your old device into credit',
        to: '/trade-in',
        image: STATIC_IMAGES.CATEGORY_IPAD,
        demo: true,
    },
];

// The four-up strip. Every line here is a term UpCell publishes — see the note
// at the top of this file for what was replaced and why.
export const FEATURES = [
    { id: 'genuine', icon: 'verified', label: '100% genuine Apple' },
    { id: 'inspection', icon: 'inspection', label: '40-point inspection' },
    { id: 'warranty', icon: 'warranty', label: '12-month warranty' },
    { id: 'returns', icon: 'returns', label: '30-day returns' },
];

// "Shop by category". The first three are real families with a real catalogue
// behind them; the rest are the reference's tiles, which UpCell does not stock.
export const CATEGORIES = [
    {
        id: 'iphone',
        label: 'iPhone',
        to: shopFamilyPath('iPhone'),
        image: MODEL_GROUP_IMAGES['iPhone'],
    },
    {
        id: 'ipad',
        label: 'iPad',
        to: shopFamilyPath('iPad'),
        image: MODEL_GROUP_IMAGES['iPad'],
    },
    {
        id: 'macbook',
        label: 'MacBook',
        to: shopFamilyPath('MacBook'),
        image: MODEL_GROUP_IMAGES['MacBook Air'],
    },
    {
        id: 'ipad-pro',
        label: 'iPad Pro',
        to: shopFamilyPath('iPad'),
        image: MODEL_GROUP_IMAGES['iPad Pro'],
    },
    {
        id: 'iphone-pro',
        label: 'iPhone Pro',
        to: shopFamilyPath('iPhone'),
        image: MODEL_GROUP_IMAGES['iPhone Pro'],
    },
    {
        id: 'macbook-pro',
        label: 'MacBook Pro',
        to: shopFamilyPath('MacBook'),
        image: MODEL_GROUP_IMAGES['MacBook Pro'],
    },
    {
        id: 'airpods',
        label: 'AirPods',
        to: '/shop?q=AirPods',
        image: STATIC_IMAGES.NOT_AVAILABLE,
        demo: true,
    },
    {
        id: 'accessories',
        label: 'Accessories',
        to: '/shop?q=charger',
        image: STATIC_IMAGES.NOT_AVAILABLE,
        demo: true,
    },
];

// The bar that rises from the bottom of the screen on scroll.
//
// The reference's five tabs are Offer, Cart, Profile, Pre-order and Location.
// Four map onto pages UpCell has. There is no pre-order flow, so that slot
// carries the trade-in instead — a real destination doing a comparable job,
// rather than a tab that leads nowhere.
export const BOTTOM_NAV = [
    { id: 'offer', label: 'Offers', icon: 'offer', to: '/promotions' },
    { id: 'cart', label: 'Cart', icon: 'cart', to: '/cart' },
    { id: 'home', label: 'Home', icon: 'home', to: '/' },
    { id: 'trade-in', label: 'Trade in', icon: 'tradein', to: '/trade-in' },
    { id: 'account', label: 'Account', icon: 'account', to: '/myaccount' },
];
