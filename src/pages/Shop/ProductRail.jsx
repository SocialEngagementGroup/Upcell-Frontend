import { Link } from 'react-router-dom';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import ProductCard from '../../components/Recommended/ProductCard';
import ProductCardSkeleton from '../../components/Recommended/ProductCardSkeleton';
import { RAIL_ARROW_CLASS, railArrowTone, useRailScroll } from './useRailScroll';

// One titled carousel of product cards — the shape the reference uses for
// every product section on its listing page ("Shop our best deals", "Best
// refurbished iPhone", and so on).
//
// The scrolling itself lives in useRailScroll, shared with the brand panel, so
// every rail on the page behaves identically.
const ProductRail = ({
    id,
    title,
    subtitle,
    products = [],
    loading = false,
    onAddToCart,
    variant = 'bestSeller',
    seeAllTo,
    seeAllLabel = 'See all',
    emptyMessage = 'Nothing to show here yet.',
    className = '',
}) => {
    const { trackRef, canScrollBack, canScrollOn, sync, nudge } = useRailScroll(products.length);

    // How many placeholders to stand in for a rail that has not answered yet.
    // Five is what fits on a wide screen, so the row looks full rather than
    // half-built while it waits.
    const SKELETON_COUNT = 5;

    const headingId = `${id}-heading`;

    return (
        <section id={id} aria-labelledby={headingId} className={`scroll-mt-32 py-10 md:py-12 ${className}`}>
            <div className="site-shell">
                <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                        <h2 id={headingId} className="text-[1.625rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-[2rem]">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="mt-1 text-[1rem] font-normal text-ink-soft">{subtitle}</p>
                        )}
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        {seeAllTo && (
                            <Link
                                to={seeAllTo}
                                className="hidden text-[0.9375rem] font-bold text-apple-text underline-offset-4 outline-none hover:text-brand-red hover:underline focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 md:inline"
                            >
                                {seeAllLabel}
                            </Link>
                        )}

                        {!loading && products.length > 0 && (
                            <div className="hidden items-center gap-3 md:flex">
                                <button
                                    type="button"
                                    onClick={() => nudge(-1)}
                                    disabled={!canScrollBack}
                                    aria-label={`Scroll ${title} left`}
                                    className={`${RAIL_ARROW_CLASS} ${railArrowTone(canScrollBack)}`}
                                >
                                    <ChevronLeftRoundedIcon aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => nudge(1)}
                                    disabled={!canScrollOn}
                                    aria-label={`Scroll ${title} right`}
                                    className={`${RAIL_ARROW_CLASS} ${railArrowTone(canScrollOn)}`}
                                >
                                    <ChevronRightRoundedIcon aria-hidden="true" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {loading ? (
                    // The heading, the section and its spacing are all already
                    // on screen by this point — only the cards are pending. The
                    // page never blanks and never reflows when they land.
                    <ul aria-busy="true" className="scrollbar-hidden -mx-1 mt-5 flex list-none items-stretch gap-4 overflow-x-hidden px-1 pb-1">
                        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                            <li key={index} className="flex">
                                <ProductCardSkeleton />
                            </li>
                        ))}
                    </ul>
                ) : products.length === 0 ? (
                    <p className="mt-6 text-[1rem] font-normal text-apple-gray">{emptyMessage}</p>
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
