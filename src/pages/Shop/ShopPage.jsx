import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../../App';
import ScrollToTop from '../../utilities/ScrollToTop';
import { toast } from 'react-toastify';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import axiosInstance from '../../utilities/axiosInstance';
import { groupProductsByParent, normalizeProduct } from '../../utilities/catalog';

const categories = ['All Devices', 'iPhone', 'iPad', 'MacBook'];
const models = ['iPhone 15', 'iPhone 14', 'iPad Pro', 'iPad Air', 'MacBook Pro', 'MacBook Air'];
const storages = ['64GB', '128GB', '256GB', '512GB', '1TB'];

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

    const toggleValue = (value, state, setState) => {
        setState((prev) => (
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        ));
    };

    const filteredProducts = useMemo(() => {
        const normalized = groupProductsByParent(products).filter((product) => {
            const categoryLabel = product.family;

            if (activeCategory !== 'All Devices' && categoryLabel !== activeCategory) {
                return false;
            }

            if (product.price > priceRange) {
                return false;
            }

            if (selectedModels.length > 0 && !selectedModels.some((item) => product.productName.includes(item))) {
                return false;
            }

            if (selectedStorages.length > 0 && !selectedStorages.includes(product.storage)) {
                return false;
            }

            return ['iPhone', 'iPad', 'MacBook'].includes(product.family);
        });

        const sorted = [...normalized];
        if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
        if (sortBy === 'name') sorted.sort((a, b) => a.productName.localeCompare(b.productName));
        return sorted;
    }, [activeCategory, priceRange, selectedModels, selectedStorages, sortBy]);

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
                        <span>Store</span>
                    </nav>
                    <span className="eyebrow mb-5">Apple Store</span>
                    <h1 className="max-w-[760px] text-[clamp(2.6rem,5vw,5rem)] leading-[0.94]">A calmer, more premium way to shop Apple products.</h1>
                    <p className="mt-5 max-w-[640px] text-lg leading-8 text-ink-soft">
                        Every device is arranged around condition clarity, honest pricing, and a more editorial shopping experience.
                    </p>
                </div>
            </section>

            <section className="page-container pb-16">
                <div className="mb-8 flex flex-wrap gap-3">
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
                                {models.map((model) => (
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
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                {storages.map((storage) => (
                                    <button
                                        key={storage}
                                        className={selectedStorages.includes(storage)
                                            ? 'rounded-[18px] bg-apple-text px-4 py-3 text-sm font-bold text-white'
                                            : 'rounded-[18px] border border-black/[0.08] bg-white px-4 py-3 text-sm font-bold text-apple-text'}
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
                        <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-black/[0.06] bg-white/70 p-5 backdrop-blur md:flex-row md:items-center md:justify-between">
                            <p className="text-sm text-ink-soft">
                                Showing <span className="font-bold text-apple-text">{filteredProducts.length}</span> premium devices
                            </p>
                            <select
                                className="rounded-full border border-black/[0.08] bg-white px-4 py-3 text-sm font-bold text-apple-text outline-none"
                                value={sortBy}
                                onChange={(event) => setSortBy(event.target.value)}
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name</option>
                            </select>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <Link
                                    to={`/iphone/${product.parentCatagory}/${product._id}`}
                                    key={product._id}
                                    className="premium-card group overflow-hidden rounded-[32px] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_90px_rgba(15,23,42,0.12)]"
                                >
                                    <div className="flex h-[290px] items-center justify-center rounded-[26px] bg-[linear-gradient(180deg,#f8f8fa_0%,#edf0f5_100%)]">
                                        <img
                                            src={product.image}
                                            alt={product.productName}
                                            className="h-[82%] w-auto object-contain drop-shadow-[0_25px_45px_rgba(15,23,42,0.12)] transition-transform duration-300 group-hover:scale-[1.03]"
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-apple-gray">{product.family}</div>
                                        <h3 className="mt-2 text-[28px] leading-[1.05]">{product.productName}</h3>
                                        <p className="mt-3 text-sm leading-7 text-ink-soft">
                                            {product.color?.name || 'Apple finish'} • {product.storage}
                                        </p>
                                        <div className="mt-6 flex items-center justify-between gap-3">
                                            <div>
                                                <div className="text-sm text-apple-gray">From</div>
                                                <div className="text-2xl font-extrabold text-apple-text">${product.price}</div>
                                            </div>
                                            <button
                                                className="premium-button px-5 py-3 text-xs"
                                                onClick={(event) => handleAddToCart(event, product._id)}
                                            >
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                </Link>
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
