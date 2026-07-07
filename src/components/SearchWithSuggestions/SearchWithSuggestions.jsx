import { useEffect, useRef, useState } from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

/**
 * Shared search box + suggestion dropdown used across Admin Products, Admin
 * Categories, and the Shop page, so search UI looks and behaves identically
 * everywhere instead of each page reimplementing its own version.
 */
const SearchWithSuggestions = ({
    value,
    onChange,
    placeholder = 'Search',
    suggestions = [],
    isLoading = false,
    minChars = 2,
    onSelect,
    renderSuggestion,
    getSuggestionKey = (item, index) => item?._id ?? index,
    className = '',
    inputClassName = '',
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef(null);
    const scrollRef = useRef(null);

    const showSuggestions = isFocused && value.trim().length >= minChars;

    useEffect(() => {
        setFocusedIndex(-1);
    }, [value]);

    useEffect(() => {
        if (!isFocused) return undefined;
        const handlePointerDown = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handlePointerDown);
        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [isFocused]);

    useEffect(() => {
        if (focusedIndex >= 0 && scrollRef.current) {
            const focusedEl = scrollRef.current.children[focusedIndex];
            focusedEl?.scrollIntoView({ block: 'nearest' });
        }
    }, [focusedIndex]);

    const handleSelect = (suggestion) => {
        onSelect?.(suggestion);
        setIsFocused(false);
    };

    const handleKeyDown = (event) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setFocusedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (event.key === 'Enter') {
            if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
                event.preventDefault();
                handleSelect(suggestions[focusedIndex]);
            }
        } else if (event.key === 'Escape') {
            setIsFocused(false);
        }
    };

    return (
        <div ref={containerRef} className={`relative block w-full ${className}`}>
            <SearchRoundedIcon className="pointer-events-none absolute left-4 top-1/2 !text-[20px] -translate-y-1/2 text-apple-gray" />
            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onFocus={() => setIsFocused(true)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                autoComplete="off"
                className={`h-12 w-full rounded-full border border-black/[0.08] bg-white pl-12 pr-4 text-sm font-bold text-apple-text outline-none transition-all placeholder:font-medium placeholder:text-apple-gray focus:border-apple-text/20 focus:shadow-[0_0_0_4px_rgba(29,29,31,0.05)] ${inputClassName}`}
            />

            {showSuggestions && (
                <div className="suggest-dropdown absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-[15px] border border-black/10 bg-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur">
                    <div ref={scrollRef} className="suggest-scroll max-h-[400px] overflow-y-auto">
                        {suggestions.length > 0 ? (
                            suggestions.map((suggestion, index) => {
                                const focused = index === focusedIndex;
                                return (
                                    <button
                                        key={getSuggestionKey(suggestion, index)}
                                        type="button"
                                        onClick={() => handleSelect(suggestion)}
                                        onMouseEnter={() => setFocusedIndex(index)}
                                        className={`flex w-full items-center gap-3 border-b border-solid border-[#ededed] px-4 py-3 text-left transition-all duration-150 last:border-b-0 ${focused ? 'bg-[#d90b0f]' : 'hover:bg-[#d90b0f]'}`}
                                    >
                                        {renderSuggestion(suggestion, focused)}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-4 py-3 text-sm text-apple-gray">
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="font-bold text-apple-text">Searching</span>
                                        <span className="flex items-center gap-1">
                                            {[0, 150, 300].map((delay) => (
                                                <span
                                                    key={delay}
                                                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-red"
                                                    style={{ animationDelay: `${delay}ms` }}
                                                />
                                            ))}
                                        </span>
                                    </span>
                                ) : (
                                    `No matches for "${value.trim()}"`
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchWithSuggestions;
