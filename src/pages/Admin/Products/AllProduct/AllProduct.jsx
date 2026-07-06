import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../utilities/axiosInstance';
import { useSearchParams } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SingleProductGroup from '../AdminSingleProduct/SingleProductGroup';
import AdminPageHeader from '../../../../components/AdminPageHeader/AdminPageHeader';
import AdminStatsGrid from '../../../../components/AdminStatsGrid/AdminStatsGrid';
import AdminPagination from '../../../../components/AdminPagination/AdminPagination';
import AdminLoadingState from '../../../../components/AdminState/AdminLoadingState';
import AdminEmptyState from '../../../../components/AdminState/AdminEmptyState';

const familyOrder = ['iPhone', 'iPad', 'MacBook'];
const PRODUCTS_PER_PAGE = 10;

const inferFamily = (productName = '', categoryName = '') => {
    const text = `${productName} ${categoryName}`.toLowerCase();
    if (text.includes('iphone')) return 'iPhone';
    if (text.includes('ipad')) return 'iPad';
    if (text.includes('macbook')) return 'MacBook';
    return '';
};

const sortByProductName = (left, right) => {
    const leftFamily = inferFamily(left.productName, left.categoryName);
    const rightFamily = inferFamily(right.productName, right.categoryName);
    const leftFamilyIndex = familyOrder.indexOf(leftFamily);
    const rightFamilyIndex = familyOrder.indexOf(rightFamily);

    if (leftFamilyIndex !== rightFamilyIndex) {
        if (leftFamilyIndex === -1) return 1;
        if (rightFamilyIndex === -1) return -1;
        return leftFamilyIndex - rightFamilyIndex;
    }

    return right.productName.localeCompare(left.productName, undefined, { numeric: true, sensitivity: 'base' });
};

const AllProduct = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [currentPage, setCurrentPage] = useState(1);
    // Locally hide families deleted in this session (optimistic; backend already removed them).
    const [removedIds, setRemovedIds] = useState(() => new Set());
    const [searchParams, setSearchParams] = useSearchParams();
    const searchRef = useRef(null);
    const scrollRef = useRef(null);
    const productListRef = useRef(null);
    const categoryFilter = searchParams.get('category');

    // Caching strategy: TanStack Query keeps the catalog cached, so revisiting the
    // page shows products instantly (from cache) while it refreshes in the background.
    const { data: parents = [], isLoading: parentsLoading } = useQuery({
        queryKey: ['admin-categories'],
        queryFn: () => axiosInstance.get('catagory').then((res) => res.data),
        staleTime: 30 * 1000,
    });
    const { data: variations = [], isLoading: variationsLoading } = useQuery({
        queryKey: ['admin-products'],
        queryFn: () => axiosInstance.get('product').then((res) => res.data),
        staleTime: 30 * 1000,
    });

    const isLoading = parentsLoading || variationsLoading;

    const productGroups = useMemo(() => {
        // Guard against a response that isn't an array yet (loading / transient).
        const parentList = Array.isArray(parents) ? parents : [];
        const variationList = Array.isArray(variations) ? variations : [];
        if (!parentList.length) return [];
        return parentList
            .map((parent) => ({
                parentId: parent._id,
                productName: parent.modelName,
                categoryName: parent.categoryName || '',
                image: parent.images?.[0]?.url || '',
                variants: variationList.filter((variant) => String(variant.parentCatagory) === String(parent._id)),
            }))
            .filter((group) => !removedIds.has(group.parentId))
            .sort(sortByProductName);
    }, [parents, variations, removedIds]);

    const filteredProducts = useMemo(() => {
        const normalizedSearch = searchQuery.trim().toLowerCase();
        const categoryScoped = categoryFilter
            ? productGroups.filter((product) => product.categoryName === categoryFilter)
            : productGroups;

        return categoryScoped
            .filter((product) => {
                if (!normalizedSearch) return true;
                const searchableText = `${product.productName || ''} ${product.categoryName || ''}`.toLowerCase();
                return searchableText.includes(normalizedSearch);
            })
            .sort(sortByProductName);
    }, [categoryFilter, productGroups, searchQuery]);

    // Reset to page 1 whenever the filtered set changes.
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, categoryFilter]);

    useEffect(() => {
        setFocusedIndex(-1);
    }, [searchQuery]);

    useEffect(() => {
        if (focusedIndex >= 0 && scrollRef.current) {
            const focusedEl = scrollRef.current.children[focusedIndex];
            if (focusedEl) {
                focusedEl.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [focusedIndex]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));

    useEffect(() => {
        setCurrentPage((current) => Math.min(current, totalPages));
    }, [totalPages]);

    const goToPage = (page) => {
        const nextPage = Math.min(Math.max(page, 1), totalPages);
        setCurrentPage(nextPage);
        productListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Instant, client-side search suggestions from the already-loaded catalog.
    const showSuggestions = searchFocused && searchQuery.trim().length >= 2;
    const searchPending = isLoading;
    const suggestions = useMemo(() => {
        const term = searchQuery.trim().toLowerCase();
        if (term.length < 2) return [];
        const scoped = categoryFilter
            ? productGroups.filter((product) => product.categoryName === categoryFilter)
            : productGroups;
        return scoped
            .filter((product) => `${product.productName || ''} ${product.categoryName || ''}`.toLowerCase().includes(term))
            .sort(sortByProductName)
            .map((product) => ({
                parentId: product.parentId,
                productName: product.productName,
                categoryName: product.categoryName,
                image: product.image,
                variantCount: product.variants.length,
            }));
    }, [productGroups, searchQuery, categoryFilter]);

    useEffect(() => {
        if (!searchFocused) return undefined;
        const handlePointerDown = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handlePointerDown);
        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [searchFocused]);

    const handleSuggestionSelect = (suggestion) => {
        setSearchQuery(suggestion.productName);
        setSearchFocused(false);
    };

    const handleDeleteGroup = (parentId) => {
        setRemovedIds((current) => {
            const next = new Set(current);
            next.add(parentId);
            return next;
        });
    };

    const totalVariants = filteredProducts.reduce((sum, product) => sum + product.variants.length, 0);
    const stats = [
        { label: 'Visible families', value: filteredProducts.length, sub: 'matching the current product view' },
        { label: 'Saved families', value: productGroups.length, sub: 'total product groups in admin' },
        { label: 'Visible variants', value: totalVariants, sub: 'items currently represented in this view' },
        { label: 'Category scope', value: categoryFilter || 'All', sub: 'active inventory filter' },
    ];

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
        return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter') {
            if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
                e.preventDefault();
                handleSuggestionSelect(suggestions[focusedIndex]);
            }
        } else if (e.key === 'Escape') {
            setSearchFocused(false);
        }
    };

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Products"
                title={categoryFilter ? `${categoryFilter} inventory.` : "Manage product inventory."}
                description="Search, adjust, and clean up product families without leaving the admin workspace."
            >
                <div ref={searchRef} className="relative block w-full">
                    <SearchRoundedIcon className="pointer-events-none absolute left-4 top-1/2 !text-[20px] -translate-y-1/2 text-apple-gray" />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search inventory"
                        autoComplete="off"
                        className="h-12 w-full rounded-full border border-black/[0.08] bg-white pl-12 pr-4 text-sm font-bold text-apple-text outline-none transition-all placeholder:font-medium placeholder:text-apple-gray focus:border-apple-text/20 focus:shadow-[0_0_0_4px_rgba(29,29,31,0.05)]"
                    />

                    {showSuggestions && (
                        <div className="suggest-dropdown absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-[15px] border border-black/10 bg-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur">
                            <div ref={scrollRef} className="suggest-scroll max-h-[400px] overflow-y-auto">
                                {suggestions.length > 0 ? (
                                    suggestions.map((suggestion, index) => {
                                        const isFocused = index === focusedIndex;
                                        return (
                                            <button
                                                key={suggestion.parentId}
                                                type="button"
                                                onClick={() => handleSuggestionSelect(suggestion)}
                                                onMouseEnter={() => setFocusedIndex(index)}
                                                className={`group flex w-full items-center gap-3 border-b border-solid border-[#ededed] px-4 py-3 text-left transition-all duration-150 ${isFocused ? 'bg-[#d90b0f]' : 'hover:bg-[#d90b0f]'
                                                    }`}
                                            >
                                                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] transition-colors ${isFocused ? 'bg-white/20' : 'bg-surface-alt group-hover:bg-white/20'
                                                    }`}>
                                                    {suggestion.image && (
                                                        <img src={suggestion.image} alt={suggestion.productName} className="max-h-[80%] w-auto object-contain" />
                                                    )}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className={`block truncate text-sm font-bold ${isFocused ? 'text-white' : 'text-apple-text group-hover:text-white'
                                                        }`}>{suggestion.productName}</span>
                                                    {suggestion.categoryName && (
                                                        <span className={`block truncate text-xs ${isFocused ? 'text-white/80' : 'text-apple-gray group-hover:text-white/80'
                                                            }`}>{suggestion.categoryName}</span>
                                                    )}
                                                </span>
                                                <span className={`shrink-0 text-xs font-bold ${isFocused ? 'text-white/80' : 'text-apple-gray group-hover:text-white/80'
                                                    }`}>
                                                    {suggestion.variantCount} variant{suggestion.variantCount === 1 ? '' : 's'}
                                                </span>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="px-4 py-3 text-sm text-apple-gray">
                                        {searchPending ? (
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
                                            `No matches for "${searchQuery.trim()}"`
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {categoryFilter && (
                    <button
                        onClick={() => setSearchParams({})}
                        className="premium-button mt-6 h-12 py-0 px-6"
                    >
                        Clear filter
                    </button>
                )}
            </AdminPageHeader>

            <AdminStatsGrid items={stats} />

            {isLoading ? (
                <AdminLoadingState title="Loading inventory" description="Gathering product families and variant data for the admin inventory view." />
            ) : filteredProducts.length ? (
                <div ref={productListRef} className="space-y-5">
                    {paginatedProducts.map((product) => (
                        <SingleProductGroup
                            key={product.parentId}
                            productGroup={product}
                            onDelete={handleDeleteGroup}
                        />
                    ))}

                    <AdminPagination
                        page={currentPage}
                        limit={PRODUCTS_PER_PAGE}
                        totalItems={filteredProducts.length}
                        totalPages={totalPages}
                        currentCount={paginatedProducts.length}
                        itemLabel="product families"
                        onPageChange={goToPage}
                    />
                </div>
            ) : (
                <AdminEmptyState title="No products found." description="Try another search or clear the category filter to see more inventory." />
            )}
        </section>
    );
};

export default AllProduct;
