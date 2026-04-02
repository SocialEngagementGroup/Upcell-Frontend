import React from 'react';
import './TradeInAction.css';
import { Link } from 'react-router-dom';

const TradeInAction = () => {
    const popularTradeIns = [
        { model: "iPhone 14 Pro Max", value: "$750" },
        { model: "iPhone 13 Pro", value: "$520" },
        { model: "Samsung S23 Ultra", value: "$640" }
    ];

    return (
        <section className="trade-in-action">
            <div className="container-max">
                <div className="trade-in-container">
                    {/* Left Content */}
                    <div className="trade-content">
                        <h2>Trade-In and Save. <br />Up to $800 back.</h2>
                        <p>
                            Turn your current device into credit toward your next upgrade.
                            It's better for the planet and your wallet. Get an instant valuation in seconds.
                        </p>
                        <button className="valuation-btn">Get Valuation</button>
                    </div>

                    {/* Right Sidebar - Popular Trade-ins */}
                    <div className="trade-popular-sidebar">
                        <div className="popular-card">
                            <h4>Popular Trade-ins</h4>
                            <div className="popular-list">
                                {popularTradeIns.map((item, index) => (
                                    <div key={index} className="popular-item">
                                        <span className="model-name">{item.model}</span>
                                        <span className="model-value">Up to {item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TradeInAction;
