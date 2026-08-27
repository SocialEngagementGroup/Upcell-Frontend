import { Link } from 'react-router-dom';

import { STATIC_IMAGES, staticImageUrl } from '../../constants/staticImages';

// Trade-in promo. Content follows the reference's trade-in card; the styling
// follows its campaign banner — a contained lime block with rounded corners,
// copy bottom-left, product upper-right, dark button.
//
// The copy deliberately does NOT claim "from pristine to non-functional" the
// way the reference does: the trade-in form only offers Like New, Good and
// Fair (TradeIn.jsx), so promising a quote on a dead device would be a
// promise the funnel cannot keep.
const TradeInBanner = () => (
    <section aria-labelledby="trade-in-banner-heading" className="pb-10 md:pb-12">
        <div className="site-shell">
            <div className="overflow-hidden rounded-3xl bg-brand-lime">
                <div className="flex flex-col-reverse gap-6 px-6 py-8 md:flex-row md:items-end md:gap-10 md:px-10 md:py-10">
                    <div className="w-full md:w-1/2">
                        {/* Explicit size and weight: the base layer sets h2 to
                            text-4xl/extrabold, and Roboto has no 800 loaded. */}
                        <h2
                            id="trade-in-banner-heading"
                            className="text-[1.75rem] font-bold leading-[1.1] tracking-[-0.02em] text-apple-text md:text-[2rem]"
                        >
                            Trade-in
                        </h2>

                        <p className="mt-3 max-w-[46ch] text-[0.9375rem] font-normal leading-snug text-apple-text/80 md:text-[1rem]">
                            From like-new to well-worn, answer a few questions and get your
                            offer in minutes.
                        </p>

                        <Link
                            to="/trade-in"
                            className="mt-6 inline-flex h-11 items-center rounded-lg bg-apple-text px-6 text-[0.9375rem] font-bold text-white outline-none transition-colors duration-200 ease-smooth hover:bg-black focus-visible:ring-2 focus-visible:ring-apple-text focus-visible:ring-offset-2 focus-visible:ring-offset-brand-lime"
                        >
                            Trade in now
                        </Link>
                    </div>

                    <div className="w-full md:w-1/2">
                        <img
                            src={staticImageUrl(STATIC_IMAGES.BLOG_TRADE_IN_TIMING, 900)}
                            alt=""
                            width="900"
                            height="600"
                            loading="lazy"
                            decoding="async"
                            className="mx-auto block h-[180px] w-full max-w-[420px] rounded-2xl object-cover md:ml-auto md:mr-0 md:h-[240px] md:max-w-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default TradeInBanner;
