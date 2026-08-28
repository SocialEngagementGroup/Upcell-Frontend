import { useCallback, useEffect, useRef, useState } from 'react';

// The scroll behaviour every rail on this page shares: a horizontally
// overflowing track, plus two arrows that nudge it and disable themselves at
// either end.
//
// A scroller rather than a slider — no slide index, no autoplay. Trackpad and
// touch swiping work for free, and it degrades to a plain scrollable row if the
// script never runs.
//
// `resetKey` re-measures when the contents change: switching the brand panel to
// another brand swaps the whole track, and without this the arrows would still
// describe the previous set.
export const useRailScroll = (resetKey) => {
    const trackRef = useRef(null);
    const [canScrollBack, setCanScrollBack] = useState(false);
    const [canScrollOn, setCanScrollOn] = useState(false);

    // A one-pixel tolerance: sub-pixel layout means scrollLeft rarely lands
    // exactly on the maximum, which would leave the forward arrow enabled at
    // the end of the rail forever.
    const sync = useCallback(() => {
        const node = trackRef.current;
        if (!node) return;
        const max = node.scrollWidth - node.clientWidth;
        setCanScrollBack(node.scrollLeft > 1);
        setCanScrollOn(node.scrollLeft < max - 1);
    }, []);

    useEffect(() => {
        const node = trackRef.current;
        if (node) node.scrollLeft = 0;
        sync();
        window.addEventListener('resize', sync);
        return () => window.removeEventListener('resize', sync);
    }, [sync, resetKey]);

    const nudge = (direction) => {
        const node = trackRef.current;
        if (!node) return;
        node.scrollBy({ left: direction * Math.round(node.clientWidth * 0.9), behavior: 'smooth' });
    };

    return { trackRef, canScrollBack, canScrollOn, sync, nudge };
};

// Shared arrow styling, so the arrows in the brand panel are the same object as
// the arrows on every other rail.
export const RAIL_ARROW_CLASS = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-none outline-none transition-colors duration-200 ease-smooth focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 [&_svg]:!text-[22px]';

export const railArrowTone = (enabled) => (enabled
    ? 'bg-apple-text text-white hover:bg-black cursor-pointer'
    : 'bg-apple-bg text-apple-gray cursor-not-allowed');
