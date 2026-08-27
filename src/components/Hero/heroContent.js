import { STATIC_IMAGES } from '../../constants/staticImages';

// The single home banner. Static — no carousel, no autoplay, no dots.
//
// A coloured band with the product cut out beside the copy. `band` is the
// pale grey from the locked palette rather than the reference's lime: the
// arrangement is the same, the colour is UpCell's.
export const HERO = {
    title: 'Premium Apple.',
    emphasis: 'Sensible money.',
    copy: 'Every device inspected, graded, and backed by a 12-month warranty.',
    cta: { label: 'Shop now', to: '/shop' },
    image: STATIC_IMAGES.HERO_IPHONE_15,
};
