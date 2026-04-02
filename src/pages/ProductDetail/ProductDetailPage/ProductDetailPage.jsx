import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../utilities/axiosInstance';
import ScrollToTop from '../../../utilities/ScrollToTop';
import './ProductDetailPage.css';
import { CartContext } from '../../../App';
import { toast } from 'react-toastify';

// Material Icons
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

import allDummyProducts, { getProductsByParentId } from '../../../utilities/dummyData';

const ProductDetailPage = () => {
    const { parentId, productId } = useParams()
    const [allProducts, setAllProducts] = useState([])
    const [product, setProduct] = useState()
    
    const [selectedColor, setSelectedColor] = useState()
    const [selectedStorage, setSelectedStorage] = useState()
    
    const [availableColors, setAvailableColors] = useState([])
    const [availableStorages, setAvailableStorages] = useState([])
    
    const { cart, setCart } = useContext(CartContext)

    const processProductData = (products) => {
        setAllProducts(products)

        const selectedProduct = products.find((p) => p._id === productId) || products[0]
        setProduct(selectedProduct)
        setSelectedColor(selectedProduct?.color)
        setSelectedStorage(selectedProduct?.storage)

        const colors = new Set()
        const storages = new Set()

        products.forEach(p => {
            if (p.color) colors.add(p.color.name + ":" + p.color.value)
            if (p.storage) storages.add(p.storage)
        })

        setAvailableColors(Array.from(colors).map(str => {
            const [name, value] = str.split(":")
            return { name, value }
        }))
        setAvailableStorages(Array.from(storages))
    }

    useEffect(() => {
        // 1. Try fetching from API
        axiosInstance.get(`/allSameParentProducts/${parentId}`)
            .then(res => {
                const products = res.data
                if (products && products.length > 0) {
                    processProductData(products)
                } else {
                    // 2. Fallback to dummy data
                    const fallbackData = getProductsByParentId(parentId)
                    if (fallbackData.length > 0) processProductData(fallbackData)
                }
            })
            .catch(err => {
                console.log("API Error, using dummy data:", err)
                const fallbackData = getProductsByParentId(parentId)
                if (fallbackData.length > 0) processProductData(fallbackData)
            })
    }, [productId, parentId])

    const handleFilterButtonClick = (option, value) => {
        let color = selectedColor
        let storage = selectedStorage

        if (option === "color") {
            setSelectedColor(value)
            color = value
        } else if (option === "storage") {
            setSelectedStorage(value)
            storage = value
        }

        const newProduct = allProducts.find(p => p.color.name === color.name && p.storage === storage)
        if (newProduct) setProduct(newProduct)
    }

    const handleAddToCart = () => {
        if (product?._id) {
            setCart(prev => [...prev, product._id])
            toast.success("Product Added to cart")
        }
    }

    return (
        <div className="product-detail-page">
            <ScrollToTop />
            
            <div className="container-max">
                {/* Breadcrumbs */}
                <nav className="breadcrumbs">
                    <Link to="/">HOME</Link>
                    <KeyboardArrowRightIcon className="breadcrumb-sep" />
                    <Link to="/shop">SHOP</Link>
                    <KeyboardArrowRightIcon className="breadcrumb-sep" />
                    <span>{product?.productName}</span>
                </nav>

                {/* Primary Hero Section */}
                <section className="product-hero">
                    <div className="product-gallery">
                        <div className="thumbnail-strip">
                            <img src={product?.image} alt="Thumb 1" className="active" />
                            <img src={product?.image} alt="Thumb 2" />
                            <img src={product?.image} alt="Thumb 3" />
                        </div>
                        <div className="main-image-box">
                            <img src={product?.image} alt={product?.productName} />
                        </div>
                    </div>

                    <div className="purchase-panel">
                        <div className="header-info">
                            <span className="badge-new">NEW TITANIUM RENDERING</span>
                            <h1 className="product-name">{product?.productName}</h1>
                            <div className="price-info">
                                <span className="main-price">${product?.price}</span>
                                <span className="monthly-price">From $45.79/mo. with 0% APR</span>
                            </div>
                        </div>

                        <div className="selection-group">
                            <label className="selection-label">COLOR: <strong>{selectedColor?.name}</strong></label>
                            <div className="swatch-row">
                                {availableColors.map(color => (
                                    <button 
                                        key={color.name}
                                        className={`swatch-btn ${selectedColor?.name === color.name ? 'active' : ''}`}
                                        style={{ backgroundColor: color.value }}
                                        onClick={() => handleFilterButtonClick("color", color)}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="selection-group">
                            <label className="selection-label">STORAGE: <strong>SELECT CAPACITY</strong></label>
                            <div className="storage-grid">
                                {availableStorages.map(storage => (
                                    <button 
                                        key={storage}
                                        className={`storage-box ${selectedStorage === storage ? 'active' : ''}`}
                                        onClick={() => handleFilterButtonClick("storage", storage)}
                                    >
                                        <span>{storage}</span>
                                        {/* Optional: Add smaller price diff label here */}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="action-row">
                            <div className="qty-picker">
                                <span>−</span>
                                <strong>1</strong>
                                <span>+</span>
                            </div>
                            <button className="add-to-cart-red" onClick={handleAddToCart}>Add to Cart</button>
                        </div>
                        <button className="buy-now-black">Buy Now</button>

                        <div className="trust-strip">
                            <div className="trust-item">
                                <LocalShippingOutlinedIcon />
                                <div>
                                    <strong>Free Express Delivery</strong>
                                    <p>Delivered within 2–5 business days.</p>
                                </div>
                            </div>
                            <div className="trust-item">
                                <VerifiedUserOutlinedIcon />
                                <div>
                                    <strong>1-Year UpCell Platinum Warranty</strong>
                                    <p>Full protection and priority support.</p>
                                </div>
                            </div>
                        </div>

                        <div className="stats-icons-row">
                            <div className="stat-item">
                                <span className="stat-main">6.1"</span>
                                <span className="stat-sub">RETINA XDR</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-main">A17</span>
                                <span className="stat-sub">PRO CHIP</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-main">48MP</span>
                                <span className="stat-sub">CAMERA</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-main">USB-C</span>
                                <span className="stat-sub">SPEED</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Highlights Section */}
                <section className="product-highlights">
                    <div className="container-max">
                        <h2 className="section-title">Product Highlights</h2>
                        <div className="highlights-grid">
                            <div className="highlight-card main-highlight">
                                <div className="card-content">
                                    <h3>The Pro Camera System.</h3>
                                    <p>A 48MP main camera that's advanced like no other. ProRAW, ProRES, and cinematic video in 4K HDR.</p>
                                </div>
                                <img src="https://via.placeholder.com/800x600?text=Camera+System" alt="Camera System" />
                            </div>
                            <div className="highlight-right">
                                <div className="highlight-card titanium-card">
                                    <div className="card-content">
                                        <h3>Titanium.</h3>
                                        <p>Aerospace-grade design. The lightest, strongest Pro models ever.</p>
                                    </div>
                                </div>
                                <div className="highlight-row">
                                    <div className="highlight-card mini-card">
                                        <div className="icon">A17</div>
                                        <h3>A17 Pro chip.</h3>
                                        <p>A monster win for gaming.</p>
                                    </div>
                                    <div className="highlight-card mini-card">
                                        <div className="icon">USB</div>
                                        <h3>USB-C.</h3>
                                        <p>Universal connectivity.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Detailed Specs */}
                <section className="detailed-specs">
                    <h2 className="section-title">Detailed Specifications</h2>
                    <div className="specs-grid">
                        <div className="spec-group">
                            <span className="spec-label">DISPLAY</span>
                            <strong>6.1" Super Retina XDR</strong>
                            <p className="spec-detail">ProMotion technology with adaptive refresh rates up to 120Hz.</p>
                        </div>
                        <div className="spec-group">
                            <span className="spec-label">WEIGHT</span>
                            <strong>187 grams</strong>
                            <p className="spec-detail">Lighter than previous generations due to titanium construction.</p>
                        </div>
                        <div className="spec-group">
                            <span className="spec-label">BATTERY LIFE</span>
                            <strong>Up to 23 hours video</strong>
                            <p className="spec-detail">MagSafe and Qi2 wireless charging compatible.</p>
                        </div>
                        <div className="spec-group">
                            <span className="spec-label">CELLULAR</span>
                            <strong>5G Superfast</strong>
                            <p className="spec-detail">Gigabit LTE and Wi-Fi 6E (802.11ax).</p>
                        </div>
                    </div>
                </section>

                {/* Essential Accessories */}
                <section className="essential-accessories">
                    <h2 className="section-title">Essential Accessories</h2>
                    <div className="accessories-grid">
                        {[
                            { name: "20W USB-C Power Adapter", price: "$19.00", img: "https://via.placeholder.com/200x200?text=20W+Adapter" },
                            { name: "Clear Case with MagSafe", price: "$49.00", img: "https://via.placeholder.com/200x200?text=Clear+Case" },
                            { name: "Leather Wallet with MagSafe", price: "$59.00", img: "https://via.placeholder.com/200x200?text=Wallet" },
                            { name: "AirPods Pro (2nd Gen)", price: "$249.00", img: "https://via.placeholder.com/200x200?text=AirPods" }
                        ].map((item, i) => (
                            <div key={i} className="accessory-card">
                                <div className="img-box"><img src={item.img} alt={item.name} /></div>
                                <h4>{item.name}</h4>
                                <span className="price">{item.price}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* You Might Also Like */}
                <section className="you-might-like">
                    <div className="container-max">
                        <h2 className="section-title">You might also like</h2>
                        <div className="recommendations-grid">
                            {[
                                { name: "iPhone 15 Pro Max", price: "$1,199", desc: "Large display, even extra optical zoom.", img: "https://via.placeholder.com/300x300?text=iPhone+15+Pro+Max" },
                                { name: "iPhone 14 Pro", price: "$999", desc: "Dynamic Island. Exceptional performance at a lower price.", img: "https://via.placeholder.com/300x300?text=iPhone+14+Pro" },
                                { name: "iPhone 15", price: "$799", desc: "Colorful, durable, breakthrough camera.", img: "https://via.placeholder.com/300x300?text=iPhone+15" }
                            ].map((item, i) => (
                                <div key={i} className="recommend-card">
                                    <div className="img-box"><img src={item.img} alt={item.name} /></div>
                                    <h3>{item.name}</h3>
                                    <p>{item.desc}</p>
                                    <div className="recommend-footer">
                                        <span>From <strong>{item.price}</strong></span>
                                        <Link to="/shop">View Detail</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            
            <section className="product-newsletter">
                <div className="container-max">
                    <div className="signup-content">
                        <h2>Stay ahead of the curve.</h2>
                        <p>Get early access to exclusive drops and cinematic hardware insights.</p>
                        <div className="signup-form">
                            <input type="email" placeholder="Enter your email" />
                            <button>Join UpCell</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductDetailPage;