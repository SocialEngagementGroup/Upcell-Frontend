import React from 'react';
import './FeaturedUnits.css';
import { Link } from 'react-router-dom';

import allDummyProducts from '../../utilities/dummyData';

const FeaturedUnits = () => {
    // Pick the first few unique products for the home page
    const products = allDummyProducts.slice(0, 6).map(p => ({
        id: p._id,
        label: p.category === "IPHONE" ? "AVAILABLE NOW" : p.category === "MACBOOK" ? "POWERHOUSE" : "CREATIVE TOOL",
        title: p.productName,
        price: `$${p.price}`,
        image: p.image,
        parentId: p.parentId,
        productId: p._id
    }));



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
                        <Link 
                            to={`/iphone/${product.parentId}/${product.productId}`} 
                            key={product.id} 
                            className="unit-card"
                        >
                            <div className="unit-image-wrapper">
                                <img src={product.image} alt={product.title} />
                            </div>
                            <div className="unit-info">
                                <span className="unit-label">{product.label}</span>
                                <h3 className="unit-title">{product.title}</h3>
                                <div className="unit-footer">
                                    <span className="unit-price">{product.price}</span>
                                    <button className="buy-now-btn" onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        // Potential cart logic here
                                    }}>Buy Now</button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FeaturedUnits;
