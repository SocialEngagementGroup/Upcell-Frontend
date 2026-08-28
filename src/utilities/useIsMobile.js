import { useEffect, useState } from 'react';

// True below Tailwind's `md` breakpoint, which is where the mobile home page
// takes over from the desktop one.
//
// matchMedia rather than a resize listener: the browser only re-evaluates when
// the query's answer actually changes, so this does not fire on every pixel of
// a drag. The initial read happens during the first render, so the correct
// tree mounts straight away instead of the desktop one flashing first.
const QUERY = '(max-width: 767px)';

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => (
        typeof window !== 'undefined' && typeof window.matchMedia === 'function'
            ? window.matchMedia(QUERY).matches
            : false
    ));

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;

        const list = window.matchMedia(QUERY);
        const handleChange = (event) => setIsMobile(event.matches);

        // Re-read on mount: the viewport can have changed between the first
        // render and this effect running.
        setIsMobile(list.matches);

        list.addEventListener('change', handleChange);
        return () => list.removeEventListener('change', handleChange);
    }, []);

    return isMobile;
};

export default useIsMobile;
