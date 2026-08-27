import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../../App';
import ScrollToTop from '../../utilities/ScrollToTop';
import { toast } from 'react-toastify';
import SearchWithSuggestions from '../../components/SearchWithSuggestions/SearchWithSuggestions';
import RouteLoadingScreen from '../../components/RouteLoadingScreen/RouteLoadingScreen';
import { groupProductsByParent } from '../../utilities/catalog';
import { useProductsQuery } from '../../queries/products';
import { EMPTY_ARRAY } from '../../queries/keys';

const topCategories = ['All Devices', 'iPhone', 'iPad', 'MacBook'];
const storageOrder = ['128GB', '256GB', '512GB', '1TB', '2TB', '4TB'];

const modelGroupOrder = [
    'iPhone',
    'iPhone Plus',
    'iPhone Pro',
    'iPhone Pro Max',
    'iPad',
    'iPad mini',
    'iPad Air',
    'iPad Pro',
    'MacBook Air',
    'MacBook Pro'
];

const getCategorySortValue = (name) => {
    const index = modelGroupOrder.indexOf(name);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

const matchesShopCategory = (product, categoryName) => {
    if (!categoryName) return false;

    const normalizedCategory = categoryName.trim().toLowerCase();
    const storedCategory = product.categoryName?.toLowerCase();

    return storedCategory === normalizedCategory;
};

const sortByProductName = (left, right) => (
    right.productName.localeCompare(left.productName, undefined, { numeric: true, sensitivity: 'base' })
);

const familyOrder = ['iPhone', 'iPad', 'MacBook'];

const sortByFamilyThenProductName = (left, right) => {
    const leftIndex = familyOrder.indexOf(left.family);
    const rightIndex = familyOrder.indexOf(right.family);

    if (leftIndex !== rightIndex) {
        if (leftIndex === -1) return 1;
        if (rightIndex === -1) return -1;
        return leftIndex - rightIndex;
    }

    return sortByProductName(left, right);
};

const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name' },
];

// 12 keeps every row full at all three grid widths (2 / 3 / 4 columns), so the
// last row never renders with empty slots beside it.
const PRODUCTS_PER_PAGE = 12;
const PAGE_WINDOW_SIZE = 5;

// Sliding window of up to 5 page numbers centered on the current page.
const getPageWindow = (currentPage, totalPages) => {
    if (totalPages <= PAGE_WINDOW_SIZE) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - Math.floor(PAGE_WINDOW_SIZE / 2));
    let end = start + PAGE_WINDOW_SIZE - 1;

    if (end > totalPages) {
        end = totalPages;
        start = end - PAGE_WINDOW_SIZE + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const ShopPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setCart } = useContext(CartContext);
    const { data: products = EMPTY_ARRAY, isLoading: productsLoading } = useProductsQuery();
    const [activeCategory, setActiveCategory] = useState('All Devices');
    const [priceRange, setPriceRange] = useState(3500);
    const [selectedModels, setSelectedModels] = useState([]);
    const [selectedStorages, setSelectedStorages] = useState([]);
    const [sortBy, setSortBy] = useState('featured');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const sortMenuRef = useRef(null);
    const productGridRef = useRef(null);
    const pendingUrlModelsRef = useRef(null);

    // Suggestions are derived from the already-loaded catalog -> instant, no network call.
    const suggestions = useMemo(() => {
        const term = searchQuery.trim().toLowerCase();
        if (term.length < 2) return [];

        // Match by name/category, then collapse to one row per product family
        // (prefer in-stock, then cheapest).
        const byParent = new Map();
        for (const product of products) {
            const name = (product.productName || '').toLowerCase();
            const category = (product.categoryName || '').toLowerCase();
            if (!name.includes(term) && !category.includes(term)) continue;

            const key = String(product.parentCatagory || product.parentId || '');
            if (!key) continue;

            const existing = byParent.get(key);
            if (!existing) {
                byParent.set(key, product);
                continue;
            }
            const isBetter =
                (!product.outOfStock && existing.outOfStock) ||
                (product.outOfStock === existing.outOfStock && Number(product.price || 0) < Number(existing.price || 0));
            if (isBetter) byParent.set(key, product);
        }

        return Array.from(byParent.values())
            .sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
            .map((product) => ({
                _id: product._id,
                parentCatagory: product.parentCatagory || product.parentId,
                productName: product.productName,
                categoryName: product.categoryName,
                image: product.image,
                price: product.price,
            }));
    }, [products, searchQuery]);

    const handleSuggestionSelect = (suggestion) => {
        navigate(`/iphone/${suggestion.parentCatagory}/${suggestion._id}`);
    };

    const sidebarCategories = useMemo(() => {
        const exactCategories = Array.from(new Set(
            products
                .map((product) => product.categoryName?.trim())
                .filter(Boolean)
        )).sort((left, right) => {
            const leftIndex = getCategorySortValue(left);
            const rightIndex = getCategorySortValue(right);

            if (leftIndex !== rightIndex) return leftIndex - rightIndex;
            return left.localeCompare(right);
        });

        return exactCategories;
    }, [products]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryParam = queryParams.get('category');
        if (!categoryParam) return;
        const matchedCategory = topCategories.find((cat) => cat.toLowerCase() === categoryParam.toLowerCase());
        if (matchedCategory) setActiveCategory(matchedCategory);
    }, [location.search]);

    useEffect(() => {
        if (topCategories.includes(activeCategory)) return;
        setActiveCategory('All Devices');
    }, [activeCategory]);

    const availableCategories = useMemo(() => {
        return sidebarCategories
            .filter((categoryName) => products.some((product) => (
                (activeCategory === 'All Devices' || product.family === activeCategory)
                && matchesShopCategory(product, categoryName)
            )))
            .sort((left, right) => {
                const leftIndex = getCategorySortValue(left);
                const rightIndex = getCategorySortValue(right);

                if (leftIndex !== rightIndex) return leftIndex - rightIndex;
                return left.localeCompare(right);
            });
    }, [sidebarCategories, products, activeCategory]);

    const availableStorages = useMemo(() => (
        Array.from(new Set(
            products
                .filter((product) => activeCategory === 'All Devices' || product.family === activeCategory)
                .flatMap((product) => product.availableStorages?.length ? product.availableStorages : [product.storage])
                .filter((storage) => storage && storageOrder.includes(storage))
        ))
            .sort((left, right) => {
                const leftIndex = storageOrder.indexOf(left);
                const rightIndex = storageOrder.indexOf(right);

                if (leftIndex === -1 && rightIndex === -1) return left.localeCompare(right);
                if (leftIndex === -1) return 1;
                if (rightIndex === -1) return -1;
                return leftIndex - rightIndex;
            })
    ), [products, activeCategory]);

    useEffect(() => {
        setSelectedModels((current) => current.filter((category) => availableCategories.includes(category)));
        setSelectedStorages((current) => current.filter((storage) => availableStorages.includes(storage)));
    }, [availableCategories, availableStorages]);

    // `?q=` and `?model=` arrive from the header search box and the mega menu
    // tiles. `?category=` keeps its own effect above, untouched.
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        const nextModels = (queryParams.get('model') || '')
            .split(',')
            .map((value) => value.trim())
            .filter((value) => modelGroupOrder.includes(value));

        // Anything unrecognised is dropped rather than filtered on: a stale or
        // hand-edited `?model=` should show the unfiltered shop, not an empty
        // grid the user cannot explain.
        pendingUrlModelsRef.current = { models: nextModels, applied: false };

        setSearchQuery(queryParams.get('q')?.trim() || '');
        setSelectedModels(nextModels);
    }, [location.search]);

    // The availability filter above runs before the catalogue has loaded, and
    // at that point `availableCategories` is empty, so it wipes whatever the
    // URL just asked for. Re-apply once the real categories are known — once
    // only, so a later manual deselect sticks.
    useEffect(() => {
        const pending = pendingUrlModelsRef.current;
        if (!pending || pending.applied || pending.models.length === 0) return;
        if (!pending.models.every((model) => availableCategories.includes(model))) return;

        pending.applied = true;
        setSelectedModels(pending.models);
    }, [availableCategories]);

    useEffect(() => {
        if (!sortMenuOpen) return undefined;

        const handlePointerDown = (event) => {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
                setSortMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [sortMenuOpen]);

    const toggleValue = (value, state, setState) => {
        setState((prev) => (
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        ));
    };

    const filteredProducts = useMemo(() => {
        const normalizedSearch = searchQuery.trim().toLowerCase();
        const matchingVariations = products.filter((product) => {
            if (activeCategory !== 'All Devices' && product.family !== activeCategory) {
                return false;
            }

            if (product.price > priceRange) {
                return false;
            }

            if (selectedModels.length > 0) {
                if (!selectedModels.some((category) => matchesShopCategory(product, category))) {
                    return false;
                }
            }

            if (selectedStorages.length > 0) {
                const storages = product.availableStorages?.length ? product.availableStorages : [product.storage];
                if (!selectedStorages.some((storage) => storages.includes(storage))) {
                    return false;
                }
            }

            if (normalizedSearch) {
                const searchableText = `${product.productName || ''} ${product.categoryName || ''} ${product.description || ''}`.toLowerCase();
                if (!searchableText.includes(normalizedSearch)) {
                    return false;
                }
            }

            return true;
        });

        const sorted = groupProductsByParent(matchingVariations);
        sorted.sort(sortByFamilyThenProductName);
        if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
        if (sortBy === 'name') sorted.sort((a, b) => a.productName.localeCompare(b.productName));
        return sorted;
    }, [products, activeCategory, priceRange, searchQuery, selectedModels, selectedStorages, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));

    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, priceRange, searchQuery, selectedModels, selectedStorages, sortBy]);

    useEffect(() => {
        setCurrentPage((current) => Math.min(current, totalPages));
    }, [totalPages]);

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
        return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const goToPage = (page) => {
        const nextPage = Math.min(Math.max(page, 1), totalPages);
        setCurrentPage(nextPage);
        productGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleAddToCart = (event, productId) => {
        event.preventDefault();
        event.stopPropagation();
        setCart((prev) => [...prev, productId]);
        toast.success('Product added to cart');
    };

    const resetFilters = () => {
        setActiveCategory('All Devices');
        setPriceRange(3500);
        setSelectedModels([]);
        setSelectedStorages([]);
        setSortBy('featured');
        setSearchQuery('');
    };

    const activeSortOption = sortOptions.find((option) => option.value === sortBy) || sortOptions[0];

    // TODO(redesign): build the new shop page UI here. All filter, sort, search
    // and pagination state above is wired and ready for the new layout.
    return (
        <div>
            <ScrollToTop />

            <nav>
                <Link to="/">Home</Link>
                <span>Shop</span>
            </nav>
            <h1>Shop Certified Premium iPhones, iPads &amp; MacBooks</h1>
            <p>
                Every certified premium Apple device is graded for condition, priced honestly, and
                backed by a 12-month warranty. Save up to 40% vs. buying new.
            </p>

            {/* Family tabs */}
            <div>
                {topCategories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        aria-pressed={activeCategory === category}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Search */}
            <SearchWithSuggestions
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search devices"
                suggestions={suggestions}
                onSelect={handleSuggestionSelect}
                renderSuggestion={(suggestion) => (
                    <>
                        <img src={suggestion.image} alt="" width="32" height="32" />
                        <span>{suggestion.productName}</span>
                        <span>${suggestion.price}</span>
                    </>
                )}
            />

            {/* Sort */}
            <div ref={sortMenuRef}>
                <button type="button" onClick={() => setSortMenuOpen((open) => !open)}>
                    Sort: {activeSortOption.label}
                </button>
                {sortMenuOpen && (
                    <ul>
                        {sortOptions.map((option) => (
                            <li key={option.value}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSortBy(option.value);
                                        setSortMenuOpen(false);
                                    }}
                                >
                                    {option.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Filters */}
            <button type="button" onClick={() => setFiltersOpen((open) => !open)}>
                {filtersOpen ? 'Hide filters' : 'Show filters'}
            </button>

            {filtersOpen && (
                <aside>
                    <label>
                        Max price: ${priceRange}
                        <input
                            type="range"
                            min="0"
                            max="3500"
                            value={priceRange}
                            onChange={(event) => setPriceRange(Number(event.target.value))}
                        />
                    </label>

                    <fieldset>
                        <legend>Model</legend>
                        {availableCategories.map((category) => (
                            <label key={category}>
                                <input
                                    type="checkbox"
                                    checked={selectedModels.includes(category)}
                                    onChange={() => toggleValue(category, selectedModels, setSelectedModels)}
                                />
                                {category}
                            </label>
                        ))}
                    </fieldset>

                    <fieldset>
                        <legend>Storage</legend>
                        {availableStorages.map((storage) => (
                            <label key={storage}>
                                <input
                                    type="checkbox"
                                    checked={selectedStorages.includes(storage)}
                                    onChange={() => toggleValue(storage, selectedStorages, setSelectedStorages)}
                                />
                                {storage}
                            </label>
                        ))}
                    </fieldset>

                    <button type="button" onClick={resetFilters}>Reset filters</button>
                </aside>
            )}

            {/* Product grid */}
            <div ref={productGridRef}>
                {productsLoading ? (
                    <RouteLoadingScreen compact />
                ) : paginatedProducts.length > 0 ? (
                    /* TODO(redesign): ModernProductCard was deleted with the old design.
                       Rebuild it under src/components/ and render it here. This bare list
                       keeps the catalog wiring verifiable in the meantime. */
                    paginatedProducts.map((product) => (
                        <article key={product._id}>
                            <h3>{product.productName}</h3>
                            <p>${product.price}</p>
                            <button type="button" onClick={(event) => handleAddToCart(event, product._id)}>
                                Add to cart
                            </button>
                        </article>
                    ))
                ) : (
                    <p>No devices match these filters.</p>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <nav aria-label="Pagination">
                    <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    {getPageWindow(currentPage, totalPages).map((page) => (
                        <button
                            key={page}
                            type="button"
                            aria-current={page === currentPage ? 'page' : undefined}
                            onClick={() => goToPage(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </nav>
            )}
        </div>
    );
};

export default ShopPage;
