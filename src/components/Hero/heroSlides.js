import { STATIC_IMAGES } from '../../constants/staticImages';

// Slide content for the hero carousel.
//
// Each slide is a coloured band with the product cut out beside the copy —
// not a flat banner photograph. That keeps the artwork reusable: one cutout
// serves every slide, the band carries the mood, and nothing has to be
// re-shot when the copy changes.
//
// All three currently share the iPhone lineup shot. Give a slide its own
// `image` when there is art for it; nothing else needs to change.
//
// Every `to` is a route that exists. Nothing here is a placeholder link.
export const HERO_SLIDES = [
    {
        id: 'iphone',
        eyebrow: 'iPhone',
        title: 'Your next iPhone.',
        emphasis: 'Certified, not new.',
        copy: 'Every device inspected, graded, and backed by a 12-month warranty.',
        cta: { label: 'Shop iPhone', to: '/shop?category=iPhone' },
        image: STATIC_IMAGES.HERO_IPHONE_15,
        theme: 'light',
    },
    {
        id: 'trade-in',
        eyebrow: 'Trade-in',
        title: 'Trade it in.',
        emphasis: 'Trade up.',
        copy: 'Get a quote in minutes and put it straight towards your next device.',
        cta: { label: 'Get a quote', to: '/trade-in' },
        image: STATIC_IMAGES.HERO_IPHONE_15,
        theme: 'red',
    },
    {
        id: 'promise',
        eyebrow: 'The UpCellIT Promise',
        title: 'Inspected. Graded.',
        emphasis: 'Guaranteed.',
        copy: 'Save up to 40% against new, without gambling on condition.',
        cta: { label: 'How it works', to: '/about' },
        image: STATIC_IMAGES.HERO_IPHONE_15,
        theme: 'ink',
    },
];

// Bands and their matching type/CTA colours. All from the locked palette — no
// new tokens, and each pair chosen for contrast: near-black on the pale grey,
// white on brand red and on near-black.
export const HERO_THEMES = {
    light: {
        band: 'bg-apple-bg',
        eyebrow: 'text-apple-gray',
        title: 'text-apple-text',
        copy: 'text-ink-soft',
        cta: 'bg-apple-text text-white hover:bg-black',
    },
    red: {
        band: 'bg-brand-red',
        eyebrow: 'text-white/75',
        title: 'text-white',
        copy: 'text-white/85',
        cta: 'bg-white text-brand-red hover:bg-white/90',
    },
    ink: {
        band: 'bg-apple-text',
        eyebrow: 'text-white/70',
        title: 'text-white',
        copy: 'text-white/80',
        cta: 'bg-white text-apple-text hover:bg-white/90',
    },
};

export const HERO_INTERVAL = 6000;
