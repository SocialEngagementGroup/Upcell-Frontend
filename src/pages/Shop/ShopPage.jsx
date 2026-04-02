import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ScrollToTop from '../../utilities/ScrollToTop';
import './ShopPage.css';

// Material Icons
import SearchIcon from '@mui/icons-material/Search';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const ShopPage = () => {
    const [activeCategory, setActiveCategory] = useState("All Devices");
    const [priceRange, setPriceRange] = useState(1500);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryParam = queryParams.get('category');
        if (categoryParam) {
            // Find a match case-insensitively
            const matchedCategory = ["iPhone", "iPad", "MacBook"].find(
                cat => cat.toLowerCase() === categoryParam.toLowerCase()
            );
            if (matchedCategory) {
                setActiveCategory(matchedCategory);
            }
        }
    }, [location.search]);
    
    // Dummy Data based on the provided image
    const dummyProducts = [
        {
            id: 1,
            category: "IPHONE",
            name: "iPhone 15 Pro Max",
            price: "$1,099",
            badge: "IN STOCK",
            image: "https://via.placeholder.com/400x500?text=iPhone+15+Pro+Max"
        },
        {
            id: 2,
            category: "MACBOOK",
            name: "MacBook Pro 14\" M3",
            price: "$1,599",
            badge: "",
            image: "https://via.placeholder.com/400x500?text=MacBook+Pro+M3"
        },
        {
            id: 3,
            category: "IPAD",
            name: "iPad Pro 12.9\"",
            price: "$949",
            badge: "SAVE 15%",
            image: "https://via.placeholder.com/400x500?text=iPad+Pro+12.9"
        },
        {
            id: 4,
            category: "IPHONE",
            name: "iPhone 15",
            price: "$799",
            badge: "",
            image: "https://via.placeholder.com/400x500?text=iPhone+15"
        },
        {
            id: 5,
            category: "MACBOOK",
            name: "MacBook Air 13\" M2",
            price: "$999",
            badge: "",
            image: "https://via.placeholder.com/400x500?text=MacBook+Air+M2"
        },
        {
            id: 6,
            category: "WATCH",
            name: "Apple Watch Ultra 2",
            price: "$799",
            badge: "",
            image: "https://via.placeholder.com/400x500?text=Apple+Watch+Ultra+2"
        }
    ];

    const categories = ["All Devices", "iPhone", "iPad", "MacBook"];

    const filteredProducts = dummyProducts.filter(product => {
        if (activeCategory === "All Devices") {
            return ["IPHONE", "IPAD", "MACBOOK"].includes(product.category);
        }
        return product.category.toLowerCase() === activeCategory.toLowerCase();
    });

    return (
        <div className="shop-page">
            <ScrollToTop />
            
            <div className="container-max">
                {/* Header Section */}
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
                    {/* Sidebar Filters */}
                    <aside className="shop-sidebar">
                        <div className="filter-group">
                            <h4>MODEL</h4>
                            <div className="filter-options">
                                <label><input type="checkbox" /> iPhone 15 Series</label>
                                <label><input type="checkbox" /> iPhone 14 Series</label>
                                <label><input type="checkbox" /> iPad Pro M2</label>
                                <label><input type="checkbox" /> MacBook Pro M3</label>
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4>STORAGE</h4>
                            <div className="storage-grid">
                                <button className="storage-btn">128GB</button>
                                <button className="storage-btn">256GB</button>
                                <button className="storage-btn">512GB</button>
                                <button className="storage-btn active">1TB</button>
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4>CONDITION</h4>
                            <div className="filter-options">
                                <label><input type="radio" name="condition" /> Mint</label>
                                <label><input type="radio" name="condition" /> Excellent</label>
                                <label><input type="radio" name="condition" /> Good</label>
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4>PRICE RANGE</h4>
                            <input 
                                type="range" 
                                min="0" 
                                max="3500" 
                                value={priceRange} 
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="price-slider"
                            />
                            <div className="price-labels">
                                <span>$0</span>
                                <span>$3,500+</span>
                            </div>
                        </div>
                    </aside>

                    {/* Product Listing Area */}
                    <main className="shop-content">
                        <div className="shop-controls">
                            <span className="results-count">Showing <strong>12</strong> results</span>
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
                                <div key={product.id} className="shop-product-card">
                                    <div className="product-image-wrapper">
                                        {product.badge && <span className={`product-badge ${product.badge.includes('SAVE') ? 'discount' : 'status'}`}>{product.badge}</span>}
                                        <img src={product.image} alt={product.name} />
                                    </div>
                                    <div className="product-info">
                                        <span className="product-cat-name">{product.category}</span>
                                        <h3 className="product-title">{product.name}</h3>
                                        <p className="product-starting-at">Starting from <strong>{product.price}</strong></p>
                                        <button className="add-to-cart-btn">ADD TO CART</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="load-more-section">
                            <button className="load-more-btn">LOAD MORE PRODUCTS</button>
                        </div>
                    </main>
                </div>
            </div>

            {/* Shop Trade-In Banner */}
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
                            {/* In a real app, this would be a high-end product shot of an iPhone 15 Pro */}
                            <img src="/staticImages/hero-iphone15.png" alt="iPhone 15 Pro" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShopPage;
