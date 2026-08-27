// Single source of truth for everything the header links to or labels.
//
// Nothing in the header JSX hardcodes a path, a label or a panel: changing the
// nav means editing this file only. Every `to` here must resolve against the
// routes declared in src/main.jsx — there is no /search, /deals, /help,
// /wishlist, /orders or /contact, and product categories are query params on
// /shop rather than routes of their own.

// ---------------------------------------------------------------------------
// Path builders
// ---------------------------------------------------------------------------

export const shopFamilyPath = (family) => `/shop?category=${encodeURIComponent(family)}`;

export const shopModelPath = (family, modelGroup) => (
    `${shopFamilyPath(family)}&model=${encodeURIComponent(modelGroup)}`
);

export const shopSearchPath = (term) => `/shop?q=${encodeURIComponent(term)}`;

// ---------------------------------------------------------------------------
// Model groups
//
// These strings are matched against `categoryName` on the product documents by
// ShopPage's `?model=` filter, so they must stay byte-identical to ShopPage's
// `modelGroupOrder`. Renaming one here without renaming it there silently
// produces a filter that matches nothing.
// ---------------------------------------------------------------------------

export const MODEL_GROUPS_BY_FAMILY = {
    iPhone: ['iPhone', 'iPhone Plus', 'iPhone Pro', 'iPhone Pro Max'],
    iPad: ['iPad', 'iPad mini', 'iPad Air', 'iPad Pro'],
    MacBook: ['MacBook Air', 'MacBook Pro'],
};

// One line of copy per tile. UpCell has no per-model artwork, so the tiles are
// type-only and this line is what gives them their weight.
const MODEL_GROUP_BLURBS = {
    'iPhone': 'The standard model, at the standard size.',
    'iPhone Plus': 'A bigger screen and a bigger battery.',
    'iPhone Pro': 'Pro cameras in the compact body.',
    'iPhone Pro Max': 'The largest screen Apple builds.',
    'iPad': 'The everyday tablet.',
    'iPad mini': 'Full iPad, one hand.',
    'iPad Air': 'Thin and light, with real speed.',
    'iPad Pro': 'The one that replaces a laptop.',
    'MacBook Air': 'Silent, light, all-day battery.',
    'MacBook Pro': 'Built for the heavy work.',
};

// ---------------------------------------------------------------------------
// Utility row (row 1)
// ---------------------------------------------------------------------------

export const UTILITY_LINKS = [
    { label: 'About', to: '/about' },
    { label: 'Blogs', to: '/blogs' },
    { label: 'Support', to: '/support' },
    { label: 'Return Policy', to: '/return-policy' },
];

// ---------------------------------------------------------------------------
// Mega menu asides ("Good to know")
// ---------------------------------------------------------------------------

const GOOD_TO_KNOW = [
    {
        title: 'Trade in your old device',
        copy: 'Get a quote in minutes and put it towards this one.',
        to: '/trade-in',
    },
    {
        title: 'Delivery',
        copy: 'How and when your order reaches you.',
        to: '/delivery-policy',
    },
    {
        title: 'Returns and warranty',
        copy: 'What is covered, and how to send something back.',
        to: '/return-policy',
    },
];

const buildPanel = (family) => ({
    id: `header-panel-${family.toLowerCase()}`,
    heading: `Shop ${family}`,
    seeAll: { label: `See all ${family}`, to: shopFamilyPath(family) },
    tiles: MODEL_GROUPS_BY_FAMILY[family].map((modelGroup) => ({
        label: modelGroup,
        copy: MODEL_GROUP_BLURBS[modelGroup] || '',
        to: shopModelPath(family, modelGroup),
    })),
    aside: {
        heading: 'Good to know',
        items: GOOD_TO_KNOW,
    },
});

// ---------------------------------------------------------------------------
// Category row (row 3) — "Shop all" plus one mega-panel trigger per family
// ---------------------------------------------------------------------------

export const CATEGORY_NAV = [
    { id: 'shop-all', label: 'Shop all', to: '/shop' },
    { id: 'iphone', label: 'iPhone', family: 'iPhone', to: shopFamilyPath('iPhone'), panel: buildPanel('iPhone') },
    { id: 'ipad', label: 'iPad', family: 'iPad', to: shopFamilyPath('iPad'), panel: buildPanel('iPad') },
    { id: 'macbook', label: 'MacBook', family: 'MacBook', to: shopFamilyPath('MacBook'), panel: buildPanel('MacBook') },
];

// ---------------------------------------------------------------------------
// Mobile drawer
// ---------------------------------------------------------------------------

export const DRAWER_PRIMARY_LINKS = [
    { label: 'Shop', to: '/shop' },
    { label: 'Trade in', to: '/trade-in' },
];

export const DRAWER_FAMILIES = Object.keys(MODEL_GROUPS_BY_FAMILY).map((family) => ({
    id: `drawer-${family.toLowerCase()}`,
    family,
    seeAllTo: shopFamilyPath(family),
    items: MODEL_GROUPS_BY_FAMILY[family].map((modelGroup) => ({
        label: modelGroup,
        to: shopModelPath(family, modelGroup),
    })),
}));

// ---------------------------------------------------------------------------
// Account menu
// ---------------------------------------------------------------------------

export const ACCOUNT_LINKS_SIGNED_IN = [
    { label: 'My account', to: '/myaccount' },
];

export const ADMIN_LINK = { label: 'Admin dashboard', to: '/admin-secret' };

export const SIGN_IN_LINK = { label: 'Sign in', to: '/login' };

export const TRADE_IN_LINK = { label: 'Trade in', to: '/trade-in' };

// Text links sitting between the trade-in pill and the icons, mirroring the
// reference. Hidden below md — on a phone they live in the drawer instead.
//
// "For business" points at the contact page because UpCell has no separate
// B2B site: wholesale enquiries come in through that form (see the Wholesale
// inquiries clause in PrivacyPolicy.jsx and the admin Wholesale inbox). It
// therefore shares a destination with "Need help?" until a wholesale page
// exists — change the `to` here the day one does.
export const MAIN_ROW_LINKS = [
    { label: 'Need help?', to: '/support' },
    { label: 'For business', to: '/support' },
];

// ---------------------------------------------------------------------------
// Logo geometry
//
// STATIC_IMAGES.LOGO is a 3442x1173 PNG whose artwork occupies a 2157x469 box
// dead-centre — verified against Cloudinary's own trim (`e_trim` reports
// 2157x469, and a centred `c_crop` at that size reproduces it pixel for pixel).
// The rest is transparent padding: ~642px each side, ~352px top and bottom.
//
// src/utilities/cloudinary.js only emits f/q/w/h/c, so there is no way to ask
// Cloudinary for the trimmed asset through the supported helper. Instead the
// padding is cancelled geometrically, in this one place: a box with the
// artwork's aspect ratio, clipping an image blown up by `overscan` and centred
// inside it. Because it is expressed as ratios rather than pixels it holds at
// every bar height, unlike the old `-ml-[49px] h-[90px]` hack which was tuned
// for one.
// ---------------------------------------------------------------------------

export const LOGO_METRICS = {
    aspectRatio: 2157 / 469,   // artwork box, ~4.599:1
    overscan: 3442 / 2157,     // full PNG width / artwork width, ~1.596
};
