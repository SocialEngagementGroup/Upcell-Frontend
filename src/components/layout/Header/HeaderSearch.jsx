import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import {
    SEARCH_PLACEHOLDER_INTERVAL,
    SEARCH_PLACEHOLDER_WORDS,
    shopSearchPath,
} from './navigationData';

// Main search input in PrimaryBar.
// Pill-shaped, light gray background, search icon on left.
// Focusing or clicking opens the SearchMegaPanel in the header.
const HeaderSearch = ({
    className = '',
    searchTerm = '',
    onSearchChange,
    isSearchOpen = false,
    onOpenSearch,
    onCloseSearch,
    inputRef,
}) => {
    const navigate = useNavigate();
    const [wordIndex, setWordIndex] = useState(0);

    const showPlaceholder = !isSearchOpen && searchTerm === '';

    useEffect(() => {
        if (!showPlaceholder) return undefined;
        const id = setInterval(
            () => setWordIndex((current) => (current + 1) % SEARCH_PLACEHOLDER_WORDS.length),
            SEARCH_PLACEHOLDER_INTERVAL,
        );
        return () => clearInterval(id);
    }, [showPlaceholder]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const query = searchTerm.trim();
        if (!query) return;
        onCloseSearch?.();
        navigate(shopSearchPath(query));
    };

    const handleClear = (event) => {
        event.stopPropagation();
        onSearchChange?.('');
        inputRef?.current?.focus();
    };

    return (
        <form
            role="search"
            aria-label="Search products"
            onSubmit={handleSubmit}
            className={`header-search relative ${className}`}
        >
            <div className="relative flex w-full items-center">
                <SearchRoundedIcon
                    className="pointer-events-none absolute left-3.5 top-1/2 !text-[20px] -translate-y-1/2 text-apple-gray"
                    aria-hidden="true"
                />

                <input
                    ref={inputRef}
                    type="search"
                    value={searchTerm}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    onFocus={() => onOpenSearch?.()}
                    onClick={() => onOpenSearch?.()}
                    placeholder="Search iPhone, iPad, MacBook"
                    autoComplete="off"
                    className="h-10 w-full rounded-full border border-transparent bg-surface pl-10 pr-9 text-[14px] font-medium text-apple-text outline-none transition-all placeholder:font-medium placeholder:text-transparent focus:border-apple-text/20 focus:bg-white focus:shadow-[0_0_0_3px_rgba(29,29,31,0.05)] md:h-10"
                />

                {showPlaceholder && (
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-10 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap text-[14px] font-medium text-apple-gray"
                    >
                        Search for
                        <span key={wordIndex} className="gradient-reveal font-bold">
                            {SEARCH_PLACEHOLDER_WORDS[wordIndex]}
                        </span>
                    </span>
                )}

                {searchTerm && (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="Clear search"
                        className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-apple-gray outline-none transition-colors hover:bg-black/10 hover:text-apple-text focus-visible:ring-1 focus-visible:ring-brand-red [&_svg]:!text-[14px]"
                    >
                        <CloseRoundedIcon aria-hidden="true" />
                    </button>
                )}
            </div>

            <button type="submit" tabIndex={-1} aria-hidden="true" className="sr-only">
                Search
            </button>
        </form>
    );
};

export default HeaderSearch;
