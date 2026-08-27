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

// Mirrors the reference row, with each label pointed at the UpCell page that
// actually carries that content:
//   Promise      -> /about, which is where the warranty and grading story lives
//   Repair & Care-> /return-policy, returns plus warranty claims
//   End fast tech-> the longevity piece; UpCell has no campaign page, and this
//                   is the closest real content about keeping a device longer
//   Tech Journal -> the journal index
export const UTILITY_LINKS = [
    { label: 'The UpCellIT Promise', to: '/about', withShield: true },
    { label: 'Repair & Care', to: '/return-policy' },
    { label: 'End fast tech', to: '/blogs/battery-health-guide' },
    { label: 'Tech Journal', to: '/blogs' },
];

// ---------------------------------------------------------------------------
// Mega menu asides ("Good to know")
// ---------------------------------------------------------------------------

const GOOD_TO_KNOW = {
    tradeIn: {
        title: 'Trade in your old device',
        copy: 'Get a quote in minutes and put it towards this one.',
        to: '/trade-in',
    },
    delivery: {
        title: 'Delivery',
        copy: 'How and when your order reaches you.',
        to: '/delivery-policy',
    },
    returns: {
        title: 'Returns and warranty',
        copy: 'What is covered, and how to send something back.',
        to: '/return-policy',
    },
};

// The rail is not the same three notes on every panel — the reference varies
// it too. Trade-in leads everywhere, because it is the cross-sell that pays
// for the device being looked at. What sits under it is the question that
// family's buyers actually ask:
//   iPhone  — the flagship and by far the most-traded device, so it carries
//             the full set
//   iPad    — mid-ticket and usually a gift or a second screen, where the
//             question is when it turns up
//   MacBook — the largest single spend on the site, where the question is
//             what happens if it is wrong
const ASIDE_BY_FAMILY = {
    iPhone: ['tradeIn', 'delivery', 'returns'],
    iPad: ['tradeIn', 'delivery'],
    MacBook: ['tradeIn', 'returns'],
};

// One representative shot per model group, picked out of the generated
// product manifest — these are real catalogue images, not stock art, so the
// tiles show the actual device a shopper is about to filter to. Cloudinary
// public_ids; the URL is built at render time like every other image here.
export const MODEL_GROUP_IMAGES = {
    'iPhone': 'upcell/products/iphone/iphone-13-base-variant-blue-59d0ab89c7--fc480107',
    'iPhone Plus': 'upcell/products/iphone/iphone-14-plus-blue-e7f73732d8--b5ba7a6e',
    'iPhone Pro': 'upcell/products/iphone/iphone-14-pro-deep-purple-ab38596d4a--0dada363',
    'iPhone Pro Max': 'upcell/products/iphone/iphone-17-pro-max-cosmic-orange-05086f1--20d2d38a',
    'iPad': 'upcell/products/ipad/ipad-11th-gen-61ces1mvlhl-ac-sl1500-6af70e90d8--5d783728',
    'iPad mini': 'upcell/products/ipad/ipad-mini-7th-gen-blue-61qza-d1jcl-ac--3e09eb2b',
    'iPad Air': 'upcell/products/ipad/ipad-air-4th-gen-green-71z4o1tak-l-ac--64dc0e79',
    'iPad Pro': 'upcell/products/ipad/ipad-11th-gen-pro-11-13-m5-silver--922cfe75',
    'MacBook Air': 'upcell/products/macbook/macbook-air-13-m1-silver-2-55576b3889--cf41d438',
    'MacBook Pro': 'upcell/products/macbook/macbook-mackbook-pro-m2-13-14-silver-61zsd7--b804f339',
};

// A family with fewer model groups than the row holds would leave half the
// panel empty, so it is topped up with real catalogue variants. These filter
// by search text rather than by model group: chip generations are not among
// the ten groups the shop filters on, but `?q=` matches name, category and
// description (ShopPage.jsx), and `?category=` keeps the match inside the
// family. Images are deliberately different shots from the group tiles above
// so no two tiles in a panel show the same picture.
const FAMILY_EXTRA_TILES = {
    MacBook: [
        {
            label: 'M3 models',
            query: 'M3',
            image: 'upcell/products/macbook/macbook-mackbook-pro-m3-max-silver-61bgq7ysaml-ac--9714fe2f',
        },
        {
            label: 'M2 models',
            query: 'M2',
            image: 'upcell/products/macbook/macbook-air-13-m2-starlight-61brxr7sbul--1f9948bb',
        },
    ],
};

const buildPanel = (family) => ({
    id: `header-panel-${family.toLowerCase()}`,
    heading: 'Categories',
    seeAll: { label: 'See all', to: shopFamilyPath(family) },
    tiles: [
        ...MODEL_GROUPS_BY_FAMILY[family].map((modelGroup) => ({
            label: modelGroup,
            copy: MODEL_GROUP_BLURBS[modelGroup] || '',
            image: MODEL_GROUP_IMAGES[modelGroup] || '',
            to: shopModelPath(family, modelGroup),
        })),
        ...(FAMILY_EXTRA_TILES[family] || []).map((tile) => ({
            label: tile.label,
            copy: '',
            image: tile.image,
            to: `${shopFamilyPath(family)}&q=${encodeURIComponent(tile.query)}`,
        })),
    ],
    aside: {
        heading: 'Good to know',
        items: (ASIDE_BY_FAMILY[family] || ['tradeIn']).map((key) => GOOD_TO_KNOW[key]),
    },
});

// ---------------------------------------------------------------------------
// Category row (row 3) — "Shop all" plus one mega-panel trigger per family
// ---------------------------------------------------------------------------

// "Great deals" leads, accented and with its own mark, as in the reference —
// and it replaces "Shop all" rather than sitting beside it, since both would
// land on the same page. /shop is the honest destination: UpCell has no deals
// listing, and /promotions is the offer *terms*, not a set of products. Point
// this at a discount filter the day the shop grows one.
// The "More" panel: every model group that does not have its own entry in the
// row above, so nothing in the catalogue is more than two clicks away. Built
// from the same art map and the same ?model= filter as the family panels.
const MORE_MODEL_GROUPS = [
    ['iPhone', 'iPhone Plus'],
    ['iPhone', 'iPhone Pro Max'],
    ['iPad', 'iPad mini'],
    ['iPad', 'iPad Air'],
    ['iPad', 'iPad Pro'],
    ['MacBook', 'MacBook Pro'],
];

const MORE_PANEL = {
    id: 'header-panel-more',
    heading: 'More models',
    seeAll: { label: 'See all', to: '/shop' },
    tiles: MORE_MODEL_GROUPS.map(([family, modelGroup]) => ({
        label: modelGroup,
        copy: MODEL_GROUP_BLURBS[modelGroup] || '',
        image: MODEL_GROUP_IMAGES[modelGroup] || '',
        to: shopModelPath(family, modelGroup),
    })),
    aside: {
        heading: 'Good to know',
        items: [GOOD_TO_KNOW.tradeIn, GOOD_TO_KNOW.returns],
    },
};

// Eight entries, "More" last, as in the reference.
//
// UpCell sells three families, not the reference's ten, so entries 5 and 6 are
// the two best-selling model groups rather than invented categories — they use
// the same ?model= filter the mega-menu tiles do, and they resolve. Nothing
// here repeats a destination already in the utility row above.
export const CATEGORY_NAV = [
    { id: 'deals', label: 'Great deals', to: '/shop', accent: true },
    { id: 'iphone', label: 'iPhone', family: 'iPhone', to: shopFamilyPath('iPhone'), panel: buildPanel('iPhone') },
    { id: 'ipad', label: 'iPad', family: 'iPad', to: shopFamilyPath('iPad'), panel: buildPanel('iPad') },
    { id: 'macbook', label: 'MacBook', family: 'MacBook', to: shopFamilyPath('MacBook'), panel: buildPanel('MacBook') },
    { id: 'iphone-pro', label: 'iPhone Pro', to: shopModelPath('iPhone', 'iPhone Pro') },
    { id: 'macbook-air', label: 'MacBook Air', to: shopModelPath('MacBook', 'MacBook Air') },
    { id: 'trade-in', label: 'Trade in', to: '/trade-in' },
    // No `to`: an entry with a panel renders as a button, not a link, so a
    // path here would be dead data. Its panel's "See all" is the way out.
    { id: 'more', label: 'More', panel: MORE_PANEL },
];

// ---------------------------------------------------------------------------
// Mobile drawer
// ---------------------------------------------------------------------------

export const DRAWER_PRIMARY_LINKS = [
    { label: 'Shop', to: '/shop' },
    { label: '"Obsolete"', to: '/shop' },
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
// Shown the moment the search field takes focus, before anything is typed.
// "Shop all devices" rather than the reference's "Shop all deals": UpCell has
// no deals listing, and a label promising one would be a lie.
export const POPULAR_SEARCHES = [
    { label: 'iPhone', to: shopFamilyPath('iPhone') },
    { label: 'iPad', to: shopFamilyPath('iPad') },
    { label: 'MacBook', to: shopFamilyPath('MacBook') },
    { label: 'Trade in your tech', to: '/trade-in' },
    { label: 'Shop all deals', to: '/shop' },
];

// The trailing word of the resting placeholder, cycled on a timer.
export const SEARCH_PLACEHOLDER_WORDS = ['iPhone', 'iPad', 'MacBook'];

export const SEARCH_PLACEHOLDER_INTERVAL = 3000;

export const MAIN_ROW_LINKS = [
    { label: 'Need help?', to: '/support' },
    { label: 'For business', to: '/support' },
];

// The drawer's secondary list. It is the utility row plus "Need help?",
// because the utility row carries no support link and MAIN_ROW_LINKS is
// desktop-only — without this, /support is unreachable from the header on a
// phone. "For business" is left out rather than repeating the same target.
export const DRAWER_SECONDARY_LINKS = [
    ...UTILITY_LINKS,
    { label: 'Need help?', to: '/support' },
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
