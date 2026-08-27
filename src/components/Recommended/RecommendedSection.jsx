import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import { CartContext } from '../../App';
import { useProductsQuery } from '../../queries/products';
import { EMPTY_ARRAY } from '../../queries/keys';
import { groupProductsByParent, normalizeProduct } from '../../utilities/catalog';
import ProductCard from './ProductCard';
import { DEMO_PRODUCTS } from './demoProducts';

const MAX_CARDS = 12;

// Two ways of reading the same catalogue, not two datasets:
//   Price drop  — anything whose originalPrice sits above its price, biggest
//                 saving first. Empty if nothing is discounted, which is the
//                 honest answer rather than padding the rail with full-price
//                 stock under a "Price drop" heading.
//   Best sellers— most reviewed first, ties broken by score.
const TABS = [
    { id: 'price-drop', label: 'Price drop' },
    { id: 'best-sellers', label: 'Best sellers' },
];

const RecommendedSection = () => {
    const [tab, setTab] = useState('price-drop');
    const { setCart } = useContext(CartContext);
    const trackRef = useRef(null);
    const [canScrollBack, setCanScrollBack] = useState(false);
    const [canScrollOn, setCanScrollOn] = useState(false);

    const { data: products = EMPTY_ARRAY, isLoading } = useProductsQuery();

    // One card per parent product, so a phone in eight colours is one entry
    // rather than eight — the same grouping the shop grid uses.
    const cards = useMemo(() => {
        const real = groupProductsByParent(products).map(normalizeProduct);

        // Nothing from the API — the backend is down or the catalogue is
        // empty. Fall back to the demo set so the section can still be
        // reviewed. Real products always win when there are any.
        const grouped = real.length ? real : DEMO_PRODUCTS;

        if (tab === 'price-drop') {
            return grouped
                .filter((p) => Number(p.originalPrice || 0) > Number(p.price || 0))
                .sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price))
                .slice(0, MAX_CARDS);
        }

        return [...grouped]
            .sort((a, b) => (
                Number(b.peopleReviewed || 0) - Number(a.peopleReviewed || 0)
                || Number(b.reviewScore || 0) - Number(a.reviewScore || 0)
            ))
            .slice(0, MAX_CARDS);
    }, [products, tab]);

    // A one-pixel tolerance: sub-pixel layout means scrollLeft rarely lands
    // exactly on the maximum, which would leave the forward arrow live at the
    // end of the rail forever.
    const sync = useCallback(() => {
        const node = trackRef.current;
        if (!node) return;
        const max = node.scrollWidth - node.clientWidth;
        setCanScrollBack(node.scrollLeft > 1);
        setCanScrollOn(node.scrollLeft < max - 1);
    }, []);

    useEffect(() => {
        const node = trackRef.current;
        if (node) node.scrollLeft = 0;
        sync();
        window.addEventListener('resize', sync);
        return () => window.removeEventListener('resize', sync);
    }, [sync, tab, cards.length]);

    const nudge = (direction) => {
        const node = trackRef.current;
        if (!node) return;
        node.scrollBy({ left: direction * Math.round(node.clientWidth * 0.9), behavior: 'smooth' });
    };

    const handleAddToCart = (event, productId) => {
        event.preventDefault();
        event.stopPropagation();
        setCart((prev) => [...prev, productId]);
        toast.success('Product added to cart');
    };

    const arrowClass = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-none outline-none transition-colors duration-200 ease-smooth focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 [&_svg]:!text-[22px]';
    const arrowTone = (enabled) => (enabled
        ? 'bg-apple-text text-white hover:bg-black cursor-pointer'
        : 'bg-apple-bg text-apple-gray cursor-not-allowed');

    return (
        <section aria-labelledby="recommended-heading" className="py-10 md:py-12">
            <div className="site-shell">
                <h2 id="recommended-heading" className="text-[1.5rem] font-bold tracking-[-0.02em] text-apple-text md:text-[1.75rem]">
                    Recommended for you
                </h2>

                {/* Tablist rather than plain buttons: these swap the panel
                    below them, so arrow-key navigation is what a keyboard user
                    will expect. */}
                <div role="tablist" aria-label="Recommendation type" className="mt-4 flex gap-2">
                    {TABS.map((item) => {
                        const selected = item.id === tab;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                role="tab"
                                id={`rec-tab-${item.id}`}
                                aria-selected={selected}
                                aria-controls="rec-panel"
                                onClick={() => setTab(item.id)}
                                className={`h-9 rounded-full px-4 text-[0.875rem] font-bold outline-none transition-colors duration-200 ease-smooth focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 ${
                                    selected
                                        ? 'bg-brand-lime text-apple-text'
                                        : 'bg-apple-bg text-ink-soft hover:bg-black/[0.08]'
                                }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <div id="rec-panel" role="tabpanel" aria-labelledby={`rec-tab-${tab}`} className="mt-6">
                    {isLoading ? (
                        <p className="py-8 text-[0.9375rem] text-apple-gray">Loading recommendations…</p>
                    ) : cards.length === 0 ? (
                        <p className="py-8 text-[0.9375rem] text-apple-gray">
                            {tab === 'price-drop'
                                ? 'No price drops right now — check back soon.'
                                : 'No products to show yet.'}
                        </p>
                    ) : (
                        <>
                            <ul
                                ref={trackRef}
                                onScroll={sync}
                                className="scrollbar-hidden -mx-1 flex list-none items-stretch gap-4 overflow-x-auto scroll-smooth px-1 pb-1"
                            >
                                {cards.map((product) => (
                                    <li key={product._id} className="flex">
                                        <ProductCard
                                            product={product}
                                            onAddToCart={handleAddToCart}
                                            variant={tab === 'price-drop' ? 'priceDrop' : 'bestSeller'}
                                        />
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => nudge(-1)}
                                    disabled={!canScrollBack}
                                    aria-label="Scroll left"
                                    aria-controls="rec-panel"
                                    className={`${arrowClass} ${arrowTone(canScrollBack)}`}
                                >
                                    <ChevronLeftRoundedIcon aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => nudge(1)}
                                    disabled={!canScrollOn}
                                    aria-label="Scroll right"
                                    aria-controls="rec-panel"
                                    className={`${arrowClass} ${arrowTone(canScrollOn)}`}
                                >
                                    <ChevronRightRoundedIcon aria-hidden="true" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default RecommendedSection;
