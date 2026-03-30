import React from 'react';
import './ModernHero.css';
import { Link } from 'react-router-dom';

const ModernHero = () => {
    return (
        <section className="modern-hero">
            <div className="hero-container container-max">
                <div className="hero-content">
                    <span className="hero-badge">Refurbished & Reliable</span>
                    <h1 className="hero-title">
                        Tech you love, <br />
                        <span>for a price you'll adore.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Up to 40% cheaper than new. Professionally inspected, 
                        certified, and ready for a second life.
                    </p>
                    <div className="hero-actions">
                        <Link to="/preowned" className="btn-primary">Shop Pre-owned</Link>
                        <Link to="/wholesale" className="btn-secondary">Wholesale Portal</Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="/staticImages/banner.png" alt="Featured iPhones" />
                    <div className="image-accent"></div>
                </div>
            </div>
        </section>
    );
};

export default ModernHero;
