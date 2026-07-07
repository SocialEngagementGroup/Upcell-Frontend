import { useEffect, useState } from 'react';

// Returns `value` only after it has stopped changing for `delay` ms.
// Used to throttle the search term that feeds the TanStack Query key,
// so we don't fire a request on every keystroke.
export default function useDebouncedValue(value, delay = 250) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
