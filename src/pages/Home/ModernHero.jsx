import React from 'react';
import './ModernHero.css';
import { Link } from 'react-router-dom';

const ModernHero = () => {
    return (
        <section className="modern-hero">
            <div className="hero-container container-max">
                <div className="hero-content">
                    <h1 className="hero-title">
                        The Future of <br />
                        IPhone. Today.
                    </h1>
                    <p className="hero-subtitle">
                        Experience the raw power of the titanium-forged iPhone 15 Pro. 
                        Trade in your old device and step into the next era of mobile technology.
                    </p>
                    <div className="hero-actions">
                        <Link to="/shop" className="btn-hero-primary">Shop Now</Link>
                        <Link to="/sell-your-device" className="btn-hero-secondary">Sell Your Device</Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="/staticImages/hero-iphone15.png" alt="iPhone 15 Pro Titanium" />
                </div>
            </div>
        </section>
    );
};

export default ModernHero;
