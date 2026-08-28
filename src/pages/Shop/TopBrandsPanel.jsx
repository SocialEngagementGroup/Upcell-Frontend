import { useMemo, useState } from 'react';
import AppleIcon from '@mui/icons-material/Apple';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import ProductCard from '../../components/Recommended/ProductCard';
import { cloudinaryUrl } from '../../utilities/cloudinary';
import { STATIC_IMAGES } from '../../constants/staticImages';
import { BRANDS } from './shopDemoData';
import { RAIL_ARROW_CLASS, railArrowTone, useRailScroll } from './useRailScroll';

// "Top brands, refurbished".
//
// Two columns inside one panel, as the reference has it: a photograph filling
// the left edge to edge, and on the right a row of brand tiles above a product
// rail, with the arrows sitting under the rail on the right.
//
// The tiles are a control, not decoration — picking one swaps the rail, which
// is what the reference's row does.
const TopBrandsPanel = ({ productsByBrand, onAddToCart }) => {
    const [activeBrand, setActiveBrand] = useState(BRANDS[0].id);
    const { trackRef, canScrollBack, canScrollOn, sync, nudge } = useRailScroll(activeBrand);

    const products = useMemo(() => (
        productsByBrand[activeBrand] || []
    ), [productsByBrand, activeBrand]);

    const activeLabel = BRANDS.find((brand) => brand.id === activeBrand)?.label || '';

    return (
        <section aria-labelledby="brands-heading" className="py-10 md:py-12">
            <div className="site-shell">
                <h2 id="brands-heading" className="text-[1.625rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-[2rem]">
                    Top brands, refurbished
                </h2>

                <div className="mt-5 overflow-hidden rounded-3xl bg-surface-alt">
                    <div className="flex flex-col md:flex-row md:items-stretch">
                        {/* Flush to the panel edge, which the panel's own
                            rounded corners then clip — the reference leaves no
                            gutter around this photograph. */}
                        <div className="shrink-0 md:w-[32%]">
                            <img
                                src={cloudinaryUrl(STATIC_IMAGES.ABOUT_US_BG, { width: 900 })}
                                alt=""
                                width="900"
                                height="1200"
                                decoding="async"
                                className="block h-[220px] w-full object-cover md:h-full md:min-h-[520px]"
                            />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col p-5 md:p-6">
                            <ul className="flex list-none flex-wrap items-center gap-2.5 p-0 md:gap-3">
                                {BRANDS.map((brand) => {
                                    const selected = brand.id === activeBrand;

                                    return (
                                        <li key={brand.id}>
                                            {/* Each state carries its own full
                                                class string: the base layer
                                                sets `button { border-none }`,
                                                and sibling border utilities at
                                                equal specificity collide. */}
                                            <button
                                                type="button"
                                                onClick={() => setActiveBrand(brand.id)}
                                                aria-pressed={selected}
                                                aria-label={`Show ${brand.label}`}
                                                className={
                                                    selected
                                                        ? 'flex h-[68px] w-[68px] items-center justify-center rounded-2xl border-2 border-solid border-apple-text bg-white text-apple-text outline-none transition-colors duration-200 ease-smooth focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 [&_svg]:!text-[34px]'
                                                        : 'flex h-[68px] w-[68px] items-center justify-center rounded-2xl border-2 border-solid border-transparent bg-white text-ink-soft outline-none transition-colors duration-200 ease-smooth hover:border-black/20 focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 [&_svg]:!text-[34px]'
                                                }
                                            >
                                                {brand.id === 'apple' ? (
                                                    <AppleIcon aria-hidden="true" />
                                                ) : (
                                                    // No licensed mark for this
                                                    // brand exists in the repo,
                                                    // so the tile carries its
                                                    // name instead of a logo.
                                                    <span className="px-1 text-center text-[0.625rem] font-bold uppercase leading-tight tracking-wide">
                                                        {brand.label}
                                                    </span>
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>

                            {products.length === 0 ? (
                                <p className="mt-6 text-[1rem] font-normal text-apple-gray">
                                    No {activeLabel} devices to show yet.
                                </p>
                            ) : (
                                <>
                                    <ul
                                        ref={trackRef}
                                        onScroll={sync}
                                        className="scrollbar-hidden -mx-1 mt-6 flex list-none items-stretch gap-4 overflow-x-auto scroll-smooth px-1 pb-1"
                                    >
                                        {products.map((product) => (
                                            <li key={product._id} className="flex">
                                                <ProductCard
                                                    product={product}
                                                    onAddToCart={onAddToCart}
                                                    variant="bestSeller"
                                                />
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-4 flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => nudge(-1)}
                                            disabled={!canScrollBack}
                                            aria-label={`Scroll ${activeLabel} left`}
                                            className={`${RAIL_ARROW_CLASS} ${railArrowTone(canScrollBack)}`}
                                        >
                                            <ChevronLeftRoundedIcon aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => nudge(1)}
                                            disabled={!canScrollOn}
                                            aria-label={`Scroll ${activeLabel} right`}
                                            className={`${RAIL_ARROW_CLASS} ${railArrowTone(canScrollOn)}`}
                                        >
                                            <ChevronRightRoundedIcon aria-hidden="true" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TopBrandsPanel;
