import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchWithSuggestions from '../../../components/SearchWithSuggestions/SearchWithSuggestions';
import { useProductsQuery } from '../../../queries/products';
import { EMPTY_ARRAY } from '../../../queries/keys';
import useDebouncedValue from '../../../utilities/useDebouncedValue';
import { shopSearchPath } from './navigationData';

const MIN_CHARS = 2;
const MAX_SUGGESTIONS = 8;

// Wraps the shared SearchWithSuggestions rather than reimplementing it, so the
// header, the shop page and Admin all behave identically (click-outside,
// Escape, arrow keys). Everything here is the header's own concern: when to
// fetch, what a suggestion looks like, and where selecting one goes.
const HeaderSearch = ({ className = '' }) => {
    const navigate = useNavigate();
    const [term, setTerm] = useState('');
    const debouncedTerm = useDebouncedValue(term, 250);
    const wrapRef = useRef(null);

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

    return (
        <form
            role="search"
            aria-label="Search products"
            onSubmit={handleSubmit}
            ref={wrapRef}
            className={`header-search ${className}`}
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
                inputClassName="!h-11 !text-[14px] !font-medium md:!h-10"
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
