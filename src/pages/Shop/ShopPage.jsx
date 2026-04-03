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
import { groupProductsByParent, normalizeProduct } from '../../utilities/catalog';

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

const ShopPage = () => {
    const location = useLocation();
    const { setCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All Devices');
    const [priceRange, setPriceRange] = useState(3500);
    const [selectedModels, setSelectedModels] = useState([]);
    const [selectedStorages, setSelectedStorages] = useState([]);
    const [sortBy, setSortBy] = useState('featured');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
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
        axiosInstance.get('product')
            .then((res) => setProducts(res.data.map(normalizeProduct)))
            .catch((error) => console.log(error));
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
                .map((product) => product.storage)
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

            if (selectedStorages.length > 0 && !selectedStorages.includes(product.storage)) {
                return false;
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
                <div className="premium-card overflow-hidden rounded-[40px] bg-[linear-gradient(180deg,#ffffff_0%,#f3f5f8_100%)] px-8 py-10 md:px-12 md:py-14">
                    <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">
                        <Link to="/">Home</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span>Shop</span>
                    </nav>
                    <h1 className="max-w-[1100px] text-[clamp(2.6rem,5vw,5rem)] leading-[0.94]">A calmer, more premium way <br className='hidden md:block' /> to shop Apple products.</h1>
                    <p className="mt-5 max-w-[640px] text-lg leading-8 text-ink-soft">
                        Every device is arranged around condition clarity, honest pricing, and a more editorial shopping experience.
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

                <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
                    <aside className="premium-card h-fit rounded-[32px] p-6 lg:sticky lg:top-28">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl">Refine</h3>
                            <button className="text-sm font-bold text-apple-gray hover:text-apple-text" onClick={resetFilters}>
                                Reset
                            </button>
                        </div>

                        <div className="mt-8">
                            <div className="text-xs font-bold uppercase tracking-[0.2em] text-apple-gray">Category</div>
                            <div className="mt-4 flex flex-col gap-2.5">
                                {availableCategories.map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => toggleValue(category, selectedModels, setSelectedModels)}
                                        className={`flex items-center justify-between rounded-[20px] border px-4 py-3 text-left text-sm font-semibold transition-all ${
                                            selectedModels.includes(category)
                                                ? 'border-apple-text bg-apple-text text-white shadow-[0_14px_28px_rgba(29,29,31,0.18)]'
                                                : 'border-black/[0.06] bg-white text-apple-text hover:border-black/12 hover:bg-surface-alt'
                                        }`}
                                    >
                                        <span>{category}</span>
                                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                                            selectedModels.includes(category)
                                                ? 'bg-white/15 text-white'
                                                : 'bg-surface-alt text-apple-gray'
                                        }`}>
                                            {selectedModels.includes(category) ? 'On' : 'Add'}
                                        </span>
                                    </button>
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
                                    background: `linear-gradient(to right, #1d1d1f 0%, #1d1d1f ${sliderPercentage}%, #d7dbe1 ${sliderPercentage}%, #d7dbe1 100%)`,
                                }}
                            />
                            <div className="mt-3 flex justify-between text-sm text-apple-gray">
                                <span>$0</span>
                                <span className="font-bold text-apple-text">Up to ${priceRange}</span>
                            </div>
                        </div>
                    </aside>

                    <main>


                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <ModernProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="premium-card mt-6 rounded-[32px] px-8 py-12 text-center">
                                <h3>No devices match those filters.</h3>
                                <p className="mt-3 text-base text-ink-soft">Reset the filters to bring the full collection back.</p>
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
