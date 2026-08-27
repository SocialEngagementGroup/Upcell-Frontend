import { STATIC_IMAGES } from '../../constants/staticImages';

// Slide content for the hero carousel.
//
// The reference runs full-bleed banner artwork commissioned per campaign.
// UpCell has no banner art — only square catalogue and category shots — so
// each slide is a coloured band with the product cut out beside the copy.
// `theme` picks that band from the locked brand palette; swap a slide's
// `image` for real banner art the day it exists and the layout still holds.
//
// Every `to` is a route that exists. Nothing here is a placeholder link.
export const HERO_SLIDES = [
    {
        id: 'iphone',
        eyebrow: 'iPhone',
        title: 'Your next iPhone.',
        emphasis: 'Certified, not new.',
        copy: 'Inspected, graded, and backed by a 12-month warranty.',
        cta: { label: 'Shop iPhone', to: '/shop?category=iPhone' },
        image: STATIC_IMAGES.HERO_IPHONE_15,
        theme: 'ink',
    },
    {
        id: 'trade-in',
        eyebrow: 'Trade-in',
        title: 'Trade it in.',
        emphasis: 'Trade up.',
        copy: 'Get a quote in minutes and put it straight towards your next device.',
        cta: { label: 'Get a quote', to: '/trade-in' },
        image: STATIC_IMAGES.BLOG_TRADE_IN_TIMING,
        theme: 'red',
    },
    {
        id: 'macbook',
        eyebrow: 'MacBook',
        title: 'Serious work.',
        emphasis: 'Sensible price.',
        copy: 'MacBook Air and Pro, professionally refurbished and ready to ship.',
        cta: { label: 'Shop MacBook', to: '/shop?category=MacBook' },
        image: STATIC_IMAGES.CATEGORY_MACBOOK,
        theme: 'light',
    },
    {
        id: 'ipad',
        eyebrow: 'iPad',
        title: 'Room to think.',
        emphasis: 'Less to spend.',
        copy: 'iPad, Air, mini and Pro — graded for condition, priced for sense.',
        cta: { label: 'Shop iPad', to: '/shop?category=iPad' },
        image: STATIC_IMAGES.CATEGORY_IPAD,
        theme: 'soft',
    },
];

// Bands and their matching type/CTA colours. All four come from the locked
// palette — no new tokens, and each pair is checked for contrast rather than
// assumed: white on brand red and on near-black, near-black on the two greys.
export const HERO_THEMES = {
    ink: {
        band: 'bg-apple-text',
        eyebrow: 'text-white/70',
        title: 'text-white',
        copy: 'text-white/80',
        cta: 'bg-white text-apple-text hover:bg-white/90',
        dot: 'bg-white',
    },
    red: {
        band: 'bg-brand-red',
        eyebrow: 'text-white/75',
        title: 'text-white',
        copy: 'text-white/85',
        cta: 'bg-white text-brand-red hover:bg-white/90',
        dot: 'bg-white',
    },
    light: {
        band: 'bg-apple-bg',
        eyebrow: 'text-apple-gray',
        title: 'text-apple-text',
        copy: 'text-ink-soft',
        cta: 'bg-apple-text text-white hover:bg-black',
        dot: 'bg-apple-text',
    },
    soft: {
        band: 'bg-surface',
        eyebrow: 'text-apple-gray',
        title: 'text-apple-text',
        copy: 'text-ink-soft',
        cta: 'bg-apple-text text-white hover:bg-black',
        dot: 'bg-apple-text',
    },
};

export const HERO_INTERVAL = 6000;
