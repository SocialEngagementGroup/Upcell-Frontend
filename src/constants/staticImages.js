import { cloudinaryUrl } from '../utilities/cloudinary';

// Site-chrome images, served from Cloudinary.
//
// These are Cloudinary public_ids, not paths. They were uploaded by
// Backend/scripts/migrate-images-to-cloudinary.js and the ids are derived
// from the original filenames, so the mapping back to
// Frontend/public/staticImages is readable at a glance.
//
// Referencing them by name rather than by raw id means a re-upload (which
// changes the trailing hash) is a one-line edit here instead of a hunt
// through ten components.
//
// The favicon deliberately stays local: it is referenced from index.html
// before any JS runs, and browsers request it on a separate, early path.
export const STATIC_IMAGES = {
    LOGO: 'upcell/static/upcelllogo--481aca76',
    LOGO_LIGHT: 'upcell/static/upcelllogolight--76be9a63',
    LOGO_FOOTER: 'upcell/static/upcelllogofooter--5a0d0c36',

    HERO_IPHONE_15: 'upcell/static/hero-iphone15--fe7042d7',
    ABOUT_US_BG: 'upcell/static/bgaboutus--c6438d14',
    NOT_AVAILABLE: 'upcell/static/notavailable--033d77a8',

    CATEGORY_IPHONE: 'upcell/static/category-iphone--bd89b1fb',
    CATEGORY_IPAD: 'upcell/static/category-ipad--d0e0352a',
    CATEGORY_MACBOOK: 'upcell/static/category-macbook--c365e244',

    BLOG_APPLE_PURCHASE: 'upcell/static/apple-purchase-smarter--4c8c6d40',
    BLOG_CREATIVE_WORK: 'upcell/static/creative-work-hardware--47b04d42',
    BLOG_BATTERY_HEALTH: 'upcell/static/battery-health-guide--12d12ac5',
    BLOG_TRADE_IN_TIMING: 'upcell/static/trade-in-timing--5641bdbd',
};

// Widths are roughly 2x the largest rendered size, so retina screens stay
// sharp without every device downloading the 1MB original. f_auto and q_auto
// are applied by cloudinaryUrl.
export const staticImageUrl = (publicId, width) => cloudinaryUrl(publicId, { width });
