import React from 'react';
import { Link } from 'react-router-dom';
import { HERO } from './heroContent';

// The home hero banner.
//
// The reference does this band in its own lime. That colour is Back Market's,
// not UpCell's — the brand guideline has four colours and lime is not one of
// them — so the band is carried by Near Black instead, with the emphasis word
// and the CTA in Brand Red. Red stays an accent here rather than a ground,
// which is what the guideline asks of it.
const HeroBanner = () => (
    <section
        aria-label="Featured Promotion"
        className="w-full bg-apple-text"
    >
        <div className="mx-auto flex max-w-[1800px] flex-col items-center justify-between gap-8 px-6 py-10 sm:px-10 sm:py-12 md:flex-row md:gap-10 md:py-14 lg:px-16 lg:py-16">
            {/* Copy takes 45, the lineup 55 — the phones earn the extra. */}
            <div className="order-2 flex w-full flex-col items-start text-left md:order-1 md:w-[45%]">
                <h1 className="text-[2.5rem] font-bold leading-[1.04] tracking-[-0.035em] text-white sm:text-[3.25rem] md:text-[4.25rem] lg:text-[5.5rem]">
                    {HERO.title}{' '}
                    <span className="block font-serif italic font-normal tracking-tight text-brand-red md:inline lg:block">
                        {HERO.emphasis}
                    </span>
                </h1>

                <p className="mt-5 text-[1.15rem] font-normal leading-snug text-white/80 sm:text-[1.35rem] md:text-[1.5rem] lg:text-[1.7rem] md:max-w-[48ch]">
                    {HERO.copy}
                </p>

                <Link
                    to={HERO.cta.to}
                    className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-brand-red px-8 text-[1rem] font-bold text-white outline-none transition-all duration-200 ease-smooth hover:bg-[#b00a0d] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-apple-text sm:mt-8 md:h-13 md:px-9 md:text-[1.05rem]"
                >
                    {HERO.cta.label}
                </Link>
            </div>

            <div className="order-1 flex w-full items-center justify-center md:order-2 md:w-[55%] md:justify-end">
                <div className="relative flex w-full items-center justify-center md:justify-end">
                    <img
                        src={HERO.image}
                        alt="Apple iPhone lineup"
                        width="695"
                        height="359"
                        fetchpriority="high"
                        decoding="async"
                        className="block h-auto w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)] transition-transform duration-500 ease-smooth hover:scale-[1.02]"
                    />
                </div>
            </div>
        </div>
    </section>
);

export default HeroBanner;
