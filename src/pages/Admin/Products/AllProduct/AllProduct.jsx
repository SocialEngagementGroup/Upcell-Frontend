import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SingleProductGroup from '../AdminSingleProduct/SingleProductGroup';
import AdminPageHeader from '../../../../components/AdminPageHeader/AdminPageHeader';
import AdminStatsGrid from '../../../../components/AdminStatsGrid/AdminStatsGrid';
import AdminPagination from '../../../../components/AdminPagination/AdminPagination';
import AdminLoadingState from '../../../../components/AdminState/AdminLoadingState';
import AdminEmptyState from '../../../../components/AdminState/AdminEmptyState';
import SearchWithSuggestions from '../../../../components/SearchWithSuggestions/SearchWithSuggestions';
import { useProductsQuery } from '../../../../queries/products';
import { useParentCategoriesQuery } from '../../../../queries/categories';
import { EMPTY_ARRAY } from '../../../../queries/keys';

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
    const [currentPage, setCurrentPage] = useState(1);
    // Locally hide families deleted in this session (optimistic; backend already removed them).
    const [removedIds, setRemovedIds] = useState(() => new Set());
    const [searchParams, setSearchParams] = useSearchParams();
    const productListRef = useRef(null);
    const categoryFilter = searchParams.get('category');

    // React Query keeps the catalog cached, so revisiting the page shows
    // products instantly (from cache) while it refreshes in the background.
    const { data: parents = EMPTY_ARRAY, isLoading: parentsLoading } = useParentCategoriesQuery();
    const { data: variations = EMPTY_ARRAY, isLoading: variationsLoading } = useProductsQuery();

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

    return (
        <section className="space-y-6">
            <AdminPageHeader
                eyebrow="Products"
                title={categoryFilter ? `${categoryFilter} inventory.` : "Manage product inventory."}
                description="Search, adjust, and clean up product families without leaving the admin workspace."
            >
                <SearchWithSuggestions
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search inventory"
                    suggestions={suggestions}
                    isLoading={isLoading}
                    minChars={2}
                    onSelect={(suggestion) => setSearchQuery(suggestion.productName)}
                    getSuggestionKey={(suggestion) => suggestion.parentId}
                    renderSuggestion={(suggestion, focused) => (
                        <>
                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] transition-colors ${focused ? 'bg-white/20' : 'bg-surface-alt group-hover:bg-white/20'}`}>
                                {suggestion.image && (
                                    <img src={suggestion.image} alt={suggestion.productName} className="max-h-[80%] w-auto object-contain" />
                                )}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className={`block truncate text-sm font-bold ${focused ? 'text-white' : 'text-apple-text'}`}>{suggestion.productName}</span>
                                {suggestion.categoryName && (
                                    <span className={`block truncate text-xs ${focused ? 'text-white/80' : 'text-apple-gray'}`}>{suggestion.categoryName}</span>
                                )}
                            </span>
                            <span className={`shrink-0 text-xs font-bold ${focused ? 'text-white/80' : 'text-apple-gray'}`}>
                                {suggestion.variantCount} variant{suggestion.variantCount === 1 ? '' : 's'}
                            </span>
                        </>
                    )}
                />
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
