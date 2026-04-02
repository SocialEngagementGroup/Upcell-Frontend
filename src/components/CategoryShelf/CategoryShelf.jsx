import React from 'react';
import './CategoryShelf.css';
import { Link } from 'react-router-dom';

const CategoryShelf = () => {
    return (
        <section className="category-shelf">
            <div className="container-max">
                <div className="category-grid">
                    {/* Left Column - Large iPhone Card */}
                    <div className="category-card card-large iphone-card">
                        <div className="card-content">
                            <h3>iPhone</h3>
                            <p>The world's most powerful personal device.</p>
                            <Link to="/shop?category=iphone" className="explore-link">
                                Explore All <span className="arrow">→</span>
                            </Link>
                        </div>
                        <div className="card-image">
                            <img src="/staticImages/category-iphone.png" alt="iPhone Category" />
                        </div>
                    </div>

                    {/* Right Column - iPad & MacBook Stack */}
                    <div className="category-stack">
                        {/* iPad Card */}
                        <div className="category-card card-small ipad-card">
                            <div className="card-content">
                                <h3>iPad</h3>
                                <p>Versatility meets portability.</p>
                                <Link to="/shop?category=ipad" className="shop-link">Shop iPad</Link>
                            </div>
                            <div className="card-image">
                                <img src="/staticImages/category-ipad.png" alt="iPad Category" />
                            </div>
                        </div>

                        {/* MacBook Card (Dark Theme) */}
                        <div className="category-card card-small macbook-card dark-theme">
                            <div className="card-content">
                                <h3>MacBook</h3>
                                <p>Mind-blowing power. Heart-stopping speed.</p>
                                <Link to="/shop?category=macbook" className="shop-link">Shop Mac</Link>
                            </div>
                            <div className="card-image">
                                <img src="/staticImages/category-macbook.png" alt="MacBook Category" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryShelf;
