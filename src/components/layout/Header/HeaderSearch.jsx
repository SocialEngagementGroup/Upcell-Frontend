import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchWithSuggestions from '../../../components/SearchWithSuggestions/SearchWithSuggestions';
import { useProductsQuery } from '../../../queries/products';
import { EMPTY_ARRAY } from '../../../queries/keys';
import useDebouncedValue from '../../../utilities/useDebouncedValue';
import {
    POPULAR_SEARCHES,
    SEARCH_PLACEHOLDER_INTERVAL,
    SEARCH_PLACEHOLDER_WORDS,
    shopSearchPath,
} from './navigationData';

const MIN_CHARS = 2;
const MAX_SUGGESTIONS = 8;

// Wraps the shared SearchWithSuggestions rather than reimplementing it, so the
// header, the shop page and Admin all behave identically (click-outside,
// Escape, arrow keys). Everything here is the header's own concern: when to
// fetch, what a suggestion looks like, and where selecting one goes.
const HeaderSearch = ({ className = '' }) => {
    const navigate = useNavigate();
    const [term, setTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const debouncedTerm = useDebouncedValue(term, 250);
    const wrapRef = useRef(null);

    // The resting placeholder is an overlay, not the input's own placeholder
    // text, because a placeholder attribute cannot be animated. The real
    // placeholder stays set for the accessible name and is painted
    // transparent. Both are hidden the moment the field is used.
    const showPlaceholder = !isFocused && term === '';
    const showPopular = isFocused && term.trim() === '';

    useEffect(() => {
        if (!showPlaceholder) return undefined;
        const id = setInterval(
            () => setWordIndex((current) => (current + 1) % SEARCH_PLACEHOLDER_WORDS.length),
            SEARCH_PLACEHOLDER_INTERVAL,
        );
        return () => clearInterval(id);
    }, [showPlaceholder]);

    const trimmed = debouncedTerm.trim();
    const shouldSearch = trimmed.length >= MIN_CHARS;

    // The catalogue is only pulled once the user actually starts typing.
    // Fetching it on every page load would put a request behind every route
    // just to power a box most visits never touch.
    const { data: products = EMPTY_ARRAY, isFetching } = useProductsQuery({
        enabled: shouldSearch,
    });

    // The dropdown goes full-bleed under the bar on mobile, which means
    // position: fixed and therefore a real viewport offset. Measured from the
    // search line itself so it stays correct across the three bar heights.
    useEffect(() => {
        const update = () => {
            const node = wrapRef.current;
            if (!node) return;
            const bottom = node.getBoundingClientRect().bottom;
            node.style.setProperty('--header-suggest-top', `${Math.round(bottom + 8)}px`);
        };

        update();
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, { passive: true });
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update);
        };
    }, []);

    // One row per product family (cheapest in-stock variant wins), so a search
    // for "iphone 15" does not return the same phone eight times in eight
    // colours.
    const suggestions = useMemo(() => {
        if (!shouldSearch) return EMPTY_ARRAY;

        const needle = trimmed.toLowerCase();
        const byParent = new Map();

        for (const product of products) {
            const name = (product.productName || '').toLowerCase();
            const category = (product.categoryName || '').toLowerCase();
            if (!name.includes(needle) && !category.includes(needle)) continue;

            const key = String(product.parentCatagory || product.parentId || '');
            if (!key) continue;

            const existing = byParent.get(key);
            if (!existing) {
                byParent.set(key, product);
                continue;
            }

            const isBetter = (!product.outOfStock && existing.outOfStock)
                || (product.outOfStock === existing.outOfStock
                    && Number(product.price || 0) < Number(existing.price || 0));

            if (isBetter) byParent.set(key, product);
        }

        return Array.from(byParent.values())
            .sort((left, right) => Number(left.price || 0) - Number(right.price || 0))
            .slice(0, MAX_SUGGESTIONS)
            .map((product) => ({
                _id: product._id,
                parentCatagory: product.parentCatagory || product.parentId,
                productName: product.productName,
                categoryName: product.categoryName,
                price: product.price,
            }));
    }, [products, shouldSearch, trimmed]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const query = term.trim();
        if (!query) return;
        navigate(shopSearchPath(query));
    };

    // focus/blur bubble, so one pair on the form covers the input and every
    // button inside the panel. The relatedTarget check keeps the panel open
    // while focus moves between them.
    const handleBlur = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false);
    };

    return (
        <form
            role="search"
            aria-label="Search products"
            onSubmit={handleSubmit}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onKeyDown={(event) => { if (event.key === 'Escape') setIsFocused(false); }}
            ref={wrapRef}
            className={`header-search relative ${className}`}
        >
            {/* No wrapping <label>: SearchWithSuggestions renders its
                suggestion list as sibling <button>s, and a label would forward
                clicks on those back to the input. The search landmark above
                names the region, and the placeholder names the field. */}
            <SearchWithSuggestions
                value={term}
                onChange={setTerm}
                placeholder="Search iPhone, iPad, MacBook"
                suggestions={suggestions}
                isLoading={isFetching}
                minChars={MIN_CHARS}
                onSelect={(suggestion) => navigate(`/iphone/${suggestion.parentCatagory}/${suggestion._id}`)}
                getSuggestionKey={(suggestion) => suggestion._id}
                inputClassName="!h-11 !border-transparent !bg-surface-alt !text-[14px] !font-medium placeholder:!text-transparent md:!h-10"
                renderSuggestion={(suggestion, focused) => (
                    <>
                        <span className={`min-w-0 flex-1 truncate text-[13px] font-bold ${focused ? 'text-white' : 'text-apple-text'}`}>
                            {suggestion.productName}
                        </span>
                        <span className={`shrink-0 text-[12px] font-medium ${focused ? 'text-white' : 'text-apple-gray'}`}>
                            ${suggestion.price}
                        </span>
                    </>
                )}
            />

            {showPlaceholder && (
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-12 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap text-[14px] font-medium text-apple-gray"
                >
                    Search for
                    {/* The key restarts the sweep each time the word changes. */}
                    <span key={wordIndex} className="gradient-reveal font-bold">
                        {SEARCH_PLACEHOLDER_WORDS[wordIndex]}
                    </span>
                </span>
            )}

            {showPopular && (
                <div className="popular-panel absolute left-0 right-0 z-30 overflow-hidden border border-black/10 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
                    <p id="header-popular-label" className="px-4 pt-4 text-[13px] font-medium text-apple-gray">
                        Popular searches
                    </p>
                    <ul aria-labelledby="header-popular-label" className="py-2">
                        {POPULAR_SEARCHES.map((item) => (
                            <li key={item.label}>
                                {/* onMouseDown is where the navigation is
                                    cancelled from: without it the field blurs
                                    on press, the panel unmounts, and the click
                                    never lands on anything. */}
                                <button
                                    type="button"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => { setIsFocused(false); navigate(item.to); }}
                                    className="flex min-h-[44px] w-full items-center px-4 text-left text-[15px] font-bold text-apple-text outline-none transition-colors duration-200 ease-smooth hover:bg-apple-bg focus-visible:bg-apple-bg"
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* An explicit submit button so Enter reliably runs the search.
                Implicit submission on a lone type="search" field is not
                dependable, and there is nowhere in the bar to put a visible
                button without crowding the field. Out of the tab order because
                Enter from the field already does the same thing. */}
            <button type="submit" tabIndex={-1} aria-hidden="true" className="sr-only">
                Search
            </button>
        </form>
    );
};

export default HeaderSearch;
