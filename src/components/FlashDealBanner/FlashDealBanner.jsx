import React from 'react';
import './FlashDealBanner.css';

const FlashDealBanner = () => {
    return (
        <section className="flash-deal-banner">
            <div className="container-max">
                <div className="banner-wrapper">
                    <div className="banner-content">
                        <span className="deal-badge">FLASH DEAL</span>
                        <h2>Season Finale. <br />Extra 15% OFF.</h2>
                        <div className="promo-code-box">
                            <p>Use code <span className="highlight">UPCELL15</span> at checkout.</p>
                        </div>
                        <button className="sale-btn">Shop the Sale</button>
                    </div>
                    <div className="banner-graphic">
                        <div className="deal-circle">
                            <span className="deal-text">DEALS</span>
                            <span className="sub-text">SAFE FOR WORK</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FlashDealBanner;
