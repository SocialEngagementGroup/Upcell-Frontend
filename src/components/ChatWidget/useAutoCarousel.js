import { useEffect, useRef } from 'react';

// Shared mechanics for the widget's horizontal carousels (category shortcuts,
// latest-iPhones): auto-advances one full slide at a time, supports desktop
// mouse-drag-to-scroll, and lets native touch swipe pass through untouched.
// Pauses on hover/focus/touch/drag and skips entirely for prefers-reduced-motion.
export const useAutoCarousel = ({ active, intervalMs = 2200 }) => {
    const trackRef = useRef(null);
    const pausedRef = useRef(false);
    const draggingRef = useRef(false);
    const dragStartXRef = useRef(0);
    const dragStartScrollRef = useRef(0);
    const didDragRef = useRef(false);

    useEffect(() => {
        if (!active) return undefined;
        const track = trackRef.current;
        if (!track) return undefined;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

        const intervalId = setInterval(() => {
            if (pausedRef.current) return;
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (maxScroll <= 0) return;
            const next = track.scrollLeft + track.clientWidth;
            track.scrollTo({ left: next > maxScroll - 2 ? 0 : next, behavior: 'smooth' });
        }, intervalMs);

        return () => clearInterval(intervalId);
    }, [active, intervalMs]);

    const handleMouseDown = (event) => {
        draggingRef.current = true;
        didDragRef.current = false;
        pausedRef.current = true;
        dragStartXRef.current = event.clientX;
        dragStartScrollRef.current = trackRef.current.scrollLeft;
    };

    const handleMouseMove = (event) => {
        if (!draggingRef.current) return;
        const delta = event.clientX - dragStartXRef.current;
        if (Math.abs(delta) > 5) didDragRef.current = true;
        trackRef.current.scrollLeft = dragStartScrollRef.current - delta;
    };

    const endDrag = () => {
        draggingRef.current = false;
        pausedRef.current = false;
    };

    const pause = () => { pausedRef.current = true; };
    const resume = () => { pausedRef.current = false; };

    const trackHandlers = {
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: endDrag,
        onMouseLeave: endDrag,
        onTouchStart: pause,
        onTouchEnd: resume,
        onFocus: pause,
        onBlur: resume,
    };

    const handleLinkClick = (onNavigate) => (event) => {
        if (didDragRef.current) {
            event.preventDefault();
            return;
        }
        onNavigate?.();
    };

    return { trackRef, trackHandlers, handleLinkClick };
};
