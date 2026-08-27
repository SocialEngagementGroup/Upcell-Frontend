import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import { cloudinaryUrl } from '../../utilities/cloudinary';
import { HERO_INTERVAL, HERO_SLIDES, HERO_THEMES } from './heroSlides';

// The home hero. One slide is mounted at a time and re-keyed on change, so the
// fade runs on mount and the DOM never holds four copies of the headline —
// which also keeps a single <h1> on the page.
//
// Autoplay stops while a pointer is over the carousel, while focus is inside
// it, and entirely when the visitor asks for reduced motion. A carousel that
// moves under someone reading it is the usual complaint about this pattern.
const HeroCarousel = () => {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);
    const regionRef = useRef(null);

    const count = HERO_SLIDES.length;
    const slide = HERO_SLIDES[index];
    const theme = HERO_THEMES[slide.theme];

    const goTo = useCallback((next) => setIndex(((next % count) + count) % count), [count]);
    const next = useCallback(() => goTo(index + 1), [goTo, index]);
    const previous = useCallback(() => goTo(index - 1), [goTo, index]);

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

    // Left/right arrows move the carousel when focus is inside it, which is
    // what a person expects once they have tabbed to the controls.
    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); previous(); }
    };

    const controlClass = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-none bg-apple-text text-white outline-none transition-colors duration-200 ease-smooth hover:bg-black focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white [&_svg]:!text-[24px]';

    return (
        <section
            ref={regionRef}
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
                className={`hero-fade ${theme.band}`}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
            >
                <div className="mx-auto flex max-w-[125rem] flex-col items-center gap-6 px-[4%] py-10 md:min-h-[360px] md:flex-row md:gap-10 md:py-12">
                    <div className="order-2 w-full text-center md:order-1 md:w-1/2 md:text-left">
                        <p className={`text-[0.75rem] font-bold uppercase tracking-[0.16em] ${theme.eyebrow}`}>
                            {slide.eyebrow}
                        </p>

                        {/* font-bold, not the base layer's extrabold: Roboto is
                            loaded at 400/500/700 only, so 800 would silently
                            resolve to 700 anyway. */}
                        <h1 className={`mt-3 text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] md:text-[2.75rem] lg:text-[3.25rem] ${theme.title}`}>
                            {slide.title}
                            <span className="block italic">{slide.emphasis}</span>
                        </h1>

                        <p className={`mx-auto mt-4 max-w-[46ch] text-[0.9375rem] font-normal leading-relaxed md:mx-0 ${theme.copy}`}>
                            {slide.copy}
                        </p>

                        <Link
                            to={slide.cta.to}
                            className={`mt-7 inline-flex h-12 items-center rounded-full px-7 text-[0.9375rem] font-bold outline-none transition-colors duration-200 ease-smooth focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 ${theme.cta}`}
                        >
                            {slide.cta.label}
                        </Link>
                    </div>

                    <div className="order-1 w-full md:order-2 md:w-1/2">
                        <img
                            src={cloudinaryUrl(slide.image, { width: 900 })}
                            alt=""
                            width="900"
                            height="600"
                            loading={index === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            className="mx-auto block h-[180px] w-auto max-w-full object-contain md:h-[280px] lg:h-[320px]"
                        />
                    </div>
                </div>
            </div>

            {/* Controls sit under the band on the reference's narrower track —
                deliberately not the band's own width, which is why the dots sit
                further in than the headline above them. Dots centred on mobile,
                pushed left beside the arrows from md. */}
            <div className="mx-auto mt-4 flex max-w-[1072px] items-center px-3">
                <ul className="mx-auto flex list-none flex-row items-center gap-3 md:mx-0">
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

                <div className="ml-auto hidden items-center gap-3 md:flex">
                    <button type="button" onClick={previous} aria-label="Previous slide" className={controlClass}>
                        <ChevronLeftRoundedIcon aria-hidden="true" />
                    </button>
                    <button type="button" onClick={next} aria-label="Next slide" className={controlClass}>
                        <ChevronRightRoundedIcon aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="sr-only" role="status">{`${index + 1} / ${count}`}</div>
        </section>
    );
};

export default HeroCarousel;
