import React from 'react';
import { Link } from 'react-router-dom';
import { getOrderById, getStoredOrders } from '../../utilities/localStore';
import ScrollToTop from '../../utilities/ScrollToTop';
import './ThankYou.css';

// Material Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

const ThankYou = () => {
    const orderId = new URLSearchParams(window.location.search).get("order_id");
    const order = (orderId ? getOrderById(orderId) : null) || getStoredOrders()[0] || null;
    const orderItems = order?.line_items?.filter((item) => item?.price_data?.product_data?.metadata?.productId) || [];
    const subtotal = orderItems.reduce((total, item) => total + (item?.price_data?.product_data?.metadata?.totalPaid || 0), 0);
    const shippingItem = order?.line_items?.find((item) => !item?.price_data?.product_data?.metadata?.productId);
    const shippingTotal = shippingItem?.price_data?.product_data?.metadata?.totalPaid || 0;
    const taxEstimate = subtotal * 0.08;
    const grandTotal = subtotal + shippingTotal + taxEstimate;

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
                        <strong>{order?._id || "Unavailable"}</strong>
                    </div>
                    <div className="info-col">
                        <span>ORDER DATE</span>
                        <strong>{order ? new Date(order.createdAt).toLocaleDateString() : "Unavailable"}</strong>
                    </div>
                    <div className="info-col">
                        <span>PAYMENT</span>
                        <strong>{order?.paidWith || "Card"}</strong>
                    </div>
                </div>

                {/* Shipping Status Bar */}
                <div className="delivery-bar">
                    <div className="delivery-icon-text">
                        <LocalShippingOutlinedIcon className="truck-icon" />
                        <div className="delivery-info">
                            <span>Estimated Arrival</span>
                            <strong>{order ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString() : "Pending"}</strong>
                        </div>
                    </div>
                    <div className="delivery-method">
                        <span>{order?.shipping === "priority" ? "Priority Shipping" : "Standard Shipping"}</span>
                        <strong>Tracking available upon dispatch</strong>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="confirmation-grid">
                    {/* Left: Order Summary */}
                    <main className="order-summary-card">
                        <h2>Order Summary</h2>
                        <div className="order-items-list">
                            {orderItems.map((item, i) => {
                                const product = item.price_data.product_data;
                                return (
                                <div key={i} className="summary-item">
                                    <div className="item-img-box">
                                        <img src={product.images?.[0]} alt={product.name} />
                                    </div>
                                    <div className="item-details">
                                        <h3>{product.name}</h3>
                                        <span className="item-variant">{product.description}</span>
                                        <span className="item-qty">Qty: {product.metadata?.quantity}</span>
                                    </div>
                                    <div className="item-price">
                                        ${(product.metadata?.totalPaid || 0).toFixed(2)}
                                    </div>
                                </div>
                            )})}
                        </div>

                        <div className="financial-summary">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <strong>${subtotal.toFixed(2)}</strong>
                            </div>
                            <div className="summary-row">
                                <span>Tax (Estimated)</span>
                                <strong>${taxEstimate.toFixed(2)}</strong>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <strong className="free-text">{shippingTotal === 0 ? "Free" : `$${shippingTotal.toFixed(2)}`}</strong>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <strong>${grandTotal.toFixed(2)}</strong>
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
