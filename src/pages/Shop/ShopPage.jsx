import React, { useContext, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

import { CartContext } from '../../App';
import ScrollToTop from '../../utilities/ScrollToTop';
import RouteLoadingScreen from '../../components/RouteLoadingScreen/RouteLoadingScreen';
import { groupProductsByParent } from '../../utilities/catalog';
import { MODEL_GROUP_IMAGES } from '../../components/layout/Header/navigationData';
import { cloudinaryUrl } from '../../utilities/cloudinary';
import { useProductsQuery } from '../../queries/products';
import { EMPTY_ARRAY } from '../../queries/keys';
import { STATIC_IMAGES } from '../../constants/staticImages';
import ProductRail from './ProductRail';
import Reviews from '../../components/Reviews/Reviews';
import TopBrandsPanel from './TopBrandsPanel';
import {
    AUDIENCE_CHIPS,
    DEMO_ANDROID,
    DEMO_DEALS,
    DEMO_GOOGLE,
    DEMO_IPHONES,
    DEMO_MOTOROLA,
    DEMO_ONEPLUS,
    DEMO_SAMSUNG,
} from './shopDemoData';

// The shop page is a landing page, not a filtered index — the same shape as
// the reference's /l/ pages: breadcrumb, title, then stacked rails. There is
// no filter panel, no sort control and no pagination, because the reference
// has none of those and this page is a clone of it.
//
// Two sections of the reference are deliberately absent, at the user's
// instruction: the 100-point inspection scroller, and the BackUp protection
// plan banner.
//
// Every other section of the reference is here, under the reference's own
// headings and in its order. Where UpCell has no catalogue behind a section —
// the Samsung and Android rails, the non-Apple brands — it renders demo data
// from ./shopDemoData.js, which documents what has to be decided before any of
// it is shown to a real visitor. Real products always win where there are any.

const FAMILIES = ['iPhone', 'iPad', 'MacBook'];

// Anchors, not routes: UpCell has no per-family listing page, so the cards at
// the top of the page and the mega menu's `?category=` links both resolve to a
// section further down this one.
const familyAnchor = (family) => family.toLowerCase();

// The reference's four "Shop our most wanted" cards, under its labels. Each
// one anchors to the rail further down that carries those devices.
const MOST_WANTED = [
    { id: 'iphone', label: 'iPhone', to: '#iphone', image: MODEL_GROUP_IMAGES['iPhone'] },
    { id: 'samsung', label: 'Samsung Galaxy', to: '#samsung', image: STATIC_IMAGES.NOT_AVAILABLE },
    { id: 'pixel', label: 'Google Pixel', to: '#android', image: STATIC_IMAGES.NOT_AVAILABLE },
    { id: 'android', label: 'Android smartphones', to: '#android', image: STATIC_IMAGES.NOT_AVAILABLE },
];

// The reference's accessory row, built at the user's instruction.
//
// UpCell's catalogue is iPhone, iPad and MacBook — there are no accessory
// products in it today. Each chip therefore searches rather than pretending to
// be a category page: the term is real, and until accessories are stocked the
// results view answers honestly that nothing matches, instead of a dead link
// or an empty page with no explanation.
const ACCESSORIES = [
    { label: 'Cases', query: 'case' },
    { label: 'Chargers', query: 'charger' },
    { label: 'Screen protectors', query: 'screen protector' },
    { label: 'AirPods', query: 'AirPods' },
    { label: 'Apple Pencil', query: 'Apple Pencil' },
    { label: 'Keyboards', query: 'keyboard' },
];

// Every line here is a term UpCell actually publishes.
//
// Not the reference's wording: it promises a 100-point inspection and "Free
// 30-day returns". UpCell's inspection is 40 points (AboutUs, Contactus and
// the product page all say so), and its returns are not free — the return
// policy makes the buyer responsible for return shipping unless the return is
// UpCell's fault. So the window is stated, and the word "free" is not.
const PROMISES = [
    {
        id: 'inspection',
        Icon: FactCheckOutlinedIcon,
        title: '40-point inspection',
        copy: 'Every device is tested and graded for condition before it is listed.',
    },
    {
        id: 'returns',
        Icon: EventRepeatOutlinedIcon,
        title: '30-day return window',
        copy: 'Changed your mind? Return an eligible device within 30 days of delivery.',
        to: '/return-policy',
    },
    {
        id: 'warranty',
        Icon: VerifiedUserOutlinedIcon,
        title: '12-month warranty',
        copy: 'Backed by a 12-month UpCell IT Inc. limited warranty from delivery.',
        to: '/return-policy',
    },
];

const MAX_PER_RAIL = 12;

const ShopPage = () => {
    const location = useLocation();
    const { setCart } = useContext(CartContext);
    const { data: products = EMPTY_ARRAY, isLoading: productsLoading } = useProductsQuery();

    const searchTerm = useMemo(() => (
        (new URLSearchParams(location.search).get('q') || '').trim()
    ), [location.search]);

    // One card per parent product, so a phone in eight colours is one entry
    // rather than eight — the same grouping every rail on the site uses.
    const catalogue = useMemo(() => groupProductsByParent(products), [products]);

    // Biggest saving first. Empty when nothing is discounted, which is the
    // honest answer rather than padding a "best deals" rail with full-price
    // stock.
    const deals = useMemo(() => {
        const real = catalogue
            .filter((product) => Number(product.originalPrice || 0) > Number(product.price || 0))
            .sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price))
            .slice(0, MAX_PER_RAIL);

        return real.length ? real : DEMO_DEALS;
    }, [catalogue]);

    // "Best" here means most reviewed, ties broken by score — the same reading
    // the home page's "Best sellers" tab already uses, rather than an editorial
    // ranking nobody maintains.
    const byFamily = useMemo(() => {
        const groups = Object.fromEntries(FAMILIES.map((family) => [family, []]));

        for (const product of catalogue) {
            if (groups[product.family]) groups[product.family].push(product);
        }

        for (const family of FAMILIES) {
            groups[family].sort((a, b) => (
                Number(b.peopleReviewed || 0) - Number(a.peopleReviewed || 0)
                || Number(b.reviewScore || 0) - Number(a.reviewScore || 0)
            ));
            groups[family] = groups[family].slice(0, MAX_PER_RAIL);
        }

        return groups;
    }, [catalogue]);

    // What each of the reference's three rails renders. The iPhone rail has a
    // real catalogue behind it; the Samsung and Android rails do not, because
    // UpCell stocks Apple only — those two are demo until the shop sells them.
    // Real products always win where there are any.
    const railProducts = useMemo(() => ({
        iPhone: byFamily.iPhone.length ? byFamily.iPhone : DEMO_IPHONES,
        samsung: DEMO_SAMSUNG,
        android: DEMO_ANDROID,
    }), [byFamily]);

    // One set per tile in the brand panel. Apple is the only brand with a real
    // catalogue behind it; the rest are demo until UpCell stocks them.
    const productsByBrand = useMemo(() => ({
        apple: byFamily.iPhone.length ? byFamily.iPhone : DEMO_IPHONES,
        samsung: DEMO_SAMSUNG,
        google: DEMO_GOOGLE,
        oneplus: DEMO_ONEPLUS,
        motorola: DEMO_MOTOROLA,
    }), [byFamily]);

    // The header's search box sends people here with `?q=`. Without a filtered
    // index to land on, that would now be a dead end, so the term switches the
    // page into a results view instead of the curated one.
    const searchResults = useMemo(() => {
        if (!searchTerm) return EMPTY_ARRAY;
        const term = searchTerm.toLowerCase();

        return catalogue.filter((product) => (
            `${product.productName || ''} ${product.categoryName || ''} ${product.description || ''}`
                .toLowerCase()
                .includes(term)
        ));
    }, [catalogue, searchTerm]);

    // `?category=` arrives from the mega menu. There is no per-family route to
    // send it to, so it scrolls to that family's rail once the cards exist.
    useEffect(() => {
        const category = new URLSearchParams(location.search).get('category');
        if (!category || productsLoading || searchTerm) return undefined;

        const family = FAMILIES.find((item) => item.toLowerCase() === category.trim().toLowerCase());
        if (!family) return undefined;

        // After paint, so the rail has its real height and ScrollToTop has
        // already run.
        const timer = window.setTimeout(() => {
            document.getElementById(familyAnchor(family))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);

        return () => window.clearTimeout(timer);
    }, [location.search, productsLoading, searchTerm]);

    const handleAddToCart = (event, productId) => {
        event.preventDefault();
        event.stopPropagation();
        setCart((prev) => [...prev, productId]);
        toast.success('Product added to cart');
    };

    return (
        <div className="pb-4">
            <ScrollToTop />

            {/* ===============================================================
                Page head — breadcrumb and title, on white, as the reference has.
                =============================================================== */}
            <section className="bg-white pb-8 pt-4 md:pb-12 md:pt-6">
                <div className="site-shell">
                    <nav aria-label="Breadcrumb">
                        <ol className="m-0 flex list-none items-center gap-1.5 p-0 text-[0.8125rem] leading-none">
                            <li className="flex items-center gap-1.5">
                                <Link
                                    to="/"
                                    className="flex items-center gap-1 font-medium text-ink-soft outline-none hover:text-brand-red hover:underline focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 [&_svg]:!text-[16px]"
                                >
                                    <HomeRoundedIcon aria-hidden="true" />
                                    Home
                                </Link>
                                <ChevronRightRoundedIcon aria-hidden="true" className="!text-[16px] text-apple-gray" />
                            </li>
                            {searchTerm ? (
                                <>
                                    <li className="flex items-center gap-1.5">
                                        <Link
                                            to="/shop"
                                            className="font-medium text-ink-soft outline-none hover:text-brand-red hover:underline focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                                        >
                                            Shop
                                        </Link>
                                        <ChevronRightRoundedIcon aria-hidden="true" className="!text-[16px] text-apple-gray" />
                                    </li>
                                    <li aria-current="page" className="font-normal text-apple-gray">Search</li>
                                </>
                            ) : (
                                <li aria-current="page" className="font-normal text-apple-gray">Shop</li>
                            )}
                        </ol>
                    </nav>

                    {/* The base layer sizes h1 at text-5xl/6xl and font-extrabold;
                        both are overridden — Roboto has no 800 face loaded, and
                        60px is a home-page hero size, not a listing title. */}
                    <h1 className="mt-4 text-[2rem] font-bold leading-[1.08] tracking-[-0.03em] text-apple-text md:mt-5 md:text-[2.625rem] lg:text-[3rem]">
                        {searchTerm
                            ? <>Results for &ldquo;{searchTerm}&rdquo;</>
                            : 'All Certified Premium iPhone, iPad and MacBook'}
                    </h1>

                    {!searchTerm && (
                        <p className="mt-3 max-w-[62ch] text-[0.9375rem] font-normal leading-relaxed text-ink-soft md:text-[1rem]">
                            Every device is inspected, graded for condition, and backed by a 12-month
                            UpCell IT Inc. limited warranty.
                        </p>
                    )}
                </div>
            </section>

            {productsLoading ? (
                <RouteLoadingScreen compact />
            ) : searchTerm ? (
                /* =============================================================
                   Search results. Not part of the reference — added because the
                   header's search box points at `?q=` and, with the filtered
                   index gone, would otherwise land on a page that ignored it.
                   ============================================================= */
                <>
                    <ProductRail
                        id="search-results"
                        title={`${searchResults.length} ${searchResults.length === 1 ? 'match' : 'matches'}`}
                        subtitle={searchResults.length ? undefined : 'Try a different model name, or browse the full catalogue below.'}
                        products={searchResults}
                        onAddToCart={handleAddToCart}
                        variant="bestSeller"
                        emptyMessage={`Nothing in the catalogue matches “${searchTerm}”.`}
                    />

                    <div className="site-shell pb-10">
                        <Link
                            to="/shop"
                            className="inline-flex h-12 items-center justify-center rounded-full border border-solid border-black/[0.08] bg-white px-6 text-[0.875rem] font-bold text-apple-text outline-none transition-colors duration-200 ease-smooth hover:border-apple-text focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                        >
                            Browse all devices
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    {/* =========================================================
                        Shop our most wanted.
                        ========================================================= */}
                    <section aria-labelledby="most-wanted-heading" className="py-8 md:py-10">
                        <div className="site-shell">
                            <h2 id="most-wanted-heading" className="text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-[1.75rem]">
                                Shop our most wanted
                            </h2>

                            <ul className="mt-5 grid grid-cols-2 list-none gap-3 p-0 md:grid-cols-4 md:gap-4">
                                {MOST_WANTED.map((item) => (
                                    <li key={item.id}>
                                        <a
                                            href={item.to}
                                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-solid border-black/[0.06] bg-white outline-none transition-colors duration-200 ease-smooth hover:border-apple-text focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                                        >
                                            <span className="flex items-center justify-center bg-surface-alt px-4 py-6 md:py-8">
                                                {/* Not lazy: this row is the
                                                    first thing under the title. */}
                                                <img
                                                    src={cloudinaryUrl(item.image, { width: 320 })}
                                                    alt=""
                                                    width="320"
                                                    height="320"
                                                    decoding="async"
                                                    className="block h-[92px] w-auto object-contain transition-transform duration-300 ease-smooth group-hover:scale-105 md:h-[116px]"
                                                />
                                            </span>
                                            <span className="px-4 py-3 text-[0.9375rem] font-bold leading-tight text-apple-text group-hover:text-brand-red md:text-[1rem]">
                                                {item.label}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* =========================================================
                        Shop our best deals.
                        ========================================================= */}
                    {/* =========================================================
                        Shop accessories.
                        ========================================================= */}
                    <section aria-labelledby="accessories-heading" className="py-8 md:py-10">
                        <div className="site-shell">
                            <h2 id="accessories-heading" className="text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-[1.75rem]">
                                Shop accessories
                            </h2>

                            <ul className="mt-5 flex list-none flex-wrap gap-2.5 p-0 md:gap-3">
                                {ACCESSORIES.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            to={`/shop?q=${encodeURIComponent(item.query)}`}
                                            className="inline-flex h-11 items-center rounded-full bg-apple-text px-5 text-[0.875rem] font-bold text-white outline-none transition-colors duration-200 ease-smooth hover:bg-brand-red focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* The reference's deals cards carry no badge — just the
                        price with the new-device price struck through beside
                        it, which is ProductCard's bestSeller face. The rail is
                        still ordered by biggest saving. */}
                    <ProductRail
                        id="deals"
                        title="Shop our best deals"
                        products={deals}
                        onAddToCart={handleAddToCart}
                        variant="bestSeller"
                        emptyMessage="No price drops right now — check back soon."
                    />

                    {/* =========================================================
                        The promise strip the reference runs under its deals.
                        ========================================================= */}
                    <section aria-label="What every device comes with" className="bg-white py-8 md:py-10">
                        <div className="site-shell">
                            <ul className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3 md:gap-8">
                                {PROMISES.map(({ id, Icon, title, copy, to }) => (
                                    <li key={id} className="flex items-start gap-3">
                                        <Icon aria-hidden="true" className="mt-0.5 shrink-0 !text-[26px] text-brand-red" />
                                        <div className="min-w-0">
                                            <p className="text-[1rem] font-bold text-apple-text">{title}</p>
                                            <p className="mt-1 text-[0.875rem] font-normal leading-snug text-ink-soft">
                                                {copy}
                                                {to && (
                                                    <>
                                                        {' '}
                                                        <Link
                                                            to={to}
                                                            className="font-medium text-apple-text underline underline-offset-2 outline-none hover:text-brand-red focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                                                        >
                                                            Read the terms
                                                        </Link>
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* =========================================================
                        Your phone, your call.
                        ========================================================= */}
                    <section aria-labelledby="audience-heading" className="py-8 md:py-10">
                        <div className="site-shell">
                            <h2 id="audience-heading" className="text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-[1.75rem]">
                                Your phone, your call
                            </h2>

                            <ul className="mt-5 flex list-none flex-wrap gap-2.5 p-0 md:gap-3">
                                {AUDIENCE_CHIPS.map((chip) => (
                                    <li key={chip.label}>
                                        <Link
                                            to={chip.to}
                                            className="inline-flex h-11 items-center rounded-full border border-solid border-black/[0.12] bg-white px-5 text-[0.875rem] font-bold text-apple-text outline-none transition-colors duration-200 ease-smooth hover:border-apple-text hover:bg-surface focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                                        >
                                            {chip.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* =========================================================
                        The reference's three product rails, in its order and
                        under its headings.
                        ========================================================= */}
                    <ProductRail
                        id="iphone"
                        title="Best refurbished iPhone"
                        products={railProducts.iPhone}
                        onAddToCart={handleAddToCart}
                        variant="bestSeller"
                    />

                    <ProductRail
                        id="samsung"
                        title="Best refurbished Samsung"
                        products={railProducts.samsung}
                        onAddToCart={handleAddToCart}
                        variant="bestSeller"
                    />

                    <ProductRail
                        id="android"
                        title="Best refurbished Android smartphones"
                        products={railProducts.android}
                        onAddToCart={handleAddToCart}
                        variant="bestSeller"
                    />

                    <TopBrandsPanel productsByBrand={productsByBrand} onAddToCart={handleAddToCart} />

                    {/* =========================================================
                        The reference's customer wall. Same rail the home page
                        runs; only the heading differs.

                        Its heading there is "Over 15M customers globally". That
                        count is Back Market's, and UpCell has no figure of its
                        own to put in its place — so the rail keeps a heading
                        that promises nothing. Swap in a real number the moment
                        there is one.
                        ========================================================= */}
                    <Reviews
                        id="customers"
                        heading="Loved by customers"
                        className="py-8 md:py-10"
                    />
                </>
            )}
        </div>
    );
};

export default ShopPage;
