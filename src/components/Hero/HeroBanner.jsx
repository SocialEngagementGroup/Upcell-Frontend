import { Link } from 'react-router-dom';

import { cloudinaryUrl } from '../../utilities/cloudinary';
import { HERO } from './heroContent';

// The home banner: copy on the left, product on the right, one coloured band
// behind both. Static by design — it was a carousel, and the dots and autoplay
// came out because a single message reads better than three rotating ones.
//
// Near edge-to-edge like the reference: a 4% inset rather than the navbar's
// 1200px container, so the headline sits well outboard of the logo above it.
const HeroBanner = () => (
    <section aria-label="Featured" className="bg-apple-bg">
        <div className="mx-auto flex max-w-[125rem] flex-col items-center gap-8 px-[4%] py-10 md:min-h-[420px] md:flex-row md:gap-6 md:py-12">
            <div className="order-2 w-full text-center md:order-1 md:w-1/2 md:text-left">
                {/* font-bold rather than the base layer's extrabold: Roboto is
                    loaded at 400/500/700, so 800 resolves to 700 regardless. */}
                <h1 className="text-[2rem] font-bold leading-[1.04] tracking-[-0.035em] text-apple-text md:text-[3rem] lg:text-[4rem]">
                    {HERO.title}
                    <span className="block italic">{HERO.emphasis}</span>
                </h1>

                <p className="mx-auto mt-5 max-w-[42ch] text-[1rem] font-normal leading-snug text-ink-soft md:mx-0 md:text-[1.25rem]">
                    {HERO.copy}
                </p>

                <Link
                    to={HERO.cta.to}
                    className="mt-7 inline-flex h-12 items-center rounded-lg bg-apple-text px-8 text-[1rem] font-bold text-white outline-none transition-colors duration-200 ease-smooth hover:bg-black focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 md:h-14"
                >
                    {HERO.cta.label}
                </Link>
            </div>

            <div className="order-1 w-full md:order-2 md:w-1/2">
                <img
                    src={cloudinaryUrl(HERO.image, { width: 1200 })}
                    alt=""
                    width="1200"
                    height="600"
                    fetchpriority="high"
                    decoding="async"
                    className="mx-auto block h-[160px] w-auto max-w-full object-contain md:ml-auto md:mr-0 md:h-[300px] lg:h-[340px]"
                />
            </div>
        </div>
    </section>
);

export default HeroBanner;
