import React from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../../utilities/ScrollToTop';
import './ThankYou.css';

// Material Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

const ThankYou = () => {
    // Mock data for the demonstration as per user image
    const orderItems = [
        {
            name: "iPhone 15 Pro",
            variant: "Natural Titanium, 256GB",
            qty: 1,
            price: 1099.00,
            image: "https://via.placeholder.com/100x120?text=iPhone+15"
        },
        {
            name: "iPhone 15 Pro Clear Case",
            variant: "MagSafe Compatible",
            qty: 1,
            price: 49.00,
            image: "https://via.placeholder.com/100x120?text=Clear+Case"
        }
    ];

    const accessories = [
        {
            name: "AirPods Pro (2nd Gen)",
            desc: "Ultimate noise cancellation.",
            price: 249.00,
            image: "https://via.placeholder.com/200x200?text=AirPods"
        },
        {
            name: "MagSafe Charger",
            desc: "Fast wireless charging.",
            price: 39.00,
            image: "https://via.placeholder.com/200x200?text=Charger"
        }
    ];

    return (
        <div className="thank-you-page">
            <ScrollToTop />
            
            <div className="container-max">
                {/* Success Header */}
                <header className="confirmation-header">
                    <div className="check-icon-box">
                        <CheckCircleIcon className="check-icon" />
                    </div>
                    <h1>Order Confirmed</h1>
                    <p>Thank you for choosing UpCell. Your order is being processed and will be ready for shipment shortly.</p>
                </header>

                {/* Order Details Bar */}
                <div className="order-info-strip">
                    <div className="info-col">
                        <span>ORDER ID</span>
                        <strong>#UC-94827105</strong>
                    </div>
                    <div className="info-col">
                        <span>ORDER DATE</span>
                        <strong>Oct 09, 2024</strong>
                    </div>
                    <div className="info-col">
                        <span>PAYMENT</span>
                        <strong>Apple Pay</strong>
                    </div>
                </div>

                {/* Shipping Status Bar */}
                <div className="delivery-bar">
                    <div className="delivery-icon-text">
                        <LocalShippingOutlinedIcon className="truck-icon" />
                        <div className="delivery-info">
                            <span>Estimated Arrival</span>
                            <strong>Thursday, Oct 12</strong>
                        </div>
                    </div>
                    <div className="delivery-method">
                        <span>Standard Shipping</span>
                        <strong>Tracking available upon dispatch</strong>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="confirmation-grid">
                    {/* Left: Order Summary */}
                    <main className="order-summary-card">
                        <h2>Order Summary</h2>
                        <div className="order-items-list">
                            {orderItems.map((item, i) => (
                                <div key={i} className="summary-item">
                                    <div className="item-img-box">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <span className="item-variant">{item.variant}</span>
                                        <span className="item-qty">Qty: {item.qty}</span>
                                    </div>
                                    <div className="item-price">
                                        ${item.price.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="financial-summary">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <strong>$1,148.00</strong>
                            </div>
                            <div className="summary-row">
                                <span>Tax (Estimated)</span>
                                <strong>$91.84</strong>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <strong className="free-text">Free</strong>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <strong>$1,239.84</strong>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button className="btn-view-order">View Order Details</button>
                            <Link to="/shop" className="btn-continue-shopping">Continue Shopping</Link>
                        </div>
                    </main>

                    {/* Right: Essential Accessories */}
                    <aside className="accessories-suggestion">
                        <div className="sidebar-header">
                            <h2>Essential Accessories</h2>
                            <span className="add-now-badge">ADD NOW</span>
                        </div>
                        <div className="accessories-card-list">
                            {accessories.map((item, i) => (
                                <div key={i} className="accessory-suggest-card">
                                    <div className="suggest-img-box">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="suggest-details">
                                        <h3>{item.name}</h3>
                                        <p>{item.desc}</p>
                                        <div className="suggest-footer">
                                            <span>${item.price.toFixed(2)}</span>
                                            <button className="btn-add-to-order">Add to Order</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;