import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../../App';
import ScrollToTop from '../../utilities/ScrollToTop';
import { toast } from 'react-toastify';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import axiosInstance from '../../utilities/axiosInstance';
import ModernProductCard from '../../components/ModernProductCard/ModernProductCard';
import { groupProductsByParent, normalizeProduct } from '../../utilities/catalog';

const categories = ['All Devices', 'iPhone', 'iPad', 'MacBook'];
const storageOrder = ['128GB', '256GB', '512GB', '1TB', '2TB', '4TB'];

const getModelGroup = (name) => {
    if (!name) return '';
    const low = name.toLowerCase();
    
    // iPhone grouping
    if (low.includes('pro max')) return 'iPhone Pro Max';
    if (low.includes('plus')) return 'iPhone Plus';
    if (low.includes('pro') && low.includes('iphone')) return 'iPhone Pro';
    if (low.includes('iphone')) return 'iPhone';

    // iPad grouping
    if (low.includes('ipad pro')) return 'iPad Pro';
    if (low.includes('ipad air')) return 'iPad Air';
    if (low.includes('ipad mini')) return 'iPad mini';
    if (low.includes('ipad')) return 'iPad';

    // MacBook grouping
    if (low.includes('macbook air')) return 'MacBook Air';
    if (low.includes('macbook pro')) return 'MacBook Pro';

    return name;
};

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

const ShopPage = () => {
    const location = useLocation();
    const { setCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All Devices');
    const [priceRange, setPriceRange] = useState(3500);
    const [selectedModels, setSelectedModels] = useState([]);
    const [selectedStorages, setSelectedStorages] = useState([]);
    const [sortBy, setSortBy] = useState('featured');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryParam = queryParams.get('category');
        if (!categoryParam) return;
        const matchedCategory = ['iPhone', 'iPad', 'MacBook'].find(
            (cat) => cat.toLowerCase() === categoryParam.toLowerCase()
        );
        if (matchedCategory) setActiveCategory(matchedCategory);
    }, [location.search]);

    useEffect(() => {
        axiosInstance.get('product')
            .then((res) => setProducts(res.data.map(normalizeProduct)))
            .catch((error) => console.log(error));
    }, []);

    const availableModels = useMemo(() => {
        const groups = new Set();
        products.forEach((product) => {
            if (activeCategory === 'All Devices' || product.family === activeCategory) {
                const group = getModelGroup(product.productName);
                if (group) groups.add(group);
            }
        });
        return Array.from(groups).sort((left, right) => {
            const leftIndex = modelGroupOrder.indexOf(left);
            const rightIndex = modelGroupOrder.indexOf(right);

            if (leftIndex === -1 && rightIndex === -1) return left.localeCompare(right);
            if (leftIndex === -1) return 1;
            if (rightIndex === -1) return -1;
            return leftIndex - rightIndex;
        });
    }, [products, activeCategory]);

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
        setSelectedModels((current) => current.filter((model) => availableModels.includes(model)));
        setSelectedStorages((current) => current.filter((storage) => availableStorages.includes(storage)));
    }, [availableModels, availableStorages]);

    const toggleValue = (value, state, setState) => {
        setState((prev) => (
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        ));
    };

    const filteredProducts = useMemo(() => {
        const matchingVariations = products.filter((product) => {
            const categoryLabel = product.family;

            if (activeCategory !== 'All Devices' && categoryLabel !== activeCategory) {
                return false;
            }

            if (product.price > priceRange) {
                return false;
            }

            if (selectedModels.length > 0) {
                const productGroup = getModelGroup(product.productName);
                if (!selectedModels.includes(productGroup)) {
                    return false;
                }
            }

            if (selectedStorages.length > 0 && !selectedStorages.includes(product.storage)) {
                return false;
            }

            const isSupportedFamily = ['iPhone', 'iPad', 'MacBook'].includes(product.family);
            return activeCategory === 'All Devices' ? true : isSupportedFamily;
        });

        const sorted = groupProductsByParent(matchingVariations);
        if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
        if (sortBy === 'name') sorted.sort((a, b) => a.productName.localeCompare(b.productName));
        return sorted;
    }, [products, activeCategory, priceRange, selectedModels, selectedStorages, sortBy]);

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
    };

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
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={activeCategory === category ? 'premium-button' : 'premium-button-secondary'}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            className="h-12 rounded-full border border-black/[0.08] bg-white px-6 text-sm font-bold text-apple-text outline-none transition-all focus:border-apple-text/20 focus:shadow-[0_0_0_4px_rgba(29,29,31,0.05)]"
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name</option>
                        </select>
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
                            <div className="text-xs font-bold uppercase tracking-[0.2em] text-apple-gray">Model</div>
                            <div className="mt-4 flex flex-col gap-3">
                                {availableModels.map((model) => (
                                    <label key={model} className="flex items-center gap-3 text-sm text-ink-soft">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 accent-apple-text"
                                            checked={selectedModels.includes(model)}
                                            onChange={() => toggleValue(model, selectedModels, setSelectedModels)}
                                        />
                                        {model}
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
                                            ? 'flex items-center justify-center rounded-[18px] bg-apple-text px-1 py-3 text-[13px] font-bold text-white'
                                            : 'flex items-center justify-center rounded-[18px] border border-black/[0.08] bg-white px-1 py-3 text-[13px] font-bold text-apple-text'}
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
