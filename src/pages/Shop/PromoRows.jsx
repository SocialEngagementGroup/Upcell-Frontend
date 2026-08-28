import { Link } from 'react-router-dom';

import { STATIC_IMAGES, staticImageUrl } from '../../constants/staticImages';

// The reference's two promo rows: a square illustration on one side, a
// heading, a line of copy and a button on the other.
//
// Two departures from the reference's wording, both because the number in it
// is not UpCell's:
//
//   1. "$700" is Back Market's figure. UpCell's own trade-in table
//      (TradeIn.jsx) tops out at a $1,250 base, and the condition answers only
//      ever deduct from it — so $700 understates what the funnel actually
//      quotes. $1,000 is used instead: comfortably inside what the table pays
//      for its top devices, so the quote can meet the promise.
//
//   2. "free 30-day returns" is not true here. The return policy makes the
//      buyer responsible for return shipping unless the fault is UpCell's, so
//      the window is stated and the word "free" is dropped.
//
// The artwork is photography from the blog, standing in for the reference's
// commissioned illustrations. UpCell has no illustration set; these are real
// images from the repo rather than empty boxes, and are the obvious thing to
// replace once there is art.
const ROWS = [
    {
        id: 'trade-in',
        title: 'Get up to $1,000 for your trade-in',
        copy: 'Turn the device in your drawer into credit. Answer a few questions about its '
            + 'condition and get an offer in about a minute.',
        cta: { label: 'Get a trade-in offer', to: '/trade-in' },
        image: STATIC_IMAGES.BLOG_TRADE_IN_TIMING,
    },
    {
        id: 'experts',
        title: 'Real tech experts, really there for you',
        copy: 'Every device passes a 40-point inspection before it is listed, and comes with a '
            + '12-month limited warranty and a 30-day return window.',
        cta: { label: 'See our standards', to: '/about' },
        image: STATIC_IMAGES.BLOG_BATTERY_HEALTH,
    },
];

const PromoRows = () => (
    <div className="py-10 md:py-12">
        <div className="site-shell flex flex-col gap-10 md:gap-16">
            {ROWS.map((row) => (
                <section
                    key={row.id}
                    aria-labelledby={`${row.id}-heading`}
                    className="flex flex-col gap-6 md:flex-row md:items-center md:gap-12"
                >
                    <div className="w-full shrink-0 md:w-[300px] lg:w-[340px]">
                        <img
                            src={staticImageUrl(row.image, 800)}
                            alt=""
                            width="800"
                            height="600"
                            decoding="async"
                            className="block h-[200px] w-full rounded-2xl object-cover md:h-[240px]"
                        />
                    </div>

                    <div className="min-w-0">
                        {/* Explicit size and weight: the base layer sets h2 to
                            text-4xl/extrabold, and Roboto has no 800 loaded. */}
                        <h2
                            id={`${row.id}-heading`}
                            className="text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-[1.75rem]"
                        >
                            {row.title}
                        </h2>

                        <p className="mt-2.5 max-w-[58ch] text-[1rem] font-normal leading-relaxed text-ink-soft md:text-[1.0625rem]">
                            {row.copy}
                        </p>

                        <Link
                            to={row.cta.to}
                            className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-apple-text px-6 text-[1rem] font-bold text-white outline-none transition-colors duration-200 ease-smooth hover:bg-brand-red focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                        >
                            {row.cta.label}
                        </Link>
                    </div>
                </section>
            ))}
        </div>
    </div>
);

export default PromoRows;
