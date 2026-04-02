import React from 'react';
import './FeaturedUnits.css';
import { Link } from 'react-router-dom';

const FeaturedUnits = () => {
    const products = [
        {
            id: 1,
            label: "AVAILABLE NOW",
            title: "iPhone 15 Pro Max",
            price: "$1,099",
            image: "https://via.placeholder.com/300x300?text=iPhone+15+Pro+Max"
        },
        {
            id: 2,
            label: "POWERHOUSE",
            title: "MacBook Pro 14\" M3",
            price: "$1,599",
            image: "https://via.placeholder.com/300x300?text=MacBook+Pro+M3"
        },
        {
            id: 3,
            label: "CREATIVE TOOL",
            title: "iPad Pro 12.9\"",
            price: "$949",
            image: "https://via.placeholder.com/300x300?text=iPad+Pro+12.9"
        }
    ];

    return (
        <section className="featured-units">
            <div className="container-max">
                <div className="section-header-row">
                    <div className="header-text">
                        <h2>Featured Units</h2>
                        <p>Hand-picked precision, rigorously tested.</p>
                    </div>
                    <Link to="/shop" className="view-all-link">View All Devices <span className="arrow">→</span></Link>
                </div>
                
                <div className="units-grid">
                    {products.map(product => (
                        <div key={product.id} className="unit-card">
                            <div className="unit-image-wrapper">
                                <img src={product.image} alt={product.title} />
                            </div>
                            <div className="unit-info">
                                <span className="unit-label">{product.label}</span>
                                <h3 className="unit-title">{product.title}</h3>
                                <div className="unit-footer">
                                    <span className="unit-price">{product.price}</span>
                                    <button className="buy-now-btn">Buy Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedUnits;
