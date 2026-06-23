import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../../App';
import ScrollToTop from '../../utilities/ScrollToTop';
import { toast } from 'react-toastify';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import axiosInstance from '../../utilities/axiosInstance';
import ModernProductCard from '../../components/ModernProductCard/ModernProductCard';
import { normalizeProduct } from '../../utilities/catalog';

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


const SHOP_PRODUCTS_CACHE_KEY = 'upcell_shop_products_cache';
const SHOP_PRODUCTS_CACHE_TTL = 5 * 60 * 1000;

const readCachedShopProducts = () => {
    if (typeof window === 'undefined') return [];

    try {
        const cached = window.sessionStorage.getItem(SHOP_PRODUCTS_CACHE_KEY);
        if (!cached) return [];

        const parsed = JSON.parse(cached);
        if (!Array.isArray(parsed.products) || Date.now() - parsed.savedAt > SHOP_PRODUCTS_CACHE_TTL) {
            window.sessionStorage.removeItem(SHOP_PRODUCTS_CACHE_KEY);
            return [];
        }

        return parsed.products.map(normalizeProduct);
    } catch (error) {
        window.sessionStorage.removeItem(SHOP_PRODUCTS_CACHE_KEY);
        return [];
    }
};

const writeCachedShopProducts = (products) => {
    if (typeof window === 'undefined') return;

    try {
        window.sessionStorage.setItem(SHOP_PRODUCTS_CACHE_KEY, JSON.stringify({
            savedAt: Date.now(),
            products,
        }));
    } catch (error) {
        window.sessionStorage.removeItem(SHOP_PRODUCTS_CACHE_KEY);
    }
};
const ShopProductPreloader = () => (
    <div className="space-y-6" aria-live="polite" aria-busy="true">
        <div className="premium-card overflow-hidden rounded-[32px] p-6">
            <div className="flex items-center gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#ffffff_0%,#f1f3f6_100%)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
                    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-black/10 border-t-brand-red" />
                </div>
                <div className="min-w-0">
                    <div className="text-xs font-black uppercase tracking-[0.22em] text-brand-red">UpCell</div>
                    <h2 className="mt-1 text-[24px] leading-tight text-apple-text sm:text-[30px]">Preparing certified devices</h2>
                    <p className="mt-2 text-sm text-apple-gray">Loading the latest available iPhones, iPads, and MacBooks.</p>
                </div>
            </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="overflow-hidden rounded-[40px] border border-black/[0.06] bg-white p-7 shadow-[0_18px_60px_rgba(15,23,42,0.05)]"
                >
                    <div className="flex h-[240px] items-center justify-center rounded-[28px] bg-[linear-gradient(180deg,#f8f9fb_0%,#edf0f4_100%)]">
                        <div className="h-28 w-20 animate-pulse rounded-[24px] bg-white/80 shadow-[0_18px_46px_rgba(15,23,42,0.10)]" />
                    </div>
                    <div className="mt-8 h-3 w-20 animate-pulse rounded-full bg-black/10" />
                    <div className="mt-4 h-6 w-4/5 animate-pulse rounded-full bg-black/10" />
                    <div className="mt-3 flex gap-2">
                        {[0, 1, 2].map((swatch) => (
                            <span key={swatch} className="h-4 w-4 animate-pulse rounded-full bg-black/10" />
                        ))}
                    </div>
                    <div className="mt-8 flex items-end justify-between">
                        <div>
                            <div className="h-2 w-10 animate-pulse rounded-full bg-black/10" />
                            <div className="mt-3 h-8 w-24 animate-pulse rounded-full bg-black/10" />
                        </div>
                        <div className="h-4 w-24 animate-pulse rounded-full bg-black/10" />
                    </div>
                </div>
            ))}
        </div>
        <span className="sr-only">Loading products</span>
    </div>
);
const ShopPage = () => {
    const location = useLocation();
    const { setCart } = useContext(CartContext);
    const [products, setProducts] = useState(() => readCachedShopProducts());
    const [productsLoading, setProductsLoading] = useState(() => readCachedShopProducts().length === 0);
    const [activeCategory, setActiveCategory] = useState('All Devices');
    const [priceRange, setPriceRange] = useState(3500);
    const [selectedModels, setSelectedModels] = useState([]);
    const [selectedStorages, setSelectedStorages] = useState([]);
    const [sortBy, setSortBy] = useState('featured');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const sortMenuRef = useRef(null);

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

    useEffect(() => {
        const hasCachedProducts = products.length > 0;
        if (!hasCachedProducts) setProductsLoading(true);

        axiosInstance.get('products/shop')
            .then((res) => {
                writeCachedShopProducts(res.data);
                setProducts(res.data.map(normalizeProduct));
            })
            .catch((error) => console.log(error))
            .finally(() => setProductsLoading(false));
    }, []);

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

        const sorted = [...matchingVariations];
        sorted.sort(sortByFamilyThenProductName);
        if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
        if (sortBy === 'name') sorted.sort((a, b) => a.productName.localeCompare(b.productName));
        return sorted;
    }, [products, activeCategory, priceRange, searchQuery, selectedModels, selectedStorages, sortBy]);

    const sliderPercentage = (priceRange / 3500) * 100;

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

    return (
        <div className="page-shell">
            <ScrollToTop />

            <section className="page-container pb-10 pt-6">
                <div className="premium-card overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-6 py-8 sm:rounded-[40px] sm:px-8 sm:py-10 md:px-12 md:py-14">
                    <nav className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray sm:mb-8">
                        <Link to="/">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span>Shop</span>
                    </nav>
                    <h1 className="max-w-[1100px] text-[clamp(2.1rem,5vw,5rem)] leading-[0.96] sm:leading-[0.94]">Shop Certified Premium <br className='hidden md:block' /> iPhones, iPads & MacBooks</h1>
                    <p className="mt-4 max-w-[640px] text-base leading-7 text-ink-soft sm:mt-5 sm:text-lg sm:leading-8">
                        Every certified premium Apple device is graded for condition, priced honestly, and backed by a 12-month warranty. Save up to 40% vs. buying new.
                    </p>
                </div>
            </section>

            <section className="page-container pb-16">
                <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        {topCategories.map((category) => (
                            <button
                                key={category}
                                className={activeCategory === category ? 'premium-button' : 'premium-button-secondary'}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <label className="relative block min-w-0 sm:w-[320px]">
                            <SearchRoundedIcon className="pointer-events-none absolute left-4 top-1/2 !text-[20px] -translate-y-1/2 text-apple-gray" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search products"
                                className="h-12 w-full rounded-full border border-black/[0.08] bg-white pl-12 pr-4 text-sm font-semibold text-apple-text outline-none transition-all placeholder:font-medium placeholder:text-apple-gray focus:border-apple-text/20 focus:shadow-[0_0_0_4px_rgba(29,29,31,0.05)]"
                            />
                        </label>

                        <div ref={sortMenuRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setSortMenuOpen((current) => !current)}
                                className="flex h-12 min-w-[220px] items-center justify-between rounded-full border border-black/[0.08] bg-white px-5 text-sm font-bold text-apple-text transition-all hover:border-black/15 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                            >
                                <span>{activeSortOption.label}</span>
                                <KeyboardArrowDownRoundedIcon className={`!text-[20px] text-apple-gray transition-transform duration-200 ${sortMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {sortMenuOpen && (
                                <div className="absolute right-0 z-20 mt-3 w-[240px] overflow-hidden rounded-[24px] border border-black/[0.08] bg-white/95 p-2 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur">
                                    {sortOptions.map((option) => {
                                        const selected = option.value === sortBy;
                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    setSortBy(option.value);
                                                    setSortMenuOpen(false);
                                                }}
                                                className={`flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left text-sm font-bold transition-all ${
                                                    selected
                                                        ? 'bg-apple-text text-white shadow-[0_12px_24px_rgba(29,29,31,0.18)]'
                                                        : 'text-apple-text hover:bg-surface-alt'
                                                }`}
                                            >
                                                <span>{option.label}</span>
                                                {selected && <span className="text-xs font-black uppercase tracking-[0.16em] text-white/70">On</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setFiltersOpen((current) => !current)}
                    className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white text-sm font-bold text-apple-text transition-all hover:border-black/15 lg:hidden"
                >
                    <span>{filtersOpen ? 'Hide filters' : 'Show filters'}</span>
                    <KeyboardArrowDownRoundedIcon className={`!text-[20px] text-apple-gray transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
                    <aside className={`premium-card h-fit rounded-[32px] p-6 lg:sticky lg:top-28 lg:block ${filtersOpen ? 'block' : 'hidden'}`}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl">Refine</h3>
                            <button className="text-sm font-bold text-apple-gray hover:text-apple-text" onClick={resetFilters}>
                                Reset
                            </button>
                        </div>

                        <div className="mt-8">
                            <div className="text-xs font-bold uppercase tracking-[0.2em] text-apple-gray">Category</div>
                            <div className="mt-4 flex flex-col gap-3">
                                {availableCategories.map((category) => (
                                    <label key={category} className="flex items-center gap-3 text-sm text-ink-soft">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded-[4px] border border-black/20 accent-apple-text"
                                            checked={selectedModels.includes(category)}
                                            onChange={() => toggleValue(category, selectedModels, setSelectedModels)}
                                        />
                                        <span>{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="text-xs font-bold uppercase tracking-[0.2em] text-apple-gray">Storage</div>
                            <div className="mt-4 grid grid-cols-3 gap-3">
                                {availableStorages.map((storage) => (
                                    <button
                                        key={storage}
                                        className={selectedStorages.includes(storage)
                                            ? 'flex items-center justify-center rounded-[18px] border border-apple-text bg-apple-text px-1 py-3 text-[13px] font-bold text-white shadow-[0_12px_24px_rgba(29,29,31,0.16)]'
                                            : 'flex items-center justify-center rounded-[18px] border border-black/[0.06] bg-white px-1 py-3 text-[13px] font-bold text-apple-text transition-all hover:border-black/12 hover:bg-surface-alt'}
                                        onClick={() => toggleValue(storage, selectedStorages, setSelectedStorages)}
                                    >
                                        {storage}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="text-xs font-bold uppercase tracking-[0.2em] text-apple-gray">Max price</div>
                            <input
                                type="range"
                                min="0"
                                max="3500"
                                step="50"
                                value={priceRange}
                                onChange={(event) => setPriceRange(Number(event.target.value))}
                                className="mt-4 h-1 w-full appearance-none rounded-full"
                                style={{
                                    accentColor: '#d90b0f',
                                    background: `linear-gradient(to right, #d90b0f 0%, #d90b0f ${sliderPercentage}%, #d7dbe1 ${sliderPercentage}%, #d7dbe1 100%)`,
                                }}
                            />
                            <div className="mt-3 flex justify-between text-sm text-apple-gray">
                                <span>$0</span>
                                <span className="font-bold text-apple-text">Up to ${priceRange}</span>
                            </div>
                        </div>
                    </aside>

                    <main>
                        {productsLoading ? (
                            <ShopProductPreloader />
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredProducts.map((product) => (
                                    <ModernProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}

                        {!productsLoading && filteredProducts.length === 0 && (
                            <div className="premium-card mt-6 rounded-[32px] px-8 py-12 text-center">
                                <h3>No premium devices match those filters.</h3>
                                <p className="mt-3 text-base text-ink-soft">Reset the filters to browse the full certified premium Apple collection.</p>
                                <button className="premium-button mt-6" onClick={resetFilters}>
                                    Reset filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </section>
        </div>
    );
};

export default ShopPage;






