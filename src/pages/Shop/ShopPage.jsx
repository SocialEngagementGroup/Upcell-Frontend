import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ScrollToTop from '../../utilities/ScrollToTop';
import './ShopPage.css';
import { CartContext } from '../../App';
import { toast } from 'react-toastify';

// Material Icons
import SearchIcon from '@mui/icons-material/Search';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
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
        // 1. Initial Category Filter
        const categoryMatch = activeCategory === "All Devices" 
            ? ["IPHONE", "IPAD", "MACBOOK"].includes(product.category)
            : product.category.toLowerCase() === activeCategory.toLowerCase();
        
        if (!categoryMatch) return false;

        // 2. Price Filter
        if (product.priceVal > priceRange) return false;

        // 3. Model Series Filter (e.g. "iPhone 15 Series")
        if (selectedModels.length > 0) {
            const matchesModel = selectedModels.some(model => {
                const series = model.replace(" Series", "").replace(" M2", "").replace(" M3", "");
                return product.name.includes(series);
            });
            if (!matchesModel) return false;
        }

        // 4. Storage Filter
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

    // Dynamic slider background calculation
    const sliderPercentage = (priceRange / 3500) * 100;
    const sliderStyle = {
        background: `linear-gradient(to right, #D6001C 0%, #D6001C ${sliderPercentage}%, #F5F5F7 ${sliderPercentage}%, #F5F5F7 100%)`
    };

    return (
        <div className="shop-page">
            <ScrollToTop />
            
            <div className="container-max">
                <header className="shop-header">
                    <nav className="breadcrumbs">
                        <Link to="/">HOME</Link>
                        <KeyboardArrowRightIcon className="breadcrumb-sep" />
                        <span>SHOP</span>
                    </nav>
                    <h1 className="shop-title">Shop</h1>
                    
                    <div className="category-tabs">
                        {categories.map(cat => (
                            <button 
                                key={cat} 
                                className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="shop-layout">
                    <aside className="shop-sidebar">
                        <div className="filter-group">
                            <h4>MODEL</h4>
                            <div className="filter-options">
                                {["iPhone 15 Series", "iPhone 14 Series", "iPad Pro M2", "MacBook Pro M3"].map(model => (
                                    <label key={model}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedModels.includes(model)}
                                            onChange={() => toggleFilter(selectedModels, setSelectedModels, model)}
                                        /> {model}
                                    </label>

                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4>STORAGE</h4>
                            <div className="storage-grid">
                                {["128GB", "256GB", "512GB", "1TB"].map(size => (
                                    <button 
                                        key={size}
                                        className={`storage-btn ${selectedStorages.includes(size) ? 'active' : ''}`}
                                        onClick={() => toggleFilter(selectedStorages, setSelectedStorages, size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4>PRICE RANGE</h4>
                            <input 
                                type="range" 
                                min="0" 
                                max="3500" 
                                step="50"
                                value={priceRange} 
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="price-slider"
                                style={sliderStyle}
                            />
                            <div className="price-labels">
                                <span>$0</span>
                                <strong>Up to ${priceRange}</strong>
                                <span>$3,500+</span>
                            </div>
                        </div>
                    </aside>

                    <main className="shop-content">
                        <div className="shop-controls">
                            <span className="results-count">Showing <strong>{filteredProducts.length}</strong> results</span>

                            <div className="sort-control">
                                <span>SORT BY:</span>
                                <select>
                                    <option>Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest</option>
                                </select>
                            </div>
                        </div>

                        <div className="shop-product-grid">
                            {filteredProducts.map(product => (
                                <Link 
                                    to={`/iphone/${product.parentId}/${product.productId}`} 
                                    key={product.id} 
                                    className="shop-product-card"
                                >
                                    <div className="product-image-wrapper">
                                        {product.badge && <span className={`product-badge ${product.badge.includes('SAVE') ? 'discount' : 'status'}`}>{product.badge}</span>}
                                        <img src={product.image} alt={product.name} />
                                    </div>
                                    <div className="product-info">
                                        <span className="product-cat-name">{product.category}</span>
                                        <h3 className="product-title">{product.name}</h3>
                                        <p className="product-starting-at">Starting from <strong>{product.price}</strong></p>
                                        <button className="add-to-cart-btn" onClick={(e) => handleAddToCart(e, product.productId)}>ADD TO CART</button>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="no-results">
                                <h3>No products found.</h3>
                                <p>Try adjusting your search or filters.</p>
                                <button onClick={() => {
                                    setSelectedModels([])
                                    setSelectedStorages([])
                                    setPriceRange(3500)
                                    setActiveCategory("All Devices")
                                }}>RESET ALL FILTERS</button>
                            </div>
                        )}

                        <div className="load-more-section">
                            <button className="load-more-btn">LOAD MORE PRODUCTS</button>
                        </div>
                    </main>
                </div>
            </div>

            <section className="shop-trade-banner">
                <div className="container-max">
                    <div className="trade-banner-wrapper">
                        <div className="trade-banner-content">
                            <span className="exclusive-badge">EXCLUSIVE TRADE-IN PROGRAM</span>
                            <h2>Save up to $800 <br />on trade-ins.</h2>
                            <p>Upgrade to the latest iPhone 15 Pro and get credit for your current device. Fast, simple, and cinematic.</p>
                            <div className="trade-banner-actions">
                                <button className="btn-get-quote">GET YOUR QUOTE</button>
                                <button className="btn-learn-more">LEARN MORE</button>
                            </div>
                        </div>
                        <div className="trade-banner-image">
                            <img src="/staticImages/hero-iphone15.png" alt="iPhone 15 Pro" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShopPage;
