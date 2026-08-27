import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import UtilityBar from './UtilityBar';
import PrimaryBar from './PrimaryBar';
import CategoryBar from './CategoryBar';
import MegaMenu from './MegaMenu';
import MobileDrawer from './MobileDrawer';
import SearchMegaPanel from './SearchMegaPanel';
import useHeaderNav from './useHeaderNav';
import { CATEGORY_NAV } from './navigationData';
import { useProductsQuery } from '../../../queries/products';
import { EMPTY_ARRAY } from '../../../queries/keys';
import useDebouncedValue from '../../../utilities/useDebouncedValue';

const MIN_CHARS = 2;
const MAX_SUGGESTIONS = 8;

// Storefront header: a sticky three-row shell with integrated search mega-panel.
//
//   row 1  utility links          md and up, 32px
//   row 2  logo / search / actions  56 -> 64 -> 72px
//   row 3  categories + mega menu (or SearchMegaPanel when search is active)
//
// The header is sticky rather than fixed, so it occupies flow space and the
// page below needs no compensating top padding. When search opens, the header
// expands downward naturally, shifting the hero down smoothly in normal flow.
const HeaderComponent = () => {
    const headerRef = useRef(null);
    const searchInputRef = useRef(null);
    const navigate = useNavigate();

    const {
        openPanelId,
        isDrawerOpen,
        isSearchOpen,
        navRef,
        menuButtonRef,
        openSearch,
        closeSearch,
        openPanel,
        closePanel,
        togglePanel,
        registerTrigger,
        openDrawer,
        closeDrawer,
    } = useHeaderNav({ headerRef });

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedTerm = useDebouncedValue(searchTerm, 250);

    const activeItem = !isSearchOpen && CATEGORY_NAV.find((item) => item.id === openPanelId && item.panel);

    const trimmed = debouncedTerm.trim();
    const shouldSearch = trimmed.length >= MIN_CHARS;

    const { data: products = EMPTY_ARRAY, isFetching } = useProductsQuery({
        enabled: shouldSearch,
    });

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

    const handleSelectSuggestion = (suggestion) => {
        closeSearch();
        navigate(`/iphone/${suggestion.parentCatagory}/${suggestion._id}`);
    };

    useLayoutEffect(() => {
        const node = headerRef.current;
        if (!node) return undefined;

        const publish = () => {
            const { height } = node.getBoundingClientRect();
            if (!height) return;
            document.documentElement.style.setProperty('--app-header-height', `${Math.round(height)}px`);
        };

        publish();

        const timers = [setTimeout(publish, 0), setTimeout(publish, 300)];
        document.fonts?.ready.then(publish).catch(() => {});

        window.addEventListener('resize', publish);

        const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(publish);
        observer?.observe(node);

        return () => {
            timers.forEach(clearTimeout);
            window.removeEventListener('resize', publish);
            observer?.disconnect();
        };
    }, [isSearchOpen, openPanelId]);

    return (
        <>
            <header ref={headerRef} className="sticky top-0 z-50 bg-white">
                <UtilityBar />

                <PrimaryBar
                    menuButtonRef={menuButtonRef}
                    onOpenDrawer={openDrawer}
                    isDrawerOpen={isDrawerOpen}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    isSearchOpen={isSearchOpen}
                    onOpenSearch={openSearch}
                    onCloseSearch={closeSearch}
                    searchInputRef={searchInputRef}
                />

                {/* When Search is active: render full-width SearchMegaPanel */}
                {isSearchOpen ? (
                    <SearchMegaPanel
                        searchTerm={searchTerm}
                        onClose={closeSearch}
                        suggestions={suggestions}
                        isLoading={isFetching}
                        onSelectSuggestion={handleSelectSuggestion}
                    />
                ) : (
                    /* Normal Row 3: CategoryBar + MegaMenu */
                    <div ref={navRef} className="relative hidden md:block">
                        <CategoryBar
                            openPanelId={openPanelId}
                            registerTrigger={registerTrigger}
                            onTriggerEnter={(id) => openPanel(id)}
                            onTriggerLeave={() => closePanel()}
                            onTriggerToggle={togglePanel}
                            onOpenPanel={openPanel}
                            onClosePanel={closePanel}
                        />

                        {activeItem && (
                            <MegaMenu
                                panel={activeItem.panel}
                                onPointerEnter={() => openPanel(activeItem.id, { immediate: true })}
                                onPointerLeave={() => closePanel()}
                            />
                        )}
                    </div>
                )}
            </header>

            {/* Dims the page behind an open panel or search */}
            {(activeItem || isSearchOpen) && (
                <div
                    aria-hidden="true"
                    onClick={() => {
                        if (activeItem) closePanel({ immediate: true });
                        if (isSearchOpen) closeSearch();
                    }}
                    className="fixed inset-0 z-40 hidden bg-apple-text/20 md:block"
                />
            )}

            <MobileDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
        </>
    );
};

export default HeaderComponent;
