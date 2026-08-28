import { useCallback, useEffect, useRef, useState } from 'react';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarHalfRoundedIcon from '@mui/icons-material/StarHalfRounded';

import { cloudinaryUrl } from '../../utilities/cloudinary';
import { DEMO_REVIEWS } from './reviewsDemo';

// Customer reviews rail. Used on the home page and again on the shop page,
// where the reference puts the same rail under a customer-count heading.
//
// The heading is a prop, but no default here carries a count. The reference
// says "Over 15M customers globally"; that is their number, and putting a
// figure like it on UpCell would be a claim nobody could stand behind. Pass a
// real figure once there is one to count.
//
// Everything rendered is demo content — see reviewsDemo.js.
const Reviews = ({
    heading = 'Don’t just take our word for it',
    id = 'reviews',
    className = 'pb-10 md:pb-12',
}) => {
    const trackRef = useRef(null);
    const [canScrollBack, setCanScrollBack] = useState(false);
    const [canScrollOn, setCanScrollOn] = useState(true);

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
    }, [sync]);

    const nudge = (direction) => {
        const node = trackRef.current;
        if (!node) return;
        node.scrollBy({ left: direction * Math.round(node.clientWidth * 0.9), behavior: 'smooth' });
    };

    const arrowClass = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-none outline-none transition-colors duration-200 ease-smooth focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 [&_svg]:!text-[22px]';
    const arrowTone = (enabled) => (enabled
        ? 'bg-apple-text text-white hover:bg-black cursor-pointer'
        : 'bg-apple-bg text-apple-gray cursor-not-allowed');

    return (
        <section id={id} aria-labelledby={`${id}-heading`} className={`scroll-mt-32 ${className}`}>
            <div className="site-shell">
                <div className="flex items-center justify-between gap-4">
                    <h2 id={`${id}-heading`} className="text-[1.625rem] font-bold tracking-[-0.02em] text-apple-text md:text-[2rem]">
                        {heading}
                    </h2>

                    <div className="hidden items-center gap-3 md:flex">
                        <button
                            type="button"
                            onClick={() => nudge(-1)}
                            disabled={!canScrollBack}
                            aria-label="Scroll left"
                            className={`${arrowClass} ${arrowTone(canScrollBack)}`}
                        >
                            <ChevronLeftRoundedIcon aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => nudge(1)}
                            disabled={!canScrollOn}
                            aria-label="Scroll right"
                            className={`${arrowClass} ${arrowTone(canScrollOn)}`}
                        >
                            <ChevronRightRoundedIcon aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <ul
                    ref={trackRef}
                    onScroll={sync}
                    className="scrollbar-hidden -mx-1 mt-5 flex list-none items-stretch gap-4 overflow-x-auto scroll-smooth px-1 pb-1"
                >
                    {DEMO_REVIEWS.map((review) => (
                        <li key={review.id} className="flex">
                            <figure className="flex w-[260px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-surface md:w-[280px]">
                                {/* The photo is the card: it fills this block
                                    and the quote sits on top of it, as in the
                                    reference. Our shots are cut-outs on white,
                                    so a gradient scrim runs the full height —
                                    heavy at the bottom where the white type
                                    goes, light at the top so the device still
                                    reads. */}
                                <div className="relative aspect-[5/8] w-full overflow-hidden bg-apple-text">
                                    <img
                                        src={cloudinaryUrl(review.image, { width: 620 })}
                                        alt=""
                                        width="620"
                                        height="820"
                                        loading="lazy"
                                        decoding="async"
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />

                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-0 bg-gradient-to-t from-apple-text via-apple-text/60 to-apple-text/20"
                                    />

                                    <figcaption className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[0.875rem] font-bold text-apple-text shadow-sm">
                                        {review.name}
                                    </figcaption>

                                    <blockquote className="absolute inset-x-0 bottom-0 p-4">
                                        <p className="text-[1rem] font-normal leading-snug text-white">
                                            &ldquo;{review.quote}&rdquo;
                                        </p>

                                        <span className="mt-3 flex items-center gap-1.5">
                                            <span aria-hidden="true" className="flex items-center text-white [&_svg]:!text-[16px]">
                                                {[0, 1, 2, 3, 4].map((i) => (
                                                    review.score - i >= 0.75
                                                        ? <StarRoundedIcon key={i} />
                                                        : <StarHalfRoundedIcon key={i} />
                                                ))}
                                            </span>
                                            <span className="text-[0.9375rem] font-medium text-white">{review.score}/5</span>
                                        </span>
                                    </blockquote>
                                </div>

                                {/* Second row, two columns: the product bought,
                                    thumbnail beside its name. */}
                                <div className="flex items-center gap-3 bg-surface px-4 py-3">
                                    <img
                                        src={cloudinaryUrl(review.image, { width: 140 })}
                                        alt=""
                                        width="140"
                                        height="140"
                                        loading="lazy"
                                        decoding="async"
                                        className="block h-10 w-10 shrink-0 object-contain"
                                    />
                                    <p className="text-[0.875rem] font-normal leading-tight text-ink-soft">
                                        {review.productName}
                                    </p>
                                </div>
                            </figure>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Reviews;
