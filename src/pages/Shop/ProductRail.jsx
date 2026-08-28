import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import ProductCard from '../../components/Recommended/ProductCard';

// One titled carousel of product cards — the shape the reference uses for
// every product section on its listing page ("Shop our best deals", "Best
// refurbished iPhone", and so on).
//
// A scroller rather than a slider: no slide index, no autoplay, just overflow
// with the arrows nudging scrollLeft. Trackpad and touch swiping work for
// free, and it degrades to a plain scrollable row if the script never runs.
// Same approach as the home page's rails, so a rail behaves identically
// wherever it appears.
const ProductRail = ({
    id,
    title,
    subtitle,
    products = [],
    onAddToCart,
    variant = 'bestSeller',
    seeAllTo,
    seeAllLabel = 'See all',
    emptyMessage = 'Nothing to show here yet.',
    className = '',
}) => {
    const trackRef = useRef(null);
    const [canScrollBack, setCanScrollBack] = useState(false);
    const [canScrollOn, setCanScrollOn] = useState(false);

    // A one-pixel tolerance: sub-pixel layout means scrollLeft rarely lands
    // exactly on the maximum, which would leave the forward arrow enabled at
    // the end of the rail forever.
    const sync = useCallback(() => {
        const node = trackRef.current;
        if (!node) return;
        const max = node.scrollWidth - node.clientWidth;
        setCanScrollBack(node.scrollLeft > 1);
        setCanScrollOn(node.scrollLeft < max - 1);
    }, []);

    useEffect(() => {
        sync();
        window.addEventListener('resize', sync);
        return () => window.removeEventListener('resize', sync);
    }, [sync, products.length]);

    const nudge = (direction) => {
        const node = trackRef.current;
        if (!node) return;
        node.scrollBy({ left: direction * Math.round(node.clientWidth * 0.9), behavior: 'smooth' });
    };

    const arrowClass = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-none outline-none transition-colors duration-200 ease-smooth focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 [&_svg]:!text-[22px]';
    const arrowTone = (enabled) => (enabled
        ? 'bg-apple-text text-white hover:bg-black cursor-pointer'
        : 'bg-apple-bg text-apple-gray cursor-not-allowed');

    const headingId = `${id}-heading`;

    return (
        <section id={id} aria-labelledby={headingId} className={`scroll-mt-32 py-8 md:py-10 ${className}`}>
            <div className="site-shell">
                <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                        <h2 id={headingId} className="text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-[1.75rem]">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="mt-1 text-[0.9375rem] font-normal text-ink-soft">{subtitle}</p>
                        )}
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        {seeAllTo && (
                            <Link
                                to={seeAllTo}
                                className="hidden text-[0.875rem] font-bold text-apple-text underline-offset-4 outline-none hover:text-brand-red hover:underline focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 md:inline"
                            >
                                {seeAllLabel}
                            </Link>
                        )}

                        {products.length > 0 && (
                            <div className="hidden items-center gap-3 md:flex">
                                <button
                                    type="button"
                                    onClick={() => nudge(-1)}
                                    disabled={!canScrollBack}
                                    aria-label={`Scroll ${title} left`}
                                    className={`${arrowClass} ${arrowTone(canScrollBack)}`}
                                >
                                    <ChevronLeftRoundedIcon aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => nudge(1)}
                                    disabled={!canScrollOn}
                                    aria-label={`Scroll ${title} right`}
                                    className={`${arrowClass} ${arrowTone(canScrollOn)}`}
                                >
                                    <ChevronRightRoundedIcon aria-hidden="true" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {products.length === 0 ? (
                    <p className="mt-6 text-[0.9375rem] font-normal text-apple-gray">{emptyMessage}</p>
                ) : (
                    <ul
                        ref={trackRef}
                        onScroll={sync}
                        className="scrollbar-hidden -mx-1 mt-5 flex list-none items-stretch gap-4 overflow-x-auto scroll-smooth px-1 pb-1"
                    >
                        {products.map((product) => (
                            <li key={product._id} className="flex">
                                <ProductCard product={product} onAddToCart={onAddToCart} variant={variant} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
};

export default ProductRail;
