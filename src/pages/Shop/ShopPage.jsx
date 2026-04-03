import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ScrollToTop from '../../utilities/ScrollToTop';
import { CartContext } from '../../App';
import { toast } from 'react-toastify';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import allDummyProducts from '../../utilities/dummyData';

const ShopPage = () => {
    const [activeCategory, setActiveCategory] = useState("All Devices");
    const [priceRange, setPriceRange] = useState(3500);
    const [selectedModels, setSelectedModels] = useState([]);
    const [selectedStorages, setSelectedStorages] = useState([]);
    
    const location = useLocation();
    const { cart, setCart } = useContext(CartContext);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryParam = queryParams.get('category');
        if (categoryParam) {
            const matchedCategory = ["iPhone", "iPad", "MacBook"].find(
                cat => cat.toLowerCase() === categoryParam.toLowerCase()
            );
            if (matchedCategory) setActiveCategory(matchedCategory);
        }
    }, [location.search]);
    
    const dummyProducts = allDummyProducts.map(p => ({
        id: p._id,
        category: p.category,
        name: p.productName,
        price: `$${p.price}`,
        priceVal: p.price,
        badge: p.badge || "",
        image: p.image,
        parentId: p.parentId,
        productId: p._id,
        storage: p.storage
    }));

    const categories = ["All Devices", "iPhone", "iPad", "MacBook"];

    const toggleFilter = (state, setState, value) => {
        setState(prev => 
            prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
    };

    const filteredProducts = dummyProducts.filter(product => {
        const categoryMatch = activeCategory === "All Devices" 
            ? ["IPHONE", "IPAD", "MACBOOK"].includes(product.category)
            : product.category.toLowerCase() === activeCategory.toLowerCase();
        if (!categoryMatch) return false;
        if (product.priceVal > priceRange) return false;
        if (selectedModels.length > 0) {
            const matchesModel = selectedModels.some(model => {
                const series = model.replace(" Series", "").replace(" M2", "").replace(" M3", "");
                return product.name.includes(series);
            });
            if (!matchesModel) return false;
        }
        if (selectedStorages.length > 0) {
            if (!selectedStorages.includes(product.storage)) return false;
        }
        return true;
    });

    const handleAddToCart = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        if (productId) {
            setCart(prev => [...prev, productId]);
            toast.success("Product Added to cart");
        }
    }

    const sliderPercentage = (priceRange / 3500) * 100;

    return (
        <div className="pt-[60px] bg-white text-apple-text font-sans">
            <ScrollToTop />
            
            <div className="max-w-site mx-auto px-[100px] lg:px-10">
                <header className="mb-20">
                    <nav className="flex items-center gap-2 text-[11px] font-bold text-apple-gray mb-6 tracking-[0.05em] uppercase">
                        <Link to="/" className="text-apple-gray no-underline hover:text-apple-text">HOME</Link>
                        <KeyboardArrowRightIcon className="!text-sm" />
                        <span>SHOP</span>
                    </nav>
                    <h1 className="mb-12">Shop</h1>
                    
                    <div className="flex gap-10 border-b border-surface-alt">
                        {categories.map(cat => (
                            <button 
                                key={cat} 
                                className={`py-5 text-base font-semibold bg-transparent border-b-[2.5px] transition-all duration-300 ease-smooth cursor-pointer ${activeCategory === cat ? 'text-apple-text border-brand-red font-bold' : 'text-apple-gray border-transparent hover:text-apple-text'}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-[280px_1fr] gap-20 mt-[60px] items-start max-lg:grid-cols-1 max-lg:gap-[60px]">
                    <aside className="flex flex-col gap-14 sticky top-[120px] max-lg:relative max-lg:top-0 max-lg:flex-row max-lg:flex-wrap max-lg:gap-10">
                        <div>
                            <h4 className="text-xs font-extrabold text-apple-text mb-6 tracking-[0.1em] uppercase">MODEL</h4>
                            <div className="flex flex-col gap-4">
                                {["iPhone 15 Series", "iPhone 14 Series", "iPad Pro M2", "MacBook Pro M3"].map(model => (
                                    <label key={model} className="flex items-center gap-3 text-[15px] font-medium text-apple-gray cursor-pointer hover:text-apple-text transition-colors">
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 accent-brand-red cursor-pointer"
                                            checked={selectedModels.includes(model)}
                                            onChange={() => toggleFilter(selectedModels, setSelectedModels, model)}
                                        /> {model}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-extrabold text-apple-text mb-6 tracking-[0.1em] uppercase">STORAGE</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {["128GB", "256GB", "512GB", "1TB"].map(size => (
                                    <button 
                                        key={size}
                                        className={`py-4 border rounded-xl text-sm font-bold transition-all duration-200 ease-smooth cursor-pointer ${selectedStorages.includes(size) ? 'bg-apple-text text-white border-apple-text' : 'bg-white text-apple-text border-black/10 hover:border-apple-gray'}`}
                                        onClick={() => toggleFilter(selectedStorages, setSelectedStorages, size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-extrabold text-apple-text mb-6 tracking-[0.1em] uppercase">PRICE RANGE</h4>
                            <input 
                                type="range" 
                                min="0" 
                                max="3500" 
                                step="50"
                                value={priceRange} 
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full h-1 rounded-sm outline-none my-5 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-brand-red [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                                style={{ background: `linear-gradient(to right, #D6001C 0%, #D6001C ${sliderPercentage}%, #F5F5F7 ${sliderPercentage}%, #F5F5F7 100%)` }}
                            />
                            <div className="flex justify-between text-[13px] font-semibold text-apple-gray">
                                <span>$0</span>
                                <strong className="text-apple-text">Up to ${priceRange}</strong>
                                <span>$3,500+</span>
                            </div>
                        </div>
                    </aside>

                    <main>
                        <div className="flex justify-between items-center mb-12 pb-6 border-b border-surface-alt">
                            <span className="text-[15px] text-apple-gray">Showing <strong className="text-apple-text">{filteredProducts.length}</strong> results</span>
                            <div className="flex items-center gap-3 text-[13px] font-bold text-apple-gray">
                                <span>SORT BY:</span>
                                <select className="border-none font-bold text-sm text-apple-text outline-none cursor-pointer bg-transparent px-2 py-1">
                                    <option>Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-10">
                            {filteredProducts.map(product => (
                                <Link 
                                    to={`/iphone/${product.parentId}/${product.productId}`} 
                                    key={product.id} 
                                    className="group block no-underline text-inherit bg-white p-8 rounded-4xl transition-all duration-[400ms] ease-bounce-out shadow-soft hover:-translate-y-2 hover:shadow-medium"
                                >
                                    <div className="bg-surface-alt rounded-[20px] h-[360px] flex justify-center items-center mb-8 relative overflow-hidden">
                                        {product.badge && <span className={`absolute top-6 right-6 text-[10px] font-extrabold px-3 py-1.5 rounded-md z-[2] tracking-[0.05em] uppercase ${product.badge.includes('SAVE') ? 'bg-brand-red text-white' : 'bg-apple-text text-white'}`}>{product.badge}</span>}
                                        <img src={product.image} alt={product.name} className="h-3/4 w-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.05)] transition-transform duration-[400ms] ease-smooth group-hover:scale-105" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-apple-gray mb-3 tracking-[0.05em] uppercase">{product.category}</span>
                                        <h3 className="mb-2 leading-[1.2]">{product.name}</h3>
                                        <p className="text-base text-apple-gray mb-6 font-medium leading-normal">Starting from <strong className="text-apple-text font-bold text-lg">{product.price}</strong></p>
                                        <button className="w-full bg-brand-red text-white py-5 rounded-[14px] text-sm font-extrabold tracking-[0.05em] transition-all duration-300 hover:bg-brand-red-hover" onClick={(e) => handleAddToCart(e, product.productId)}>ADD TO CART</button>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-20">
                                <h3 className="text-2xl font-bold text-apple-text mb-3">No products found.</h3>
                                <p className="text-apple-gray mb-8">Try adjusting your search or filters.</p>
                                <button className="bg-apple-text text-white px-8 py-4 rounded-xl font-bold" onClick={() => { setSelectedModels([]); setSelectedStorages([]); setPriceRange(3500); setActiveCategory("All Devices"); }}>RESET ALL FILTERS</button>
                            </div>
                        )}

                        <div className="mt-20 text-center">
                            <button className="w-[240px] py-[18px] bg-transparent border-2 border-apple-text font-extrabold text-sm rounded-[14px] transition-all duration-200 cursor-pointer hover:bg-apple-text hover:text-white">LOAD MORE PRODUCTS</button>
                        </div>
                    </main>
                </div>
            </div>

            <section className="mt-[140px] bg-surface-alt py-[120px]">
                <div className="max-w-site mx-auto px-[100px] lg:px-10">
                    <div className="bg-white rounded-6xl p-[100px] flex justify-between items-center gap-20 shadow-[0_40px_100px_rgba(0,0,0,0.05)] max-lg:flex-col max-lg:p-10">
                        <div className="flex-[1.2]">
                            <span className="text-[11px] font-extrabold text-brand-red block mb-6 tracking-[0.05em]">EXCLUSIVE TRADE-IN PROGRAM</span>
                            <h2 className="text-[64px] leading-[1.1] mb-6 tracking-[-0.04em] max-lg:text-4xl">Save up to $800 <br />on trade-ins.</h2>
                            <p className="text-lg leading-relaxed text-apple-gray mb-10 max-w-[500px]">Upgrade to the latest iPhone 15 Pro and get credit for your current device. Fast, simple, and cinematic.</p>
                            <div className="flex gap-4">
                                <button className="bg-brand-red text-white h-16 px-10 rounded-2xl text-base font-bold transition-all duration-300 hover:bg-brand-red-hover">GET YOUR QUOTE</button>
                                <button className="border-2 border-apple-text h-16 px-10 rounded-2xl text-base font-bold bg-transparent transition-all duration-300 hover:bg-apple-text hover:text-white">LEARN MORE</button>
                            </div>
                        </div>
                        <div className="flex-1">
                            <img src="/staticImages/hero-iphone15.png" alt="iPhone 15 Pro" className="w-full" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShopPage;
