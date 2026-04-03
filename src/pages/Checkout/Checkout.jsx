import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../../App';
import ScrollToTop from '../../utilities/ScrollToTop';
import './Checkout.css';
import { createLocalOrder, getLocalCartProducts } from '../../utilities/localStore';
import visa from '../../assets/visa.svg';
import mastercard from '../../assets/master.svg';
import americanExpress from '../../assets/americanExpress.svg';
import discover from '../../assets/discover.svg';
import paypal from '../../assets/paypal.svg';
import applePay from '../../assets/applePay.svg';

// Material Icons
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Checkout = () => {
    const params = useParams();
    const { cart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [shipping, setShipping] = useState("standard");
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("stripe");

    useEffect(() => {
        const productIds = params.id === "cart" ? cart : [params.id];
        if (productIds.length > 0) {
            setProducts(getLocalCartProducts(productIds));
        }
    }, [params.id, cart]);

    const calculateSubtotal = () => {
        const productIds = params.id === "cart" ? cart : [params.id];
        return productIds.reduce((acc, id) => {
            const prod = products.find(p => p._id === id);
            return acc + (prod?.price || 0);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const estTax = subtotal * 0.08; // Mock 8% tax
    const shippingCost = shipping === "standard" ? 0 : (shipping === "priority" ? 10.50 : 30.00);
    const total = subtotal + estTax + shippingCost;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            city: e.target.city.value,
            postal: e.target.postalCode.value,
            street: e.target.street.value,
            country: e.target.country.value,
            orders: params.id === "cart" ? cart : [params.id],
            shipping: shipping,
        };

        try {
            const order = createLocalOrder({
                customer: data,
                productIds: data.orders,
                shipping,
                paymentMethod,
            });

            if (params.id === "cart") {
                localStorage.setItem("cart", JSON.stringify([]));
            }

            window.location = `/succeed?order_id=${order._id}`;
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            alert("Something went wrong. Please check your information and try again.");
        }
    };

    return (
        <div className="checkout-page">
            <ScrollToTop />
            
            <div className="container-max">
                <header className="checkout-header">
                    <Link to="/cart" className="back-link">
                        <ArrowBackIosNewIcon />
                        <span>Return to cart</span>
                    </Link>
                    <h1>Checkout</h1>
                </header>

                <div className="checkout-layout">
                    {/* Left: Customer Form */}
                    <main className="checkout-form-section">
                        <form onSubmit={handleSubmit} className="modern-form">
                            <section className="form-group">
                                <h3>Contact Information</h3>
                                <div className="input-row">
                                    <input type="email" name="email" placeholder="Email address" required />
                                    <input type="tel" name="phone" placeholder="Phone number" required />
                                </div>
                            </section>

                            <section className="form-group">
                                <h3>Shipping Address</h3>
                                <input type="text" name="name" placeholder="Full name" required />
                                <input type="text" name="street" placeholder="Street address" required />
                                <div className="input-row">
                                    <input type="text" name="city" placeholder="City" required />
                                    <input type="text" name="postalCode" placeholder="Postal code" required />
                                </div>
                                <input type="text" name="country" placeholder="Country" required />
                            </section>

                            <section className="form-group">
                                <h3>Shipping Method</h3>
                                <div className="shipping-options">
                                    <label className={`shipping-card ${shipping === 'standard' ? 'active' : ''}`}>
                                        <input type="radio" name="shipping" value="standard" checked={shipping === 'standard'} onChange={() => setShipping('standard')} />
                                        <div className="card-info">
                                            <span>Standard Shipping</span>
                                            <small>5-7 business days</small>
                                        </div>
                                        <strong>Free</strong>
                                    </label>
                                    <label className={`shipping-card ${shipping === 'priority' ? 'active' : ''}`}>
                                        <input type="radio" name="shipping" value="priority" checked={shipping === 'priority'} onChange={() => setShipping('priority')} />
                                        <div className="card-info">
                                            <span>Priority Shipping</span>
                                            <small>2-3 business days</small>
                                        </div>
                                        <strong>$10.50</strong>
                                    </label>
                                </div>
                            </section>

                            <section className="form-group">
                                <h3>Payment Method</h3>
                                <div className="payment-options">
                                    <label className={`shipping-card ${paymentMethod === 'stripe' ? 'active' : ''}`}>
                                        <input type="radio" name="payment" value="stripe" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} />
                                        <div className="card-info">
                                            <span>Card / Apple Pay / Google Pay</span>
                                            <small>Secure checkout via Stripe</small>
                                        </div>
                                    </label>
                                    <label className={`shipping-card ${paymentMethod === 'paypal' ? 'active' : ''}`}>
                                        <input type="radio" name="payment" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                                        <div className="card-info">
                                            <span>PayPal</span>
                                            <small>Pay with your PayPal account</small>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            <div className="form-footer">
                                <p className="secure-text"><LockOutlinedIcon /> All transactions are secure and encrypted.</p>
                                <button type="submit" className="btn-continue-payment" disabled={isLoading}>
                                    {isLoading ? 'Processing...' : 'Complete Purchase'}
                                </button>
                            </div>
                        </form>
                    </main>

                    {/* Right: Order Summary Sidebar */}
                    <aside className="checkout-summary-sidebar">
                        <div className="summary-card-header">
                            <h2>Order Summary</h2>
                            <span>({(params.id === "cart" ? cart : [params.id]).length}) Items</span>
                        </div>
                        
                        <div className="checkout-items-list">
                            {(params.id === "cart" ? cart : [params.id]).map((id) => {
                                const prod = products.find(p => p._id === id);
                                if (!prod) return null;
                                return (
                                    <div key={id} className="checkout-summary-item">
                                        <div className="img-box"><img src={prod.image} alt={prod.productName} /></div>
                                        <div className="details">
                                            <h4>{prod.productName}</h4>
                                            <span>{prod.color?.name}, {prod.storage}</span>
                                        </div>
                                        <div className="price">${prod.price}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="financial-rows">
                            <div className="fin-row">
                                <span>Subtotal</span>
                                <strong>${subtotal.toFixed(2)}</strong>
                            </div>
                            <div className="fin-row">
                                <span>Tax (Estimated)</span>
                                <strong>${estTax.toFixed(2)}</strong>
                            </div>
                            <div className="fin-row">
                                <span>Shipping</span>
                                <strong className={shippingCost === 0 ? 'free' : ''}>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</strong>
                            </div>
                            <div className="fin-row total">
                                <span>Total</span>
                                <strong>${total.toFixed(2)}</strong>
                            </div>
                        </div>

                        <div className="payment-icons">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '32px' }}>
                                {[visa, mastercard, americanExpress, discover, paypal, applePay].map((icon, index) => (
                                    <img key={index} src={icon} alt="Accepted payment method" style={{ width: '100%', height: '36px', objectFit: 'contain' }} />
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {isLoading && (
                <div className="checkout-loading-overlay">
                    <div className="spinner-premium"></div>
                    <p>Securing your checkout session...</p>
                </div>
            )}
        </div>
    );
};

export default Checkout;
