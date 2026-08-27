import React from 'react';
import { Link } from 'react-router-dom';
import { HERO } from './heroContent';

// The home hero banner: Back Market styled vibrant lime background (#e3f87f),
// bold headline with italic emphasis, spacious copy, black rounded CTA,
// and the 5-color iPhone lineup cleanly presented on the right.
const HeroBanner = () => (
    <section
        aria-label="Featured Promotion"
        className="w-full bg-brand-lime transition-colors duration-300"
        style={{ backgroundColor: '#e3f87f' }}
    >
        <div className="mx-auto flex max-w-[1800px] flex-col items-center justify-between gap-8 px-6 py-10 sm:px-10 sm:py-12 md:flex-row md:gap-10 md:py-14 lg:px-16 lg:py-16">
            {/* Left side: 50% width on md+ */}
            <div className="order-2 flex w-full flex-col items-start text-left md:order-1 md:w-1/2">
                <h1 className="text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-[#0c0c0c] sm:text-[3.25rem] md:text-[4.25rem] lg:text-[5.5rem]">
                    {HERO.title}{' '}
                    <span className="block font-serif italic font-normal tracking-tight md:inline lg:block">
                        {HERO.emphasis}
                    </span>
                </h1>

                <p className="mt-5 text-[1.15rem] font-normal leading-snug text-[#111111] sm:text-[1.35rem] md:text-[1.5rem] lg:text-[1.7rem] md:max-w-[48ch]">
                    {HERO.copy}
                </p>

                <Link
                    to={HERO.cta.to}
                    className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-black px-8 text-[1rem] font-bold text-white shadow-sm outline-none transition-all duration-200 ease-smooth hover:bg-neutral-800 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#e3f87f] sm:mt-8 md:h-13 md:px-9 md:text-[1.05rem]"
                >
                    {HERO.cta.label}
                </Link>
            </div>

            {/* Right side: 50% width on md+ */}
            <div className="order-1 flex w-full items-center justify-center md:order-2 md:w-1/2 md:justify-end">
                <div className="relative flex w-full items-center justify-center md:justify-end">
                    <img
                        src={HERO.image}
                        alt="Apple iPhone lineup"
                        width="695"
                        height="359"
                        fetchpriority="high"
                        decoding="async"
                        className="block h-auto w-full max-w-[480px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)] transition-transform duration-500 ease-smooth hover:scale-[1.02] sm:max-w-[560px] md:max-w-[640px] lg:max-w-[720px] xl:max-w-[800px]"
                    />
                </div>
            </div>
        </div>
    </section>
);

export default HeroBanner;
