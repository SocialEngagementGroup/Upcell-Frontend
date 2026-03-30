import { Link } from "react-router-dom";
import ModernHero from "./ModernHero";
// Forced Refresh: 1774630328
import "./Home.css"

import SingleProduct from "../../components/SingleProduct/SingleProduct";
import TopDeals from "../../components/SingleProduct/TopDeals";
import Comments from "../../components/Comments/Comments";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../utilities/axiosInstance";
import ScrollToTop from "../../utilities/ScrollToTop";
import TradeDifference from "./TradeDifference";

// Modern Icons (using SVG directly for better control)
const Icons = {
    Warranty: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
    Delivery: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    Return: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    Seller: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    Payment: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
};

const Home = () => {
    const [nProducts, setNproducts] = useState([])
    const [moreProductsInDb, setMoreProductsInDb] = useState(true)
    const prodcutsReq = 10
    const productSkip = useRef(0)

    const requestProduct = () => {
        axiosInstance.post(`products/${prodcutsReq}/${productSkip.current}`,
            { productName: [], condition: [], storage: [], color: [], price: [0, 1500] })
            .then(res => {
                if (res.data.length) {
                    setNproducts(prev => [...prev, ...res.data])
                } else {
                    setMoreProductsInDb(false)
                }
            })
            .catch(error => console.log(error))
    }

    useEffect(requestProduct, [])

    return (
        <div className="home-page">
            <ScrollToTop />
            <ModernHero />

            <section className="trust-badges-section">
                <div className="container-max">
                    <div className="trust-badges-container">
                        <div className="trust-badge">
                            <Icons.Warranty />
                            <div className="trust-badge-text">
                                <strong>1 Month Warranty</strong>
                                <span>Certified Quality</span>
                            </div>
                        </div>
                        <div className="trust-badge">
                            <Icons.Delivery />
                            <div className="trust-badge-text">
                                <strong>Fast Delivery</strong>
                                <span>Tracked Shipping</span>
                            </div>
                        </div>
                        <div className="trust-badge">
                            <Icons.Return />
                            <div className="trust-badge-text">
                                <strong>30 Days Return</strong>
                                <span>Hassle-free</span>
                            </div>
                        </div>
                        <div className="trust-badge">
                            <Icons.Seller />
                            <div className="trust-badge-text">
                                <strong>Trusted Seller</strong>
                                <span>Verified Devices</span>
                            </div>
                        </div>
                        <div className="trust-badge">
                            <Icons.Payment />
                            <div className="trust-badge-text">
                                <strong>Payment Plan</strong>
                                <span>Klarna Available</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="container-max">
                <section className="featured-links-section">
                    <div className="pre-and-refub">
                        <Link to="preowned" className="link-card preowned-card">
                            <h3>Browse Pre-owned</h3>
                            <span>Shop high-quality used devices</span>
                        </Link>
                        <Link to="wholesale" className="link-card wholesale-card">
                            <h3>Wholesale Portal</h3>
                            <span>Exclusive deals for businesses</span>
                        </Link>
                    </div>
                </section>

                <section className="product-section">
                    <div className="section-header">
                        <h2>Featured Products</h2>
                        <Link to="/preowned" className="text-link">See all products →</Link>
                    </div>
                    <div className='products-grid'>
                        {nProducts && nProducts.slice(0, 4).map(product => {
                            return <SingleProduct key={product._id} product={product}></SingleProduct>
                        })}
                    </div>
                </section>

                <section className="banner-ad-section">
                    <Link to="/preowned">
                        <img className='sub-banner' src="/staticImages/second-banner.png" alt="Special Offer" />
                    </Link>
                </section>

                <section className="product-section alternate-bg">
                    <div className="section-header">
                        <h2>Today's Top Deals</h2>
                    </div>
                    <div className='products-grid top-deals'>
                        {nProducts && nProducts.slice(5, 10).map(product => {
                            return <TopDeals key={product._id} product={product}></TopDeals>
                        })}
                    </div>
                </section>

                <section className="why-us-section">
                    <div id="what-makes">
                        <div className="container-max">
                            <h3>What makes <span>Global Traders</span> the best?</h3>
                            <div className="info">
                                <div className="info-card">
                                    <img src="/logos/whatBest1.svg" alt="phone" />
                                    <h4>High Quality Phones</h4>
                                    <p>Only the best fully functional phones are sold here. 30 day hassle free returns.</p>
                                </div>
                                <div className="info-card">
                                    <img src="/logos/whatBest2.svg" alt="good quality" />
                                    <h4>Authentic Photos</h4>
                                    <p>No shortcuts taken. What you see is what you get.</p>
                                </div>
                                <div className="info-card">
                                    <img src="/logos/whatBest3.svg" alt="approved logo" />
                                    <h4>Trade Certified</h4>
                                    <p>All phones are inspected and certified. Includes full phone history report.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="product-section">
                    <div className="section-header">
                        <h2>Top Rated Devices</h2>
                    </div>
                    <div className='products-grid'>
                        {nProducts && nProducts.map(product => {
                            return <TopDeals key={product._id} product={product}></TopDeals>
                        })}
                    </div>
                </section>
            </main>

            <TradeDifference />
            <Comments />
        </div>
    );
};

export default Home;