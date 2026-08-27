import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import { cloudinaryUrl } from '../../utilities/cloudinary';
import {
    MODEL_GROUPS_BY_FAMILY,
    MODEL_GROUP_IMAGES,
    shopModelPath,
} from '../layout/Header/navigationData';

// The rail under the hero. This is where the arrows live in the reference —
// the hero itself carries only dots.
//
// It is a scroller rather than a slider: no slide index, no autoplay, just
// overflow with the arrows nudging scrollLeft. That keeps trackpad and touch
// swiping working for free, and it degrades to a plain scrollable row if the
// script never runs.
//
// Items are the ten model groups, reusing the header's art map so a device
// shown here and in the mega menu is always the same shot.
const ITEMS = [
    { id: 'deals', label: 'Great deals', to: '/shop', image: MODEL_GROUP_IMAGES['iPhone Pro'] },
    ...Object.entries(MODEL_GROUPS_BY_FAMILY).flatMap(([family, groups]) => (
        groups.map((modelGroup) => ({
            id: `${family}-${modelGroup}`,
            label: modelGroup,
            to: shopModelPath(family, modelGroup),
            image: MODEL_GROUP_IMAGES[modelGroup],
        }))
    )),
];

const MostWanted = () => {
    const trackRef = useRef(null);
    const [canScrollBack, setCanScrollBack] = useState(false);
    const [canScrollOn, setCanScrollOn] = useState(true);

    // A one-pixel tolerance: sub-pixel layout means scrollLeft rarely lands
    // exactly on the maximum, which would leave the forward arrow enabled
    // forever at the end of the rail.
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
        node.scrollBy({ left: direction * Math.round(node.clientWidth * 0.8), behavior: 'smooth' });
    };

    const arrowClass = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-none outline-none transition-colors duration-200 ease-smooth focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-surface [&_svg]:!text-[22px]';
    const arrowTone = (enabled) => (enabled
        ? 'bg-apple-text text-white hover:bg-black cursor-pointer'
        : 'bg-apple-bg text-apple-gray cursor-not-allowed');

    return (
        <section aria-labelledby="most-wanted-heading" className="bg-surface py-10 md:py-12">
            <div className="site-shell">
                <div className="flex items-center justify-between gap-4">
                    <h2 id="most-wanted-heading" className="text-[1.125rem] font-bold tracking-[-0.01em] text-apple-text md:text-[1.25rem]">
                        Shop our most wanted
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

                {/* -mx / px pair so the first and last item can sit flush with
                    the heading above while still scrolling clear of the edge. */}
                <ul
                    ref={trackRef}
                    onScroll={sync}
                    className="scrollbar-hidden -mx-2 mt-6 flex list-none gap-2 overflow-x-auto scroll-smooth px-2"
                >
                    {ITEMS.map((item) => (
                        <li key={item.id} className="shrink-0">
                            <Link
                                to={item.to}
                                className="group flex w-[132px] flex-col items-center gap-3 rounded-2xl px-2 py-3 outline-none transition-colors duration-200 ease-smooth hover:bg-white focus-visible:ring-2 focus-visible:ring-brand-red md:w-[150px]"
                            >
                                <img
                                    src={cloudinaryUrl(item.image, { width: 260 })}
                                    alt=""
                                    width="260"
                                    height="260"
                                    loading="lazy"
                                    decoding="async"
                                    className="block h-[84px] w-auto object-contain transition-transform duration-300 ease-smooth group-hover:scale-105 md:h-[96px]"
                                />
                                <span className="text-center text-[0.875rem] font-bold leading-tight text-apple-text group-hover:text-brand-red">
                                    {item.label}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default MostWanted;
