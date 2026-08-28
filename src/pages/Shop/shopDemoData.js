// DEMO DATA — none of this is real inventory, and none of it is a real offer.
//
// It exists so the shop page can be designed and reviewed while the catalogue
// API is unavailable and before the business logic behind these sections is
// decided. Same arrangement as src/components/Recommended/demoProducts.js:
// real data always wins, and every rail below falls back to this only when the
// catalogue returns nothing for it.
//
// Two things here need a decision before this page is shown to real visitors:
//
//   1. UpCell stocks Apple only. The Samsung and Android rails, and the
//      non-Apple brands in the brand panel, describe products the shop does
//      not sell. Either those lines get stocked, or those sections go.
//
//   2. AUDIENCE_CHIPS contains discounts — a student discount and a military
//      discount — that UpCell does not currently run. Advertising a discount
//      that does not exist is a straightforward misrepresentation, so these
//      must be replaced with real offers or removed.
//
// To retire: delete this file and the fallbacks in ShopPage.jsx that reference
// it. Nothing else imports it.

import { STATIC_IMAGES, staticImageUrl } from '../../constants/staticImages';
import { MODEL_GROUP_IMAGES } from '../../components/layout/Header/navigationData';

// Non-Apple demo cards have no photography — UpCell has never stocked these
// devices, so there is nothing in the image manifest for them. The catalogue's
// own "not available" placeholder is used rather than dressing a Samsung card
// with an iPhone photograph.
const PLACEHOLDER_IMAGE = STATIC_IMAGES.NOT_AVAILABLE;

const GRADES = ['Excellent', 'Good', 'Fair'];
const COLORS = ['Midnight', 'Blue', 'Silver', 'Starlight', 'Black'];
const STORAGES = ['128GB', '256GB', '512GB', '1TB'];

// Builds one demo card. The numbers are arithmetic on the index, not guesses
// at real prices — they only need to be plausible and stable between renders.
const demoProduct = (id, productName, image, index) => {
    const price = 189 + ((index * 149) % 900);

    return {
        _id: `demo-${id}`,
        parentCatagory: `demo-${id}`,
        productName,
        image,
        grade: GRADES[index % GRADES.length],
        storage: STORAGES[index % STORAGES.length],
        color: { name: COLORS[index % COLORS.length] },
        price,
        originalPrice: Math.round(price * 1.45),
        reviewScore: Number((4 + ((index % 9) / 10)).toFixed(1)),
        peopleReviewed: 380 + index * 214,
        outOfStock: false,
        // Demo cards must not pretend to lead to a product page that does not
        // exist, so every one points back at the shop.
        linkTo: '/shop',
    };
};

const build = (names, image) => names.map((name, index) => demoProduct(
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    typeof image === 'function' ? image(name, index) : image,
    index,
));

const APPLE_ART = [
    MODEL_GROUP_IMAGES['iPhone'],
    MODEL_GROUP_IMAGES['iPhone Pro'],
    MODEL_GROUP_IMAGES['iPhone Plus'],
    MODEL_GROUP_IMAGES['iPhone Pro Max'],
];

export const DEMO_IPHONES = build([
    'iPhone 15 · Unlocked',
    'iPhone 15 Pro · Unlocked',
    'iPhone 14 · Unlocked',
    'iPhone 14 Plus · Unlocked',
    'iPhone 13 · Unlocked',
    'iPhone 16 Pro Max · Unlocked',
    'iPhone 12 · Unlocked',
    'iPhone SE · Unlocked',
], (_name, index) => APPLE_ART[index % APPLE_ART.length]);

export const DEMO_SAMSUNG = build([
    'Galaxy S24 · Unlocked',
    'Galaxy S23 Ultra · Unlocked',
    'Galaxy S23 · Unlocked',
    'Galaxy S22 · Unlocked',
    'Galaxy S21 · Unlocked',
    'Galaxy Z Flip 5 · Unlocked',
], PLACEHOLDER_IMAGE);

export const DEMO_GOOGLE = build([
    'Google Pixel 9 · Unlocked',
    'Google Pixel 9 Pro · Unlocked',
    'Google Pixel 8 · Unlocked',
    'Google Pixel 8a · Unlocked',
    'Google Pixel 7 · Unlocked',
], PLACEHOLDER_IMAGE);

export const DEMO_ONEPLUS = build([
    'OnePlus 12 · Unlocked',
    'OnePlus 11 · Unlocked',
    'OnePlus Nord 3 · Unlocked',
    'OnePlus 10 Pro · Unlocked',
], PLACEHOLDER_IMAGE);

export const DEMO_MOTOROLA = build([
    'Motorola Edge 50 · Unlocked',
    'Motorola Moto G 5G · Unlocked',
    'Motorola Razr 40 · Unlocked',
    'Motorola Moto G Power · Unlocked',
], PLACEHOLDER_IMAGE);

// The Android rail is the three non-Samsung brands together, which is how the
// reference groups them.
export const DEMO_ANDROID = [...DEMO_GOOGLE, ...DEMO_MOTOROLA, ...DEMO_ONEPLUS];

// Deals demo set. Every entry has originalPrice above price, so the rail has
// something to show before the catalogue is answering.
export const DEMO_DEALS = build([
    'iPhone 14 · Unlocked',
    'iPhone 13 · Unlocked',
    'iPhone 15 · Unlocked',
    'iPhone 12 · Unlocked',
    'iPhone 15 Plus · Unlocked',
    'iPhone 16 Pro Max · Unlocked',
], (_name, index) => APPLE_ART[index % APPLE_ART.length]);

// "Make the most of your device" — the reference runs a second journal rail
// here, with different posts from the one higher up the page.
//
// UpCell's journal has four posts in total, and they are all used by "The more
// you know". Rather than repeat the same four cards twice on one page, this
// rail is demo entries. They must be replaced with real articles — each one
// links to /blogs rather than to an article route that does not exist, so
// nothing here 404s in the meantime.
//
// `image` is a resolved delivery URL, matching what blogData exports, because
// BlogRail renders the field directly.
export const DEMO_GUIDES = [
    {
        slug: 'demo-storage-guide',
        title: 'How much storage do you actually need?',
        date: 'Draft — placeholder',
        image: staticImageUrl(STATIC_IMAGES.CATEGORY_IPHONE, 600),
        linkTo: '/blogs',
    },
    {
        slug: 'demo-ipad-or-macbook',
        title: 'iPad or MacBook: which one replaces your laptop?',
        date: 'Draft — placeholder',
        image: staticImageUrl(STATIC_IMAGES.CATEGORY_IPAD, 600),
        linkTo: '/blogs',
    },
    {
        slug: 'demo-first-week',
        title: 'Setting up a pre-owned Mac in its first week',
        date: 'Draft — placeholder',
        image: staticImageUrl(STATIC_IMAGES.CATEGORY_MACBOOK, 600),
        linkTo: '/blogs',
    },
    {
        slug: 'demo-grades-explained',
        title: 'What the condition grades actually look like',
        date: 'Draft — placeholder',
        image: staticImageUrl(STATIC_IMAGES.BLOG_APPLE_PURCHASE, 600),
        linkTo: '/blogs',
    },
    {
        slug: 'demo-battery-life',
        title: 'What battery health really means day to day',
        date: 'Draft — placeholder',
        image: staticImageUrl(STATIC_IMAGES.BLOG_BATTERY_HEALTH, 600),
        linkTo: '/blogs',
    },
    {
        slug: 'demo-trade-in-timing',
        title: 'The best moment to trade your device in',
        date: 'Draft — placeholder',
        image: staticImageUrl(STATIC_IMAGES.BLOG_TRADE_IN_TIMING, 600),
        linkTo: '/blogs',
    },
];

// "Your phone, your call" — the reference's audience chips.
//
// See the note at the top of this file: the two discount chips are not offers
// UpCell runs. They are here so the section can be designed, and they must not
// ship as written.
export const AUDIENCE_CHIPS = [
    { label: 'Phone for kids 🤹', to: '/shop' },
    { label: 'Phone for gamers 🎮', to: '/shop' },
    { label: '$20 off for students 👩‍🎓', to: '/shop' },
    { label: '10% off military discount 👏', to: '/shop' },
    { label: 'Shop good deals 💰', to: '/shop#deals' },
];

// "Top brands, refurbished". The tiles select which brand the panel's rail
// shows, which is what the reference's row does.
//
// Only Apple has a real mark available — MUI ships an Apple glyph. The other
// four are other companies' trademarks and no licensed asset for them exists in
// this repo, so those tiles carry the brand's name set as a wordmark. Dropping
// a real SVG in later is a per-tile change and nothing else moves.
export const BRANDS = [
    { id: 'apple', label: 'Apple', stocked: true },
    { id: 'samsung', label: 'Samsung', stocked: false },
    { id: 'google', label: 'Google', stocked: false },
    { id: 'oneplus', label: 'OnePlus', stocked: false },
    { id: 'motorola', label: 'Motorola', stocked: false },
];
