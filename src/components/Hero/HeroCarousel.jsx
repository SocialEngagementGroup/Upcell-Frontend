import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { cloudinaryUrl } from '../../utilities/cloudinary';
import { HERO_INTERVAL, HERO_SLIDES, HERO_THEMES } from './heroSlides';

// The home hero. One slide is mounted at a time and re-keyed on change, so the
// fade runs on mount and the DOM never holds three copies of the headline —
// which also keeps a single <h1> on the page.
//
// Dots only: the arrows in the reference belong to the most-wanted rail
// underneath, not to the hero.
//
// Autoplay stops while a pointer is over the carousel, while focus is inside
// it, and entirely when the visitor asks for reduced motion. A carousel that
// moves under someone reading it is the usual complaint about this pattern.
const HeroCarousel = () => {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);

    const count = HERO_SLIDES.length;
    const slide = HERO_SLIDES[index];
    const tone = HERO_THEMES[slide.theme];

    const goTo = useCallback((next) => setIndex(((next % count) + count) % count), [count]);

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const sync = () => setReduceMotion(query.matches);
        sync();
        query.addEventListener('change', sync);
        return () => query.removeEventListener('change', sync);
    }, []);

    useEffect(() => {
        if (isPaused || reduceMotion || count < 2) return undefined;
        const id = setInterval(() => setIndex((current) => (current + 1) % count), HERO_INTERVAL);
        return () => clearInterval(id);
    }, [isPaused, reduceMotion, count]);

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') { event.preventDefault(); goTo(index + 1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(index - 1); }
    };

    return (
        <section
            aria-roledescription="carousel"
            aria-label="Featured"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
            }}
            onKeyDown={handleKeyDown}
        >
            <div
                key={slide.id}
                className={`hero-fade ${tone.band}`}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
            >
                {/* Near edge-to-edge, as the reference is: a 4% inset rather
                    than the navbar's 1200px container, so the headline sits
                    well outboard of the logo above it. */}
                <div className="mx-auto flex max-w-[125rem] flex-col items-center gap-8 px-[4%] py-10 md:min-h-[420px] md:flex-row md:gap-6 md:py-12">
                    <div className="order-2 w-full text-center md:order-1 md:w-1/2 md:text-left">
                        <p className={`text-[0.75rem] font-bold uppercase tracking-[0.16em] ${tone.eyebrow}`}>
                            {slide.eyebrow}
                        </p>

                        {/* font-bold rather than the base layer's extrabold:
                            Roboto is loaded at 400/500/700, so 800 resolves to
                            700 regardless. */}
                        <h1 className={`mt-3 text-[2rem] font-bold leading-[1.04] tracking-[-0.035em] md:text-[3rem] lg:text-[4rem] ${tone.title}`}>
                            {slide.title}
                            <span className="block italic">{slide.emphasis}</span>
                        </h1>

                        <p className={`mx-auto mt-4 max-w-[42ch] text-[1rem] font-normal leading-snug md:mx-0 md:text-[1.25rem] ${tone.copy}`}>
                            {slide.copy}
                        </p>

                        <Link
                            to={slide.cta.to}
                            className={`mt-7 inline-flex h-12 items-center rounded-lg px-8 text-[1rem] font-bold outline-none transition-colors duration-200 ease-smooth focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 md:h-14 ${tone.cta}`}
                        >
                            {slide.cta.label}
                        </Link>
                    </div>

                    <div className="order-1 w-full md:order-2 md:w-1/2">
                        <img
                            src={cloudinaryUrl(slide.image, { width: 1200 })}
                            alt=""
                            width="1200"
                            height="600"
                            loading={index === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            className="mx-auto block h-[160px] w-auto max-w-full object-contain md:ml-auto md:mr-0 md:h-[300px] lg:h-[340px]"
                        />
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-4 flex max-w-[1072px] items-center px-3">
                <ul className="mx-auto flex list-none flex-row items-center gap-3">
                    {HERO_SLIDES.map((item, itemIndex) => {
                        const isCurrent = itemIndex === index;

                        return (
                            <li key={item.id} className="flex">
                                <button
                                    type="button"
                                    aria-current={isCurrent}
                                    aria-label={`Show slide ${itemIndex + 1}: ${item.title} ${item.emphasis}`}
                                    onClick={() => goTo(itemIndex)}
                                    className={`h-2 w-2 rounded-full border border-solid border-apple-text outline-none transition-colors duration-200 ease-smooth focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 ${isCurrent ? 'bg-apple-text' : 'bg-transparent hover:bg-apple-text/40'}`}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="sr-only" role="status">{`${index + 1} / ${count}`}</div>
        </section>
    );
};

export default HeroCarousel;
